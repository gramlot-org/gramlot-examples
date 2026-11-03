/** Verify the checkbox lesson through real Python RPC in Chromium and WebKit. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
const origin = process.env.GALLERY_URL || 'http://127.0.0.1:61530';
for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
        const page = await browser.newPage({viewport: {width: 1100, height: 720}});
        const errors = [], calls = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('request', request => {
            if (request.method() === 'POST' && request.postData()?.includes('catalog_children')) calls.push(request);
        });
        await page.goto(`${origin}/pages/01-inputs/09-tree/05-checkboxes`);
        const tree = page.locator('#checkbox-tree');
        const check = caption => tree.getByRole('checkbox', {name: caption, exact: true});
        await check('Documents').waitFor();
        assert.equal(calls.length, 0);
        assert.equal(await check('Required (locked on)').isEnabled(), false);
        assert.equal(await check('Required (locked on)').isChecked(), true);
        assert.equal(await check('Unavailable (locked off)').isEnabled(), false);
        assert.equal(await check('Unavailable (locked off)').isChecked(), false);
        await check('Documents').click();
        await tree.getByRole('button', {name: 'Expand Documents', exact: true}).click();
        assert.equal(calls.length, 0, 'checking a loaded ancestor does not fetch lazy descendants');
        assert.equal(await check('Notes').isChecked(), true);
        assert.equal(await check('Catalog (lazy)').isChecked(), true);
        for (const [caption, checked] of [['Required (locked on)', true], ['Unavailable (locked off)', false]]) {
            assert.equal(await check(caption).isDisabled(), true);
            assert.equal(await check(caption).isChecked(), checked);
        }
        await tree.getByRole('button', {name: 'Expand Catalog (lazy)', exact: true}).click();
        await check('guide').waitFor();
        assert.equal(calls.length, 1);
        assert.equal(await check('guide').isChecked(), true);
        assert.equal(await check('reference').isChecked(), true);
        assert.equal(await page.locator('#checked-paths').textContent(),
            'documents.notes,documents.catalog.guide,documents.catalog.reference');
        await check('guide').click();
        assert.equal(await check('Catalog (lazy)').evaluate(element => element.indeterminate), true);
        assert.equal(await page.locator('#checked-paths').textContent(), 'documents.notes,documents.catalog.reference');
        await page.getByRole('button', {name: 'Clear checks', exact: true}).click();
        assert.equal(await page.locator('#checked-paths').textContent(), '');
        assert.equal(await check('Required (locked on)').isChecked(), true);
        assert.equal(await check('Unavailable (locked off)').isChecked(), false);
        assert.equal(await check('Notes').isChecked(), false);
        assert.equal(await check('reference').isChecked(), false);
        assert.equal(await check('Required (locked on)').isDisabled(), true);
        assert.equal(await check('Unavailable (locked off)').isDisabled(), true);
        await tree.getByRole('button', {name: 'Collapse Catalog (lazy)', exact: true}).click();
        await tree.getByRole('button', {name: 'Expand Catalog (lazy)', exact: true}).click();
        assert.equal(calls.length, 1, 'reopening reuses the loaded Bag');
        assert.deepEqual(errors, []);
        await page.screenshot({path: `/private/tmp/tree-checkboxes-${name}.png`});
        console.log(`${name}: lazy inheritance, partial checks, locked states, binding and cached reopen passed`);
    } finally { await browser.close(); }
}
