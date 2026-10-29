/** Exercise the progressive Grid family through the actual gallery navigation. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
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
        assert.deepEqual(await page.locator('#gallery-navigation-tree [data-path^="grid."]').evaluateAll(nodes=>nodes.map(node=>node.dataset.path)), keys.map(key=>`grid.${key}`));
        for (const key of keys) {
            await (await galleryRow(page,key)).click();
            const frame = page.frameLocator(`#frame-${key}`), grids = frame.locator('gramlot-grid');
            await grids.first().locator('tbody tr').first().waitFor();
            assert.equal(await grids.count(), key==='grid-05' ? 2 : 1);
            assert.equal(await grids.first().locator('tbody tr').count(), key==='menu-15' ? 12 : 8);
            const labels = grid => grid.locator('tbody tr').evaluateAll(rows=>rows.map(row=>row.dataset.row));
            if (key==='grid-01') {
                assert.equal(await grids.first().locator('th[data-field]').count(), 3);
                assert.equal(await grids.first().locator('td[data-field=code]').first().textContent(), 'P001');
            }
            if (key==='grid-02') {
                assert.equal(await grids.first().locator('tr[data-row=r6] td[data-field=quantity]').textContent(), '0');
                assert.equal(await grids.first().locator('tr[data-row=r6] td[data-field=available]').textContent(), 'false');
            }
            if (key==='grid-03') {
                assert.equal(await grids.first().locator('th[scope=colgroup]').count(), 2);
                assert.equal(await grids.first().locator('td[data-field=notes]').first().evaluate(node=>getComputedStyle(node).whiteSpace), 'pre-wrap');
            }
            if (key==='grid-04') {
                const grid = grids.first();
                const physical = await frame.locator('body').evaluate(()=>window.gramlot.data.getItem('sample.rows').getNodes().map(node=>node.label));
                await grid.locator('th[data-field=category]').click();
                await grid.locator('th[data-field=quantity]').click({modifiers:['Shift']});
                assert.deepEqual(await labels(grid), ['r2','r5','r7','r3','r6','r1','r8','r4']);
                const target=grid.locator('tr[data-row=r7]'), box=await target.boundingBox();
                await grid.locator('tr[data-row=r2]').dragTo(target,{sourcePosition:{x:65,y:10},targetPosition:{x:65,y:box.height-2}});
                assert.deepEqual((await labels(grid)).slice(0,3), ['r5','r7','r2']);
                assert.equal(await grid.locator('[data-sort-priority]').count(), 0);
                assert.deepEqual(await frame.locator('body').evaluate(()=>window.gramlot.data.getItem('sample.rows').getNodes().map(node=>node.label)), physical);
            }
            if (key==='grid-05') {
                const first=grids.nth(0), second=grids.nth(1);
                await first.locator('th[data-field=quantity]').click();
                assert.deepEqual(await labels(first), await labels(second));
                assert.equal((await labels(first))[0], 'r6');
                const row=first.locator('tr[data-row=r6]'), other=second.locator('tr[data-row=r6]');
                const before=(await row.boundingBox()).height, otherBefore=(await other.boundingBox()).height;
                await row.locator('.row-height-handle').focus(); await page.keyboard.press('ArrowDown');
                assert.ok((await row.boundingBox()).height>before);
                assert.equal((await other.boundingBox()).height, otherBefore);
                const target=second.locator('tr[data-row=r1]'), box=await target.boundingBox();
                await other.dragTo(target,{sourcePosition:{x:65,y:10},targetPosition:{x:65,y:box.height-2}});
                assert.deepEqual(await labels(first), await labels(second));
                assert.deepEqual((await labels(first)).slice(0,3), ['r2','r1','r6']);
                assert.ok((await row.boundingBox()).height>before, 'manual height survives shared reorder');
            }
        }
        assert.equal(await page.locator('#gallery-navigation-tree [data-path="menus.menu-15"]').count(),0);
        assert.deepEqual(errors,[]);
        await page.screenshot({path:`/private/tmp/grid-family-${name}.png`,fullPage:true});
        console.log(JSON.stringify({browser:name,section:'Grid',lessons:keys.length,sortAndDrag:'passed',sharedOrderAndIndependentHeights:'passed',errors}));
    } finally {await browser.close();}
}
