/** One observable interaction per component lesson for the cross-language CI harness. */
import assert from 'node:assert/strict';

const data = (page, path) => page.evaluate(path => window.gramlot.data.getItem(path), path);
const edit = async (page, selector, value) => {
    const field = page.locator(selector);
    await field.focus();
    await field.fill(value);
    await field.press('Tab');
};
const mirroredText = (id, tag, value) => async page => {
    await edit(page, `#${id} ${tag}`, value);
    assert.equal(await page.locator(`#${id}-copy ${tag}`).inputValue(), value);
};
const slider = async page => {
    const field = page.locator('#level input');
    await field.press('Home');
    for (let step = 0; step < 13; step++) await field.press('ArrowUp');
    await field.press('Tab');
    assert.equal(await data(page, 'level'), 65);
    assert.equal(await page.locator('#level-copy input').inputValue(), '65');
};
const booleanMirror = (first, second) => async page => {
    const control = page.locator(`#${first} input`);
    const next = !(await control.isChecked());
    await control.setChecked(next);
    assert.equal(await page.locator(`#${second} input`).isChecked(), next);
};
const codeDraft = async page => {
    const editor = page.locator('#demo-editor .cm-content');
    await editor.fill('print("Verified draft")');
    await page.waitForFunction(() => document.getElementById('live-draft').textContent === 'print("Verified draft")');
    await page.locator('#save-snapshot button').click();
    assert.equal(await page.locator('#saved-snapshot').textContent(), 'print("Verified draft")');
};

export const componentBehaviors = {
    code_mirror: codeDraft,
    code_mirror_options: codeDraft,
    async html_editor(page) {
        await page.locator('gramlot-code-mirror .cm-content').fill('<h1>Verified HTML</h1>');
        await page.getByRole('tab', {name:'Preview', exact:true}).click();
        await page.locator('gramlot-html-preview iframe').waitFor();
        await page.waitForFunction(() => document.querySelector('gramlot-html-preview').frame.srcdoc.includes('Verified HTML'));
        assert.equal(await page.locator('gramlot-html-preview iframe').getAttribute('sandbox'), '');
        await page.getByRole('tab', {name:'Rich text', exact:true}).click();
        await page.frameLocator('gramlot-html-editor iframe').locator('body').waitFor({state:'visible'});
        assert.match(await page.frameLocator('gramlot-html-editor iframe').locator('body').textContent(), /Verified HTML/);
    },
    async markdown_editor(page) {
        await page.locator('gramlot-code-mirror .cm-content').fill('# Verified Markdown');
        await page.waitForFunction(() => document.getElementById('live-markdown').textContent === '# Verified Markdown');
        await page.getByRole('tab', {name:'Preview', exact:true}).click();
        await page.waitForFunction(() => document.querySelector('gramlot-markdown-preview').frame.srcdoc.includes('Verified Markdown'));
        await page.getByRole('tab', {name:'Rich text', exact:true}).click();
        await page.locator('.ProseMirror').waitFor({state:'visible'});
    },
    async typst_editor(page) {
        await page.locator('gramlot-code-mirror .cm-content').fill('= Verified Typst\nA browser compilation.');
        await page.waitForFunction(() => document.querySelector('gramlot-typst-preview').status.textContent === 'Preview and PDF are up to date', null, {timeout:60000});
        assert.match(await page.locator('gramlot-typst-preview img').getAttribute('src'), /^blob:/);
        assert.equal(await page.locator('gramlot-typst-preview a').getAttribute('aria-disabled'), 'false');
    },
    w01: mirroredText('customer', 'input', 'Grace'),
    w02: booleanMirror('newsletter', 'newsletter-copy'),
    async w03(page) {
        await page.locator('#shipping input[value="express"]').check();
        assert.equal(await data(page, 'shipping'), 'express');
        assert.equal(await page.locator('#alternative input[value="pickup"]').isChecked(), true);
    },
    w04: mirroredText('notes', 'textarea', 'Two\nlines'),
    w05: mirroredText('secret', 'input', 'new-sample'),
    async w06(page) {
        await page.locator('#express input').check();
        assert.equal(await data(page, 'express'), true);
        assert.equal(await data(page, 'standard'), false);
    },
    async w07(page) {
        await page.locator('#color input').evaluate(input => {
            input.value = '#ff8800';
            input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
        });
        assert.equal(await page.locator('#color-copy input').inputValue(), '#ff8800');
    },
    w08: slider,
    w09: slider,
    async w10(page) {
        await edit(page, '#amount input', '45,50');
        assert.equal(await data(page, 'amount'), 45.5);
        await page.locator('#amount-copy input').blur();
        assert.equal(await page.locator('#amount-copy input').inputValue(), '45,50');
    },
    async w11(page) {
        await edit(page, '#date input', '20/10/2026');
        assert.equal(await page.evaluate(() => gramlot.data.getItem('date').toISOString()), '2026-10-20T00:00:00.000Z');
        assert.match(await page.locator('#date-copy input').inputValue(), /20/);
    },
    async w12(page) {
        await edit(page, '#time input', '14:45');
        await page.locator('#time-copy input').blur();
        assert.equal(await page.locator('#time-copy input').inputValue(), '14:45');
    },
    async w13(page) {
        await page.locator('#choice input').fill('Sta');
        await page.locator('#choice [role=option]').first().click();
        assert.equal(await data(page, 'choice'), 'standard');
        assert.equal(await page.locator('#choice-copy input').inputValue(), 'Standard');
    },
    async w14(page) {
        await page.locator('#choice input').fill('Sample 025');
        await page.locator('#choice [role=option]').first().click();
        assert.equal(await data(page, 'choice'), 'item_025');
        await page.waitForFunction(() => document.querySelector('#choice-copy').control.value.startsWith('Sample 025'));
    },
    async w15(page) {
        await edit(page, '#choice input', 'A custom caption');
        assert.equal(await data(page, 'choice'), 'A custom caption');
        assert.equal(await page.locator('#choice-copy input').inputValue(), 'A custom caption');
    },
    async w16(page) {
        await page.locator('#channels input[value="sms"]').check();
        assert.ok((await data(page, 'channels')).split(',').includes('sms'));
        assert.equal(await page.locator('#channels-copy input[value="sms"]').isChecked(), true);
    },
    async w17(page) {
        await page.locator('#calendar [data-date="2026-10-20"]').click();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('date').toISOString()), '2026-10-20T00:00:00.000Z');
        assert.match(await page.locator('#plain input').inputValue(), /20/);
    },
    async w18(page) {
        await edit(page, '#name input', 'X');
        assert.equal(await page.locator('#name input').getAttribute('aria-invalid'), 'true');
        assert.equal(await data(page, 'name'), 'Ada');
        await edit(page, '#name input', 'Grace');
        assert.equal(await page.locator('#name-copy input').inputValue(), 'Grace');
    },
    async w19(page) {
        await edit(page, '#first-name input', 'Grace');
        assert.equal(await data(page, 'customer.name'), 'Grace');
        await page.getByText('Options · change the behavior', {exact:true}).click();
        await page.selectOption('#columns', '2');
        assert.equal(await page.locator('#first-name input').inputValue(), 'Grace');
    },
    async w20(page) {
        await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: async text => { window.copied = text; }}}));
        await page.locator('.gramlot-group-labelbox').filter({has: page.locator('#customer-group')}).getByRole('button', {name: 'Copy TYTX', exact: true}).click();
        await page.waitForFunction(() => Boolean(window.copied));
        assert.equal(await page.evaluate(() => gramlot.data.constructor.fromTytx(window.copied).getItem('name')), 'Ada');
    },
    w21: booleanMirror('notifications-switch', 'notifications-check'),
    async w22(page) {
        await page.locator('#command-confirm button').click();
        await page.locator('dialog button[type=submit]').click();
        assert.equal(await data(page, 'result'), 'Confirmed');
    },
    async w23(page) {
        await page.locator('#toggle-command button').click();
        assert.equal(await data(page, 'enabled'), true);
        assert.equal(await page.locator('#toggle-checkbox input').isChecked(), true);
    },
    async w24(page) {
        await page.locator('#export-command .arrow').click();
        await page.locator('#export-pdf button').click({modifiers: ['Shift']});
        assert.equal(await data(page, 'result'), 'PDF export');
        assert.equal(await page.locator('#export-command .split').innerText(), 'Export PDF');
    },
    async w25(page) {
        await edit(page, '#full-name input', '');
        assert.equal(await data(page, 'profile.full_name'), 'Ada Lovelace');
        assert.equal(await page.locator('#full-name input').getAttribute('aria-invalid'), 'true');
        await edit(page, '#remote-name input', 'newname');
        await page.waitForFunction(() => gramlot.data.getItem('profile.remote_name') === 'NEWNAME');
    }
};

Object.assign(componentBehaviors, {
    async w26(page) {
        const tree = page.locator('#example-tree');
        await tree.locator('[data-path="catalog"] > .row > button').click();
        await tree.locator('[data-path="catalog.books"]').waitFor();
        await page.locator('#tree-select-notes').click();
        assert.equal(await data(page, 'treeDemo.selection'), 'documents.notes');
        await page.locator('#tree-hide-values input').check();
        assert.equal(await data(page, 'treeDemo.hideValues'), true);
    },
    async w27(page) {
        const tree = page.locator('#styled-tree');
        await tree.locator('[data-path="documents"] > .row > button').click();
        await tree.locator('[data-path="documents.notes"] > .row').click();
        assert.equal(await data(page, 'treeStyle.selection'), 'documents.notes');
        await page.locator('#styled-rename').click();
        assert.equal(await tree.locator('[data-path="documents.notes"] .caption').textContent(), 'Updated notes');
        assert(await tree.locator('[data-path="documents.notes"]').evaluate(node => node.classList.contains('attention-node')));
    },
    async w28(page) {
        const tree = page.locator('#rich-callback-tree');
        assert.equal(await tree.locator('[data-path="documents"] .caption strong').textContent(), 'Documents');
        assert.equal(await tree.locator('[data-path="starred"] .favorite-icon').count(), 1);
        await tree.locator('[data-path="documents"] > .row > button').click();
        assert.match(await tree.locator('[data-path="documents"] > .row .caption').textContent(), /open/);
        await page.locator('#toggle-rich').click();
        assert.equal(await tree.locator('[data-path="documents"] .caption strong').count(), 0);
    },
    async w29(page) {
        const origin = page.locator('#drag-documents').getByText('Project brief', {exact:true});
        const destination = page.locator('#drop-folders');
        await origin.dragTo(destination.getByText('Inbox', {exact:true}));
        await page.locator('#last-drop').filter({hasText:'Copied Project brief to Inbox'}).waitFor();
        await destination.locator('[data-path="inbox"] > .row > button').click();
        await destination.locator('[data-path="inbox.brief"]').waitFor();
    },
});
