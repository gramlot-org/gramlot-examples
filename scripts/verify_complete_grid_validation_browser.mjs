/** Complete session validation through the real gallery, without unopened editors. */
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const origin=process.env.GALLERY_URL || 'http://127.0.0.1:61509';
for(const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch();
 try {
  const page=await browser.newPage({viewport:{width:1320,height:1000}}),errors=[];
  page.on('pageerror',error=>{errors.push(error.message);console.error(error.stack);});
  await page.addInitScript(()=>{
   window.validationEditorCreations=0;
   const create=Document.prototype.createElement;
   Document.prototype.createElement=function(tag,...args){
    if(['input','textarea','gramlot-textbox','gramlot-number-text-box'].includes(tag))window.validationEditorCreations++;
    return create.call(this,tag,...args);
   };
  });
  await page.goto(origin+'/pages/05-grid_editable/10_editing');
  const grid=page.locator('#grid-editing-demo'),reports=page.locator('#editing-reports');
  await grid.locator('tbody tr').first().waitFor();
  await page.evaluate(()=>window.validationEditorCreations=0);
  await page.locator('#editing-unopened button').click();
  await page.locator('#editing-accept button:not([disabled])').click();
  await page.waitForFunction(()=>document.getElementById('editing-notice').textContent.startsWith('Not accepted.'),{},{timeout:60000});
  assert.equal(await page.evaluate(()=>window.validationEditorCreations),0,'complete validation creates no editors');
  assert.equal(await grid.locator('[slot=cell-editor]').count(),0);
  assert.equal(await reports.locator('[data-kind=errors] .count').textContent(),'1');
  await reports.locator('[data-kind=errors]').click();
  const entry=reports.locator('[data-path="sample.rows.r800.quantity"]');
  await entry.waitFor();assert.match(await entry.textContent(),/at least 0/);
  await entry.click();
  await page.waitForTimeout(300);
  await page.screenshot({path:`/private/tmp/complete-validation-${name}.png`});
  const number=grid.locator('gramlot-number-text-box input');
  assert.equal(await number.inputValue(),'-1');
  await number.fill('3');await number.press('Enter');
  await page.locator('#editing-accept button:not([disabled])').click();
  await page.waitForFunction(()=>document.getElementById('editing-notice').textContent.startsWith('Accepted locally.'),{},{timeout:60000});
  assert.equal(await reports.locator('[data-kind=errors] .count').textContent(),'0');
  assert.equal(await reports.locator('[data-kind=changes] .count').textContent(),'0');
  assert.equal(await page.locator('#editing-status').textContent(),'ok');
  assert.deepEqual(errors,[]);
  console.log(`${name}: all resident cells checked, zero unopened editors, offscreen error navigation/correction and complete acceptance passed`);
 } finally {await browser.close();}
}
