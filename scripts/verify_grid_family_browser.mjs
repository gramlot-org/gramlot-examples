/** Exercise the progressive Grid family through the actual gallery navigation. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
import {gridBehaviors} from './grid-behaviors.mjs';
import {galleryRow} from './gallery-navigation.mjs';
const origin = process.env.GALLERY_URL || 'http://127.0.0.1:64551';
const keys = ['grid-01','grid-02','grid-03','grid-04','grid-05','menu-15'];
for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
        const page = await browser.newPage({viewport:{width:1440,height:1100}}), errors=[];
        page.on('pageerror', error=>errors.push(error.message));
        await page.goto(origin);
        await page.locator('#gallery-navigation-tree').waitFor();
        const section = await galleryRow(page, 'grid');
        assert.match(await section.textContent(), /Grid/);
        assert.deepEqual(await page.locator('#gallery-navigation-tree [data-path^="grid."]').evaluateAll(nodes=>nodes.map(node=>node.dataset.path).filter(path=>['grid-01','grid-02','grid-03','grid-04','grid-05','menu-15'].some(key=>path===`grid.${key}`))), keys.map(key=>`grid.${key}`));
        for (const key of keys) {
            await (await galleryRow(page,key)).click();
            const frame = page.frameLocator(`#frame-${key}`), grids = frame.locator('gramlot-grid');
            await gridBehaviors[key](frame);
        }
        assert.equal(await page.locator('#gallery-navigation-tree [data-path="menus.menu-15"]').count(),0);
        assert.deepEqual(errors,[]);
        await page.screenshot({path:`/private/tmp/grid-family-${name}.png`,fullPage:true});
        console.log(JSON.stringify({browser:name,section:'Grid',lessons:keys.length,sortAndDrag:'passed',sharedOrderAndIndependentHeights:'passed',errors}));
    } finally {await browser.close();}
}
