/** Qualify the same toolbar and retained lesson across desktop/mobile layouts. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
import {galleryRow} from './gallery-navigation.mjs';
for (const url of process.argv.slice(2)) for (const engine of [chromium, webkit]) {
    const browser = await engine.launch({headless:true});
    try {
        const page = await browser.newPage({viewport:{width:1280,height:850}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(url);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        const rail = page.locator('#gallery-rail');
        const navigation = page.locator('#gallery-navigation-button button');
        const settings = page.locator('#gallery-settings-button button');
        const inspector = page.locator('#gallery-inspector button');
        await navigation.waitFor();
        const toolbar = await rail.elementHandle();
        assert.equal(await rail.getAttribute('aria-orientation'), 'vertical');
        const top = await navigation.boundingBox(), bottom = await settings.boundingBox();
        assert.ok(top.y >= 42 && top.y < 50 && bottom.y > 780, JSON.stringify({top,bottom}));
        const inspectorBox = await inspector.boundingBox();
        assert.ok(inspectorBox.y < bottom.y && bottom.y - inspectorBox.y < 55);
        const checkChrome = async () => {
            const colors = await page.evaluate(() => {
                const header = getComputedStyle(document.querySelector('.gallery-toolbar'));
                return {header:header.backgroundColor, rail:getComputedStyle(document.getElementById('gallery-rail-region')).backgroundColor,
                    border:header.borderTopWidth};
            });
            assert.equal(colors.header, colors.rail);
            assert.equal(colors.border, '0px');
        };
        await checkChrome();
        assert.equal(await page.locator('#gallery-regions [data-side="left"] .drawer').isVisible(), false);
        const splitter = page.locator('#gallery-regions .separator[data-side="left"]');
        const oldWidth = await page.locator('#index-sidebar').evaluate(el => el.getBoundingClientRect().width);
        await splitter.focus(); await splitter.press('ArrowRight');
        assert.ok(await page.locator('#index-sidebar').evaluate(el => el.getBoundingClientRect().width) > oldWidth);
        await inspector.click();
        await page.locator('gramlot-tools-inspector gramlot-poc-palette').waitFor({state:'visible'});
        assert.equal(await inspector.getAttribute('aria-checked'), 'true');
        await inspector.click();
        await page.locator('gramlot-tools-inspector').waitFor({state:'detached'});
        assert.equal(await inspector.getAttribute('aria-checked'), 'false');
        await navigation.click();
        await page.waitForFunction(() => !gramlot.data.getItem('galleryIndex.navigationOpen'));
        await navigation.click();
        await (await galleryRow(page, 'w01')).click();
        const field = page.frameLocator('#frame-w01').locator('#customer input');
        await field.fill('Toolbar retained draft'); await field.press('Tab');
        const frame = await page.locator('#frame-w01').elementHandle();
        await settings.click();
        await page.locator('#index-appearance').waitFor({state:'visible'});
        const choose = async (id, caption) => {
            await page.locator(`#${id} input`).fill(caption);
            await page.locator(`#${id}`).getByRole('option', {name:caption, exact:true}).click();
        };
        await choose('index-theme', 'Dark');
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
        assert.equal(await page.locator('#gallery-settings dialog').evaluate(el => el.matches(':modal')), false);
        await field.fill('Toolbar retained draft'); await field.press('Tab');
        assert.equal(await page.locator('#gallery-settings dialog').isVisible(), true);
        await choose('index-palette', 'Sage & green');
        await choose('gallery-label-position', 'Top left');
        await checkChrome();
        if (url === process.argv[2] && engine === chromium) await page.screenshot({path:'/tmp/gramlot-gallery-rail-dark.png'});
        await choose('index-theme', 'Light');
        await page.locator('#gallery-settings button[aria-label="Close window"]').click();
        await page.waitForFunction(() => !gramlot.data.getItem('galleryIndex.settingsOpen'));
        assert.equal(await settings.getAttribute('aria-checked'), 'false');
        await settings.click();
        await page.locator('#index-appearance').waitFor({state:'visible'});
        if (url === process.argv[2] && engine === chromium) await page.screenshot({path:'/tmp/gramlot-gallery-settings-desktop.png'});
        await settings.click();
        await page.setViewportSize({width:390,height:844});
        await page.waitForFunction(() => document.getElementById('gallery-rail').getAttribute('aria-orientation') === 'horizontal');
        const phoneTop = await navigation.boundingBox(), phoneBottom = await settings.boundingBox();
        assert.ok(phoneTop.y >= 780 && phoneTop.y === phoneBottom.y, JSON.stringify({phoneTop,phoneBottom}));
        assert.ok(phoneTop.x < 10 && phoneBottom.x > 330, JSON.stringify({phoneTop,phoneBottom}));
        assert.equal(await toolbar.evaluate(el => el === document.getElementById('gallery-rail')), true);
        await navigation.click();
        await page.locator('#gallery-navigation-tree').waitFor({state:'visible'});
        await navigation.click();
        await settings.click();
        await page.locator('#index-appearance').waitFor({state:'visible'});
        const floatingRect = await page.locator('#gallery-settings dialog').boundingBox();
        assert.ok(floatingRect.x >= 0 && floatingRect.x + floatingRect.width <= 390);
        if (url === process.argv[2] && engine === chromium) await page.screenshot({path:'/tmp/gramlot-gallery-settings-mobile.png'});
        await settings.click();
        await inspector.click();
        await page.locator('gramlot-tools-inspector[docked] gramlot-poc-palette').waitFor({state:'visible'});
        await inspector.click();
        await page.locator('gramlot-tools-inspector').waitFor({state:'detached'});
        assert.equal(await field.inputValue(), 'Toolbar retained draft');
        if (url === process.argv[2] && engine === chromium) await page.screenshot({path:'/tmp/gramlot-gallery-rail-mobile.png'});
        await page.setViewportSize({width:1280,height:850});
        await page.waitForFunction(() => document.getElementById('gallery-rail').getAttribute('aria-orientation') === 'vertical');
        assert.equal(await frame.evaluate(el => el === document.getElementById('frame-w01')), true);
        assert.equal(await field.inputValue(), 'Toolbar retained draft');
        // Proportions affect automatic placement even within the narrow layout.
        for (const [width,height,orientation] of [[844,390,'vertical'],[768,768,'horizontal'],[1023,700,'vertical'],[1024,1200,'vertical'],[390,844,'horizontal']]) {
            await page.setViewportSize({width,height});
            await page.waitForFunction(expected => document.getElementById('gallery-rail').getAttribute('aria-orientation')===expected,orientation);
            const region=await page.locator('#gallery-rail-region').boundingBox();
            assert.ok(orientation==='horizontal'?region.y>=height-42:region.x<2,JSON.stringify({width,height,region}));
            assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        }
        const setPosition=async caption=>{
            await settings.click();await choose('gallery-toolbar-position',caption);
            await page.locator('#gallery-settings button[aria-label="Close window"]').click();
        };
        await setPosition('Left');
        assert.equal(await rail.getAttribute('aria-orientation'),'vertical');
        assert.equal(await field.inputValue(),'Toolbar retained draft');
        if(url===process.argv[2]&&engine===chromium)await page.screenshot({path:'/tmp/gramlot-toolbar-portrait-left.png'});
        await setPosition('Bottom');
        await page.setViewportSize({width:1280,height:850});
        await page.waitForFunction(()=>document.getElementById('gallery-rail-region').getBoundingClientRect().y>=790);
        assert.equal(await rail.getAttribute('aria-orientation'),'horizontal');
        if(url===process.argv[2]&&engine===chromium)await page.screenshot({path:'/tmp/gramlot-toolbar-desktop-bottom.png'});
        await setPosition('Automatic');
        assert.equal(await rail.getAttribute('aria-orientation'),'vertical');
        await page.setViewportSize({width:844,height:390});
        await page.waitForFunction(()=>document.getElementById('gallery-rail-region').getBoundingClientRect().width===42);
        if(url===process.argv[2]&&engine===chromium)await page.screenshot({path:'/tmp/gramlot-toolbar-landscape-left.png'});
        await setPosition('Bottom');
        assert.equal(await rail.getAttribute('aria-orientation'),'horizontal');
        assert.equal(await toolbar.evaluate(el=>el===document.getElementById('gallery-rail')),true);
        assert.equal(await frame.evaluate(el=>el===document.getElementById('frame-w01')),true);
        assert.equal(await field.inputValue(),'Toolbar retained draft');
        await setPosition('Automatic');
        assert.deepEqual(errors, []);
        console.log(`${engine.name()} ${url}: rail geometry, panel toggles, theme and retained lesson across viewport changes passed`);
    } finally { await browser.close(); }
}
