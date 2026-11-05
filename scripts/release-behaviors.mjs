/** Interactions for checkbox sets, facets, radio columns and drawing. */
import assert from 'node:assert/strict';
export const releaseBehaviors = {
    async 'grid-check-sets'(page) {
        const grid = page.locator('#customer-sets');
        for (const name of ['John', 'Mark', 'Fred']) await page.getByRole('button', {name:'Add ' + name, exact:true}).click();
        await grid.locator('tr[data-row=r1] td[data-field=john] input').check();
        await grid.locator('tr[data-row=r1] td[data-field=fred] input').check();
        await grid.locator('tr[data-row=r2] td[data-field=john] input').check();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('sample.sets.john')), 'C1,C2');
        await page.getByRole('button', {name:'John e Fred', exact:true}).click();
        await page.waitForFunction(() => document.querySelector('#customer-sets').shadowRoot.querySelectorAll('tbody tr').length === 1);
        await page.getByRole('button', {name:'Tutti', exact:true}).click();
        await page.waitForFunction(() => document.querySelector('#customer-sets').shadowRoot.querySelectorAll('tbody tr').length === 3);
    },
    async 'grid-primary-supplier'(page) {
        const radios = page.locator('#primary-supplier input[type=radio]');
        await radios.first().check();
        assert.equal(await radios.first().isChecked(), true);
        const first = await page.evaluate(() => gramlot.data.getItem('product.primary_supplier_id'));
        await radios.last().check();
        assert.equal(await radios.first().isChecked(), false);
        assert.notEqual(await page.evaluate(() => gramlot.data.getItem('product.primary_supplier_id')), first);
        assert.equal(await page.locator('#primary-supplier input[type=radio]:checked').count(), 1);
    },
    async 'grid-column-filters'(page) {
        const grid = page.locator('#column-facets');
        await grid.locator('.column-filter[data-field=name]').click();
        const nested = grid.locator('gramlot-grid');
        await nested.locator('tbody input[type=checkbox]').first().uncheck();
        await page.waitForFunction(() => document.querySelector('#column-facets').shadowRoot.querySelectorAll('tbody tr').length === 5);
        await grid.getByRole('button', {name:'Reset', exact:true}).click();
        await page.waitForFunction(() => document.querySelector('#column-facets').shadowRoot.querySelectorAll('tbody tr').length === 6);
    },
    async 'drawing-annotations'(page) {
        const drawing = page.locator('gramlot-drawing-pane');
        await drawing.getByRole('button', {name:'Arrow', exact:true}).click();
        const canvas = drawing.locator('svg.canvas');
        const bounds = await canvas.boundingBox();
        await page.mouse.move(bounds.x + 70, bounds.y + 70);
        await page.mouse.down();
        await page.mouse.move(bounds.x + 170, bounds.y + 130, {steps:4});
        await page.mouse.up();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('drawing.annotations').getNodes().length), 1);
        assert.equal(await canvas.locator('line').count(), 1);
    },
};
