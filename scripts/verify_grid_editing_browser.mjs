/** Exercise session-owned editing through the running Python gallery and real RPC. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
const origin=process.env.GALLERY_URL || 'http://127.0.0.1:61509';
for(const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch();
 try {
  const page=await browser.newPage({viewport:{width:1320,height:1000}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+'/pages/05-grid_editable/10_editing');
  const grid=page.locator('#grid-editing-demo');await grid.locator('tbody tr').first().waitFor();
  const cell=field=>grid.locator(`tr[data-row=r0] td[data-field=${field}]`);
  const scroll=async top=>{await grid.locator('.body-viewport').evaluate((element,top)=>{element.scrollTop=top;},top);await page.waitForTimeout(150);};
  const number=grid.locator('gramlot-number-text-box input');
  await cell('quantity').dblclick();await number.fill('-');await scroll(18000);
  assert.equal(await grid.locator('[slot=cell-editor]').count(),0);
  await scroll(0);await cell('quantity').dblclick();assert.equal(await number.inputValue(),'-');
  await number.fill('-3');await number.press('Enter');await scroll(18000);await scroll(0);
  assert.equal(await cell('quantity').getAttribute('aria-invalid'),'true');
  await cell('quantity').dblclick();await number.fill('3');await number.press('Enter');
  await cell('reference').dblclick();const text=grid.locator('gramlot-textbox input');
  await text.fill('taken');await text.press('Enter');
  assert.equal(await page.locator('#editing-status').textContent(),'pending');
  await scroll(18000);await page.waitForFunction(()=>document.getElementById('editing-status').textContent==='error');
  assert.equal(await grid.locator('[slot=cell-editor]').count(),0);
  await scroll(0);assert.equal(await cell('reference').getAttribute('aria-invalid'),'true');
  await cell('reference').dblclick();assert.match(await grid.locator('#field-message').textContent(),/reserved/);
  await text.fill('available');await text.press('Enter');
  await page.locator('#editing-accept button:not([disabled])').waitFor();await page.locator('#editing-accept button').click();
  await page.waitForFunction(()=>document.getElementById('editing-status').textContent==='ok');
  assert.ok(await grid.locator('tbody tr').count()<40);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:`/private/tmp/grid-editing-gallery-${name}.png`,fullPage:true});
  console.log(`${name}: live gallery lesson, drafts, errors, scroll, real asynchronous validation and local acceptance passed`);
 } finally {await browser.close();}
}
