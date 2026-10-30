/** Observable contracts of the resident Grid lessons, shared by gallery and page checks. */
import assert from 'node:assert/strict';
async function basicGrid(page, key) {
    const grids = page.locator('gramlot-grid');
            await grids.first().locator('tbody tr').first().waitFor();
            assert.equal(await grids.count(), key==='grid-05' ? 2 : 1);
            assert.equal(await grids.first().locator('tbody tr').count(), key==='menu-15' ? 12 : key==='grid-05' ? 4 : 8);
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
                const physical = await page.locator('body').evaluate(()=>window.gramlot.data.getItem('sample.rows').getNodes().map(node=>node.label));
                await grid.locator('th[data-field=category]').click();
                await grid.locator('th[data-field=quantity]').click({modifiers:['Shift']});
                await grid.locator('tbody tr:nth-child(2)[data-row=r5]').waitFor();
                assert.deepEqual(await labels(grid), ['r2','r5','r7','r3','r6','r1','r8','r4']);
                const target=grid.locator('tr[data-row=r7]'), box=await target.boundingBox();
                await grid.locator('tr[data-row=r2]').dragTo(target,{sourcePosition:{x:65,y:10},targetPosition:{x:65,y:box.height-2}});
                assert.deepEqual((await labels(grid)).slice(0,3), ['r5','r7','r2']);
                assert.equal(await grid.locator('[data-sort-priority]').count(), 0);
                assert.deepEqual(await page.locator('body').evaluate(()=>window.gramlot.data.getItem('sample.rows').getNodes().map(node=>node.label)), physical);
            }
            if (key==='menu-15') {
                await page.locator('#orders-update').click();
                await page.locator('#orders-status').filter({hasText:'First row updated'}).waitFor();
                await grids.first().locator('tbody tr').first().filter({hasText:'99.50'}).waitFor();
                await page.locator('#orders-remove').click();
                await page.locator('#orders-count').filter({hasText:'11'}).waitFor();
            }
            if (key==='grid-05') {
                const first=grids.nth(0), second=grids.nth(1);
                const secondOrder=await labels(second);
                await first.locator('th[data-field=quantity]').click();
                await first.locator('th[data-field=quantity][aria-sort=ascending]').waitFor();
                assert.deepEqual(await labels(second),secondOrder,'sorting one view preserves the other');
                const furniture=await labels(first);
                await page.locator('#shared-update').click();
                await second.locator('tbody tr[data-row=r3]').waitFor({state:'hidden'});
                assert.equal(await page.locator('body').evaluate(()=>gramlot.data.getItem('sample.rows').getNodes().length),8);
                assert.deepEqual((await labels(first)).sort(),furniture.sort(),'a shared edit preserves Furniture membership');
                assert.ok((await labels(second)).length < secondOrder.length,'zero quantity leaves the filtered view');
            }
}
async function residentScroll(page, id) {
    const grid=page.locator(id);
    await grid.locator('tbody tr').first().waitFor();
    assert.ok(await grid.locator('tbody tr').count() < 1000, 'DOM rows are virtualized');
    assert.equal(await page.evaluate(() => gramlot.data.getItem('sample.rows').getNodes().length), 1000);
    await page.getByRole('searchbox', {name:'Filter rows'}).fill('R0999');
    await grid.locator('td[data-field=code]').filter({hasText:'R0999'}).waitFor();
    await page.getByRole('button', {name:'Clear filter',exact:true}).click();
    await grid.locator('tbody tr').nth(1).waitFor();
    await grid.locator('.body-viewport').press('End');
    await grid.locator('td[data-field=code]').filter({hasText:'R1000'}).waitFor();
}
export const gridBehaviors = Object.fromEntries(
    ['grid-01','grid-02','grid-03','grid-04','grid-05','menu-15'].map(key=>[key,page=>basicGrid(page,key)]));
gridBehaviors['grid-07'] = async page => {
    const grid=page.locator('#grid-search-demo');
    await grid.locator('tbody tr').nth(7).waitFor();
    await page.getByRole('searchbox',{name:'Filter rows'}).fill('lamp');
    await page.waitForFunction(()=>document.querySelector('#grid-search-demo').shadowRoot.querySelectorAll('tbody tr').length<8);
    assert.ok(await grid.locator('tbody tr').count()>0);
    assert.equal(await page.evaluate(()=>gramlot.data.getItem('sample.rows').getNodes().length),8);
    await page.getByRole('button',{name:'Clear filter',exact:true}).click();
    await grid.locator('tbody tr').nth(7).waitFor();
};
gridBehaviors['grid-08'] = page => residentScroll(page,'#grid-scroll-demo');
gridBehaviors['grid-09'] = async page => {
    await page.getByRole('button',{name:'Open floating grid',exact:true}).click();
    await residentScroll(page,'#grid-floating-demo');
    await page.evaluate(()=>{window.testGridIdentity=document.querySelector('#grid-floating-demo');});
    await page.locator('#grid-floating-window').getByRole('button',{name:'Close window',exact:true}).click();
    await page.getByRole('button',{name:'Open floating grid',exact:true}).click();
    assert.equal(await page.evaluate(()=>window.testGridIdentity===document.querySelector('#grid-floating-demo')),true);
};
