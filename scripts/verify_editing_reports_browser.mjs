/** Shared form/grid reports and PoC arrow behavior through the real gallery. */
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const origin=process.env.GALLERY_URL || 'http://127.0.0.1:61509';
for(const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch();
 try {
  const page=await browser.newPage({viewport:{width:1320,height:1000}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+'/pages/05-grid/13_editing');
  const grid=page.locator('#grid-editing-demo'),reports=page.locator('#editing-reports');
  await grid.locator('tbody tr').first().waitFor();
  const cell=(row,field)=>grid.locator(`tr[data-row=${row}] td[data-field=${field}]`);
  const scroll=async top=>{await grid.locator('.body-viewport').evaluate((e,v)=>e.scrollTop=v,top);await page.waitForTimeout(150);};
  const count=kind=>reports.locator(`[data-kind=${kind}] .count`);
  const number=grid.locator('gramlot-number-text-box input');
  // Horizontal arrows are caret keys except at collapsed text boundaries.
  await cell('r0','description').dblclick();
  const description=grid.locator('gramlot-textbox input');
  await description.evaluate(e=>e.setSelectionRange(3,3));await description.press('ArrowRight');
  assert.equal(await description.evaluate(e=>e.selectionStart),4);
  await description.evaluate(e=>e.setSelectionRange(0,e.value.length));await description.press('ArrowRight');
  assert.equal(await description.inputValue(),'Item 0001');
  await description.press('ArrowRight');assert.equal(await number.inputValue(),'1');
  assert.equal(await number.evaluate(e=>e.selectionStart),0);
  await number.press('ArrowLeft');assert.equal(await description.inputValue(),'Item 0001');
  assert.equal(await description.evaluate(e=>e.selectionStart),9);
  await description.press('ArrowRight');await number.fill('-');await number.press('ArrowRight');
  const reference=grid.locator('gramlot-textbox input');assert.equal(await reference.inputValue(),'available');
  await reference.press('ArrowLeft');assert.equal(await number.inputValue(),'-');
  await number.fill('1');await number.press('Enter');
  await page.locator('#editing-title input').fill('Updated batch');await page.locator('#editing-title input').press('Tab');
  await cell('r0','quantity').dblclick();await number.fill('-');await number.press('ArrowDown');
  assert.equal(await number.inputValue(),'2');
  await scroll(40000);await reports.locator('[data-kind=errors]').click();
  const invalid=reports.locator('[data-path="sample.rows.r0.quantity"]');await invalid.waitFor();
  await invalid.click();assert.equal(await number.inputValue(),'-');assert.equal(await number.evaluate(e=>e===e.getRootNode().activeElement),true);
  await number.fill('9');await number.press('ArrowDown');assert.equal(await number.inputValue(),'2');
  await reports.locator('[data-kind=changes]').click();
  const change=reports.locator('[data-path="sample.rows.r0.quantity"]');await change.waitFor();
  assert.equal(await change.locator('.previous').textContent(),'1');assert.equal(await change.locator('.current').textContent(),'9');
  assert.equal(await count('changes').textContent(),'2');
  await page.screenshot({path:`/private/tmp/editing-reports-${name}.png`});
  await reports.locator('[data-path="sample.title"]').click();assert.equal(await page.locator('#editing-title input').evaluate(e=>e===e.getRootNode().activeElement),true);
  await cell('r0','reference').dblclick();const text=grid.locator('gramlot-textbox input');
  await text.fill('taken');await text.press('ArrowDown');assert.equal(await text.inputValue(),'available');
  await scroll(40000);await reports.locator('[data-kind=errors]').click();
  const remoteError=reports.locator('[data-path="sample.rows.r0.reference"]');await remoteError.waitFor();
  assert.match(await remoteError.textContent(),/reserved/);
  await remoteError.click();assert.equal(await text.inputValue(),'taken');
  await text.fill('available');await text.press('Enter');
  await cell('r0','notes').dblclick();const notes=grid.locator('gramlot-text-box-area textarea');
  const original=await notes.inputValue();await notes.press('ArrowDown');assert.equal(await notes.inputValue(),original);
  await notes.press('Escape');
  await page.locator('#editing-accept button:not([disabled])').waitFor();await page.locator('#editing-accept button').click();
  await page.waitForFunction(()=>document.getElementById('editing-reports').shadowRoot.querySelector('[data-kind=changes] .count').textContent==='0');
  assert.equal(await count('errors').textContent(),'0');
  assert.deepEqual(errors,[]);
  console.log(`${name}: shared reports, original/current values, offscreen navigation, focus, vertical/horizontal arrows, async errors and acceptance passed`);
 } finally {await browser.close();}
}
