import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,base='http://127.0.0.1:8243/']=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for (const [name,type] of Object.entries({chromium,webkit})) {
    const browser=await type.launch();
    try {
        const page=await browser.newPage({viewport:{width:1100,height:900}}), errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.goto(new URL('l07',base).href);
        const tabs=page.locator('#tabs-demo');
        await tabs.getByRole('tab',{name:'Customer',exact:true}).waitFor();
        const data=path=>page.evaluate(path=>gramlot.data.getItem(path),path);
        const events=async()=>String(await data('tabsDemo.events')).trim().split('\n').filter(Boolean);
        await page.waitForFunction(()=>gramlot.data.getItem('tabsDemo.events').includes('selected:'));
        assert.equal((await events()).length,1);
        await page.locator('#tabs-name input').fill('A');
        await page.evaluate(()=>{window.retainedField=document.querySelector('#tabs-name');window.retainedPanel=document.querySelector('#customer-panel');});
        await tabs.getByRole('tab',{name:/^Notes(?: \d+)?$/}).click();
        assert.equal(await data('tabsDemo.page'),'notes');assert.equal(await data('tabsDemo.index'),1);
        assert.deepEqual((await events()).slice(1).map(x=>x.split(':')[0]),['hiding','showing','selected','selected']);
        await page.locator('#tabs-notes textarea').fill('Saved before closing');
        await tabs.getByRole('tab',{name:'Customer',exact:true}).click();
        assert.equal(await page.locator('#tabs-name input').inputValue(),'A');assert.equal(await data('tabsDemo.name'),'Ada');
        assert.ok(await page.evaluate(()=>retainedField===document.querySelector('#tabs-name')&&retainedPanel===document.querySelector('#customer-panel')));
        await page.locator('#tabs-lock input').check();
        await tabs.getByRole('button',{name:'Close Notes',exact:true}).click();
        assert.equal(await tabs.getByRole('tab',{name:/^Notes(?: \d+)?$/}).count(),1);
        await page.locator('#tabs-lock input').uncheck();
        await tabs.getByRole('tab',{name:/^Notes(?: \d+)?$/}).click();
        const before=(await events()).length;
        await tabs.getByRole('button',{name:'Close Notes',exact:true}).click();
        assert.equal(await tabs.getByRole('tab',{name:/^Notes(?: \d+)?$/}).count(),0);
        assert.equal(await data('tabsDemo.notes'),'Saved before closing');assert.equal(await data('tabsDemo.page'),'layout');assert.equal(await data('tabsDemo.index'),1);
        assert.deepEqual((await events()).slice(before).map(x=>x.split(':')[0]),['closing','hiding','showing','selected','selected','closed']);
        await tabs.getByRole('tab',{name:'Nested border',exact:true}).press('Home');
        assert.equal(await data('tabsDemo.page'),'customer');
        assert.equal(await page.locator('#tabs-name input').inputValue(),'A');
        await page.setViewportSize({width:390,height:844});
        assert.ok(await tabs.evaluate(el=>el.getBoundingClientRect().width<=390));
        const n=(await events()).length;
        await tabs.getByRole('tab',{name:'Customer',exact:true}).click();assert.equal((await events()).length,n);
        await page.screenshot({path:`/tmp/selected-tabs-${name}.png`,fullPage:true});
        // The catalogue-sized iframe stack has its own focused browser check.
        const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
        const mobile=await touch.newPage();mobile.on('pageerror',e=>errors.push(e.message));
        await mobile.goto(new URL('l07',base).href);
        const mobileTabs=mobile.locator('#tabs-demo');
        await mobileTabs.getByRole('tab',{name:/^Notes(?: \d+)?$/}).tap();
        assert.equal(await mobile.evaluate(()=>gramlot.data.getItem('tabsDemo.page')),'notes');
        assert.ok(await mobileTabs.evaluate(el=>el.getBoundingClientRect().width<=390));
        await mobileTabs.getByRole('button',{name:'Close Notes',exact:true}).tap();
        assert.equal(await mobile.evaluate(()=>gramlot.data.getItem('tabsDemo.page')),'layout');
        await mobile.screenshot({path:`/tmp/selected-touch-${name}.png`,fullPage:true});
        await mobileTabs.getByRole('tab',{name:'Customer',exact:true}).tap();
        await mobile.locator('#tabs-name input').fill('A');
        const mobileChoose=async(id,label)=>{
            await mobile.locator('#'+id+' .toggle').tap();
            await mobile.locator('#'+id).getByRole('option',{name:label,exact:true}).tap();
        };
        // Notes has been closed, while Customer and the nested panel stay mounted.
        await mobileTabs.getByRole('tab',{name:'Customer',exact:true}).tap();
        for (const mode of ['Tabs','Underline']) for (const position of ['Top','Bottom','Left','Right']) {
            await mobileChoose('tabs-mode',mode);await mobileChoose('tabs-position',position);
            const dimensions=await mobileTabs.evaluate(el=>({
                width:el.getBoundingClientRect().width,
                panel:el.shadowRoot.querySelector('.panels').getBoundingClientRect().width,
                document:el.ownerDocument.documentElement.scrollWidth
            }));
            assert.ok(dimensions.width<=390 && dimensions.panel>=130 && dimensions.document<=390,JSON.stringify(dimensions));
            assert.equal(await mobile.locator('#tabs-name input').inputValue(),'A');
            await mobileTabs.screenshot({path:`/tmp/tabs-touch-${mode}-${position}-${name}.png`});
        }
        await touch.close();
        await page.setViewportSize({width:1200,height:900});
        await page.goto(base);
        await page.locator('#gallery-settings-toggle').waitFor();
        if (!await page.locator('#open-l07').isVisible()) {
            await page.locator('details').filter({has:page.locator('#open-l07')}).locator('summary').first().click();
        }
        await page.locator('#open-l07').click();
        const themed=page.frameLocator('#frame-l07');
        for (const profile of ['mimi','joanna']) {
            for (const scheme of ['light','dark']) {
                await page.locator('#gallery-settings-toggle').click();
                await page.locator('#index-appearance').selectOption(profile);
                await page.locator('#index-theme').selectOption(scheme);
                await page.locator('[aria-label="Close settings"]').click();
                const tab=themed.locator('#tabs-demo').getByRole('tab',{name:'Customer',exact:true});
                const height=profile==='mimi'?24:26;
                await tab.evaluate((el,height)=>new Promise(resolve=>{
                    const check=()=>getComputedStyle(el).minHeight===height+'px'?resolve():requestAnimationFrame(check);check();
                }),height);
                const choose=async(id,label)=>{
                    await themed.locator('#'+id+' .toggle').click();
                    await themed.locator('#'+id).getByRole('option',{name:label,exact:true}).click();
                };
                await themed.locator('#tabs-name input').fill('A');
                await themed.locator('#tabs-name').evaluate(el=>el.ownerDocument.retainedTabField=el);
                const logBefore=await themed.locator('#tabs-events').innerText();
                await themed.locator('#tabs-unread input').press('End');
                const notes=themed.locator('#tabs-demo').getByRole('tab',{name:'Notes 12',exact:true});
                await notes.waitFor();
                assert.equal(await tab.getAttribute('aria-selected'),'true');
                await choose('tabs-icon','Star');
                await choose('tabs-badge-color','Green');
                assert.equal(await notes.locator('.icon').textContent(),'★');
                assert.equal(await notes.locator('.badge').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(46, 139, 87)');
                for (const mode of ['Tabs','Underline']) for (const position of ['Top','Bottom','Left','Right']) {
                    await choose('tabs-mode',mode);await choose('tabs-position',position);
                    const container=themed.locator('#tabs-demo');
                    const boxes=await container.evaluate(el=>{
                        const r=x=>{const {x:y,y:z,width,height}=x.getBoundingClientRect();return {x:y,y:z,width,height};};
                        return {strip:r(el.shadowRoot.querySelector('.tabs')),panel:r(el.shadowRoot.querySelector('.panels')),host:r(el)};
                    });
                    const {strip,panel}=boxes;
                    if(position==='Top') assert.ok(strip.y+strip.height<=panel.y+1);
                    if(position==='Bottom') assert.ok(panel.y+panel.height<=strip.y+1);
                    if(position==='Left') assert.ok(strip.x+strip.width<=panel.x+1);
                    if(position==='Right') assert.ok(panel.x+panel.width<=strip.x+1);
                    assert.ok(panel.width>150 && panel.height>150,JSON.stringify(boxes));
                    assert.equal(await themed.locator('#tabs-name input').inputValue(),'A');
                    assert.ok(await themed.locator('#tabs-name').evaluate(el=>el.ownerDocument.retainedTabField===el));
                    assert.equal(await themed.locator('#tabs-events').innerText(),logBefore);
                    await container.screenshot({path:`/tmp/tabs-${profile}-${scheme}-${mode}-${position}-${name}.png`});
                }
                await choose('tabs-position','Left');
                await tab.press('ArrowDown');assert.equal(await notes.getAttribute('aria-selected'),'true');
                const close=themed.locator('#tabs-demo').getByRole('button',{name:'Close Notes',exact:true});
                assert.ok(await close.isVisible());
                await tab.click();
                await choose('tabs-position','Top');await choose('tabs-mode','Tabs');

            }
        }
        assert.deepEqual(errors,[]);
        console.log(`${name}: Python l07, initial/ordered events, dual bindings, veto, Source close, retained Data/draft/DOM, nested border, keyboard and mobile passed`);
    } finally {await browser.close();}
}
