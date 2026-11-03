/** A column cap applies to display text and its ordinary textarea editor. */
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const origin=process.env.GALLERY_URL || 'http://127.0.0.1:61509';
for(const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch();
 try {
  const page=await browser.newPage({viewport:{width:1320,height:1050}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+'/pages/05-grid_editable/10_editing');
  const grid=page.locator('#grid-editing-demo'),row=grid.locator('tr[data-row=r0]'),cell=row.locator('td[data-field=notes]');
  const content=cell.locator('.cell-content'),viewport=grid.locator('.body-viewport');await content.waitFor();
  const metrics=locator=>locator.evaluate(e=>({height:e.getBoundingClientRect().height,client:e.clientHeight,scroll:e.scrollHeight,top:e.scrollTop,text:e.value??e.textContent}));
  let display=await metrics(content);assert.ok(display.height<=96.1);assert.ok(display.scroll>display.client);assert.equal(display.text.split('\n').length,12);
  assert.ok((await row.boundingBox()).height<=98,'long text does not stretch the row past its capped content');
  await content.hover();await page.mouse.wheel(0,100);await page.waitForTimeout(200);
  assert.ok((await metrics(content)).top>0);assert.equal(await viewport.evaluate(e=>e.scrollTop),0,'wheel scrolls inside the cell');
  await content.evaluate(e=>e.scrollTop=0);await content.dblclick();
  const editor=grid.locator('gramlot-text-box-area textarea');await editor.waitFor();
  let editing=await metrics(editor);assert.ok(editing.height<=96.1);assert.ok(editing.scroll>editing.client);assert.equal(editing.text,display.text);
  const updated=editing.text+'\nAdditional delivery instructions.\nConfirm the final checklist.';
  await editor.fill(updated);await editor.press('Control+Enter');
  await page.waitForFunction(expected=>document.getElementById('grid-editing-demo').shadowRoot.querySelector('tr[data-row=r0] td[data-field=notes] .cell-content').textContent===expected,updated);
  assert.equal(await content.textContent(),updated);assert.ok((await metrics(content)).height<=96.1);
  // A taller manual row must not stretch either capped text presentation.
  const handle=row.locator('.row-height-handle'),box=await handle.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2+70,{steps:8});await page.mouse.up();await page.waitForTimeout(150);
  assert.ok((await row.boundingBox()).height>140);assert.ok((await metrics(content)).height<=96.1);
  await content.dblclick();editing=await metrics(editor);assert.ok(editing.height<=96.1);
  await editor.evaluate(e=>e.scrollTop=e.scrollHeight);assert.ok((await metrics(editor)).top>0);
  await page.screenshot({path:`/private/tmp/grid-cell-height-${name}.png`});await editor.press('Escape');
  await viewport.evaluate(e=>e.scrollTop=18000);await page.waitForTimeout(150);
  await viewport.evaluate(e=>e.scrollTop=0);await content.waitFor();await content.dblclick();
  assert.equal(await editor.inputValue(),updated);assert.ok((await metrics(editor)).height<=96.1);
  assert.ok(await grid.locator('tbody tr').count()<40);assert.deepEqual(errors,[]);
  console.log(`${name}: capped display/editor, real inner wheel scroll, full text, manual height and virtualization passed`);
 } finally {await browser.close();}
}
