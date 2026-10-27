/** Browser interactions for the composed windows, menus and reusable examples. */
import assert from 'node:assert/strict';

async function windowExample(page, tag, opener) {
    await page.getByRole('button', {name:opener, exact:true}).click();
    const host = page.locator(tag), field = host.locator('gramlot-textbox input');
    const original = await field.elementHandle();
    assert.equal(await host.locator('dialog').evaluate(e => e.matches(':modal')), tag === 'gramlot-dialog');
    await field.fill('Retained browser draft');
    await host.getByRole('menuitem', {name:'Uppercase title', exact:true}).click();
    assert.equal(await field.inputValue(), 'RETAINED BROWSER DRAFT');
    await host.getByRole('menuitem', {name:'Done', exact:true}).click();
    await page.getByRole('button', {name:opener, exact:true}).click();
    assert.equal(await field.evaluate((e, original) => e === original, original), true);
    assert.equal(await field.inputValue(), 'RETAINED BROWSER DRAFT');
    await host.getByRole('menuitem', {name:'Done', exact:true}).click();
}
async function editor(page) {
    await page.locator('#open-editor button').click();
    await page.locator('#editor-title').fill('Saved through the toolbar');
    await page.locator('#editor-save button').click();
    await page.waitForFunction(() => document.getElementById('saved-title').textContent === 'Saved through the toolbar');
    await page.locator('#open-editor button').click();
    await page.locator('#editor-title').fill('Discard this draft');
    await page.locator('#editor-cancel button').click();
    assert.equal(await page.locator('#saved-title').textContent(), 'Saved through the toolbar');
}
async function theme(page) {
    await page.locator('#theme-native').fill('Browser theme preview');
    assert.equal(await page.evaluate(() => gramlot.data.getItem('preview.name')), 'Browser theme preview');
    await page.locator('#theme-tabs').getByRole('tab', {name:'Items',exact:true}).click();
    assert.ok(await page.locator('#theme-tabs table:visible tbody tr').count() > 0);
}
export const workspaceBehaviors = {
    async 'gallery-tray'(page) {
  await page.locator('#tray-example').waitFor();
  assert.equal(await page.locator('#gallery-tray iframe').count(),0);
  assert.equal(await page.locator('#tray-add button').isDisabled(),true);
  assert.equal(await page.locator('option[value=gallery-tray], option[value=l08]').count(),0);
  await page.locator('#tray-example').selectOption('w01');
  await page.locator('#tray-add').click();
  const cards=page.locator('#gallery-tray [data-tray-block]');
  const firstFrame=page.frameLocator('#gallery-tray iframe').first();
  await firstFrame.locator('#customer input').fill('Kept after arrangement');
  await page.locator('#tray-add').click();
  await page.waitForFunction(()=>document.querySelectorAll('#gallery-tray iframe').length===2);
  assert.equal(await firstFrame.locator('#customer-copy input').inputValue(),'Kept after arrangement');
  const secondFrame=page.frameLocator('#gallery-tray iframe').nth(1);
  await secondFrame.locator('#customer input').waitFor();
  assert.notEqual(await secondFrame.locator('#customer input').inputValue(),'Kept after arrangement');
  const identity=await page.locator('#gallery-tray iframe').first().elementHandle();
  const title=cards.first().locator('.labelbox-label');
  const rect=await cards.first().boundingBox();
  await page.mouse.move(rect.x+rect.width/2,rect.y+8);await page.mouse.down();await page.mouse.move(rect.x+rect.width/2,rect.y+48,{steps:8});await page.mouse.up();
  const moved=await page.evaluate(()=>gramlot.data.getItem('galleryTray.layout.card_1.top'));
  assert.ok(moved>20,'drag changes Data');
  const grip=await cards.first().locator('.tray-resize').boundingBox();
  await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();await page.mouse.move(grip.x+grip.width/2+20,grip.y+grip.height/2+25,{steps:8});await page.mouse.up();
  assert.ok(await page.evaluate(()=>gramlot.data.getItem('galleryTray.layout.card_1.height'))>460,'resize changes Data');
  assert.equal(await firstFrame.locator('#customer input').inputValue(),'Kept after arrangement');
  assert.equal(await identity.evaluate(el=>el===document.querySelector('#gallery-tray iframe')),true);
  for(let i=0;i<3;i++)await page.locator('#tray-add').click();
  await page.waitForFunction(()=>document.querySelectorAll('#gallery-tray iframe').length===5);
  assert.ok(await page.locator('#gallery-tray').evaluate(el=>el.getBoundingClientRect().height)>1000,'tray grows');
    },
    dialog_window: page => windowExample(page,'gramlot-dialog','Open dialog'),
    floating_window: page => windowExample(page,'gramlot-floating-pane','Open floating'),
    'menu-10': editor, 'menu-14': editor,
    'menu-11': theme, 'menu-12': theme, 'menu-13': theme,
    async 'menu-02'(page) {
        const before=await page.evaluate(()=>gramlot.data.getItem('document.details'));
        await page.locator('#popup-document').click();
        await page.locator('#popup-menu').getByRole('menuitemcheckbox',{name:'Details',exact:true}).click();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('document.details')), !before);
        await page.locator('#context-document').click({button:'right'});
        await page.locator('#context-menu').getByRole('menuitemcheckbox',{name:'Details',exact:true}).click();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('document.details')), before);
    },
    async 'menu-03'(page) {
        await page.locator('#toolbar-search').fill('shared query');
        assert.equal(await page.locator('#query-result').textContent(),'shared query');
        assert.equal(await page.locator('#moving-search').inputValue(),'shared query');
    },
    async 'menu-07'(page) {
        await page.locator('#rail-tools button').first().click();
        await page.locator('#rail-tools-menu').getByRole('menuitemcheckbox',{name:'Settings',exact:true}).click();
        assert.equal(await page.locator('#selected-section').textContent(),'settings');
    },
    async 'menu-08'(page) {
        await page.locator('#file-menu-trigger button').first().click();
        assert.equal(await page.locator('#file-popup').getByRole('menuitem',{name:'Save',exact:true}).isVisible(),true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#file-popup').getByRole('menuitem',{name:'Save',exact:true}).isVisible(),false);
    },
    async 'menu-04'(page) {
        const before=await page.evaluate(() => gramlot.data.getItem('document.details'));
        await page.locator('#states-toolbar').getByRole('menuitemcheckbox',{name:'Details',exact:true}).click();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('document.details')), !before);
        assert.equal(await page.locator('#states-details').isVisible(),!before);
    },
    async 'menu-05'(page) {
        await page.getByRole('menuitem',{name:'Top bar 1',exact:true}).click();
        assert.ok((await page.locator('#frame-outer-result').textContent()).length > 0);
        await page.getByRole('menuitem',{name:'Inner Save',exact:true}).click();
        assert.ok((await page.locator('#frame-inner-result').textContent()).length > 0);
    },
    async 'menu-06'(page) {
        await page.locator('#resolver-toolbar').getByRole('menuitem',{name:'Export',exact:true}).click();
        await page.getByRole('menuitem',{name:'Current document 42',exact:true}).click();
        await page.waitForFunction(() => document.getElementById('resolver-result').textContent.includes('PDF'));
    },
    async 'menu-01'(page) {
        const before=await page.evaluate(() => gramlot.data.getItem('document.details'));
        await page.locator('#menu-toolbar').getByRole('menuitemcheckbox',{name:'Details',exact:true}).click();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('document.details')), !before);
        assert.equal(await page.locator('#menu-details').isVisible(),!before);
    },
    async 'menu-09'(page) {
        await page.locator('#open-basic button').click();
        assert.equal(await page.locator('#basic-window dialog').evaluate(e=>e.matches(':modal')),true);
        await page.locator('#basic-window').getByRole('button',{name:'Close window',exact:true}).click();
        await page.locator('#open-floating button').click();
        await page.locator('#background-field').fill('Still editable');
        assert.equal(await page.locator('#background-field').inputValue(),'Still editable');
    },
    async color_maker(page) {
        await page.locator('.maker-header gramlot-button button').click();
        const panels=page.locator('.maker-panel');
        await panels.nth(1).click();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('maker.selected')),'ink');
        await panels.nth(1).locator('input[type=range]').first().fill('120');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('maker.ink.red')),120);
        assert.equal(await panels.nth(1).evaluate(e=>e.classList.contains('maker-selected')),true);
    },
    async sieve(page) {
        await page.locator('#sieve-step button').click();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('sieve.cells.n2')),'prime');
        await page.locator('#sieve-reset button').click();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('sieve.steps')),0);
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('sieve.running')),false);
    },
};
