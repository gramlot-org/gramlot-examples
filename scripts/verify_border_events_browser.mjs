import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, base='http://127.0.0.1:8243/']=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for (const [engine,type] of Object.entries({chromium,webkit})) {
    const browser=await type.launch();
    try {
        const page=await browser.newPage({viewport:{width:1200,height:1100}}), errors=[];
        page.on('pageerror', error=>errors.push(error.message));
        await page.goto(new URL('l06',base).href);
        const border=page.locator('#events-border');
        await page.locator('#events-name input').waitFor();
        const data=path=>page.evaluate(path=>gramlot.data.getItem(`events.${path}`),path);
        const drawer=border.locator('.separator[data-side=left] .drawer').first();
        const splitter=side=>border.locator(`.separator[data-side=${side}]`).first();
        const payload=async name=>JSON.parse(await data(`${name}Payload`));
        assert.equal(await data('drawerCount'),0,'no initial visibility publication');
        assert.equal(await data('resizeCount'),0,'no initial resize publication');
        await page.evaluate(()=>{window.retained={name:document.getElementById('events-name'),note:document.getElementById('events-note')};});
        await page.locator('#events-name input').fill('A');await page.locator('#events-name input').press('Tab');
        await page.locator('#events-note textarea').fill('Preserved after notifications');await page.locator('#events-note textarea').press('Tab');
        await drawer.click();
        assert.equal(await data('drawerCount'),1);
        assert.deepEqual(await payload('drawer'),{open:false,region:'left'});
        assert.equal(await drawer.getAttribute('aria-expanded'),'false');
        await drawer.click();
        assert.equal(await data('drawerCount'),2);
        assert.deepEqual(await payload('drawer'),{open:true,region:'left'});
        await page.locator('#events-hide input').check();
        assert.equal(await data('drawerCount'),3);
        await page.evaluate(()=>gramlot.data.setItem('events.hideFilters',true));
        assert.equal(await data('drawerCount'),3,'equal Data does not duplicate a notification');
        await page.locator('#events-hide input').uncheck();
        assert.equal(await data('drawerCount'),4);
        assert.equal(await data('resizeCount'),0,'visibility changes do not resize-publish');

        // Subscribers must see committed geometry/visibility and released pointer capture.
        await page.evaluate(()=>{
            window.observed=[];
            const bc=document.getElementById('events-border');
            gramlot.subscribe('eventWorkspace_splitter_resize', p=>{
                const sep=bc.shadowRoot.querySelector(`[data-side=${p.region}].separator`);
                observed.push({kind:'resize',payload:p,covered:bc.shadowRoot.querySelector('.drag-cover').hasAttribute('data-active'),size:bc.control.style.getPropertyValue(`--${p.region}`)});
            });
            gramlot.subscribe('eventFilters_closable_change', p=>observed.push({kind:'drawer',payload:p,hidden:bc.shadowRoot.querySelector('#region-left').hidden}));
        });
        await splitter('left').focus();await page.keyboard.press('ArrowRight');
        assert.equal(await data('resizeCount'),1);
        assert.deepEqual(await payload('resize'),{region:'left',size:'131px',previousSize:'130px'});
        const box=await splitter('left').boundingBox();
        await page.mouse.move(box.x+box.width/2,box.y+18);await page.mouse.down();
        await page.mouse.move(box.x+box.width/2+45,box.y+18,{steps:5});
        assert.equal(await data('resizeCount'),1,'live movement does not publish completion');
        await page.mouse.up();
        assert.equal(await data('resizeCount'),2);
        const resized=await payload('resize');assert.equal(resized.region,'left');assert.equal(resized.previousSize,'131px');assert(Math.abs(parseFloat(resized.size)-176)<2);
        // Click without movement and constrained/no-op keyboard steps emit nothing.
        const still=await splitter('left').boundingBox();
        await page.mouse.click(still.x+still.width/2,still.y+18);
        assert.equal(await data('resizeCount'),2);
        await page.evaluate(()=>{
            const pane=gramlot.dom.getBaseSourceNode(document.getElementById('events-name').parentElement);
            window.filterSource=pane;
            pane.setAttr({width:'230px'});
        });
        assert.equal(await data('resizeCount'),2,'authored width change is not a splitter gesture');
        await splitter('left').focus();await page.keyboard.press('ArrowRight');
        assert.equal(await data('resizeCount'),2,'maxSize no-op');
        await splitter('bottom').focus();await page.keyboard.press('ArrowDown');
        assert.equal(await data('resizeCount'),3);
        assert.deepEqual(await payload('resize'),{region:'bottom',size:'51px',previousSize:'52px'});
        // Drawer Source changes and a closed-handle drag share the same publication path.
        await page.evaluate(()=>filterSource.setAttr({drawer:'close'}));
        assert.equal(await data('drawerCount'),5);
        const closed=await drawer.boundingBox();
        await page.mouse.move(closed.x+closed.width/2,closed.y+closed.height/2);await page.mouse.down();
        await page.mouse.move(closed.x+closed.width/2+110,closed.y+closed.height/2,{steps:5});
        assert.equal(await data('drawerCount'),6);
        assert.equal(await data('resizeCount'),3);
        await page.mouse.up();assert.equal(await data('resizeCount'),4);
        assert.equal((await payload('resize')).previousSize,'0px');
        assert.equal(await data('drawerCount'),6,'release click must not toggle again');
        // Retained size after pointer cancellation also has one completion notification.
        const cancelBox=await splitter('left').boundingBox();
        await page.mouse.move(cancelBox.x+cancelBox.width/2,cancelBox.y+18);await page.mouse.down();
        await page.mouse.move(cancelBox.x+cancelBox.width/2+20,cancelBox.y+18,{steps:3});
        await splitter('left').dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();
        assert.equal(await data('resizeCount'),5);
        await page.setViewportSize({width:1100,height:1000});assert.equal(await data('resizeCount'),5,'window resize does not publish splitter completion');
        assert.equal(await page.locator('#events-name input').inputValue(),'A');
        assert.equal(await data('name'),'Ada');
        assert.equal(await data('note'),'Preserved after notifications');
        assert(await page.evaluate(()=>Object.values(retained).every(el=>el.isConnected&&document.getElementById(el.id)===el)));
        const observations=await page.evaluate(()=>observed);
        for(const event of observations) {
            if(event.kind==='resize') {assert.equal(event.covered,false);assert.equal(event.size,event.payload.size);}
            else assert.equal(event.hidden,!event.payload.open);
        }
        assert.deepEqual(errors,[]);
        await page.screenshot({path:`/tmp/border-events-${engine}.png`,fullPage:true});
        await page.close();
        console.log(`${engine}: Python l06, controller payloads, Data changes, no-ops, completion timing, keyboard, cancellation, closed drag and retained draft/Data/DOM passed`);
    } finally {await browser.close();}
}
