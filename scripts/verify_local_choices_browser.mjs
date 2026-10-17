import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...urls]=process.argv.slice(2);
if(!entry||!urls.length) throw new Error('Usage: verify_local_choices_browser.mjs PLAYWRIGHT_ENTRY URL...');
const {chromium,webkit}=await import(pathToFileURL(entry));
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for(const base of urls) {
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const route=k=>base+k+(base.startsWith('file:')?'/index.html':'');
  await page.goto(route('w15'));
  const city=page.locator('#choice input'),copy=page.locator('#choice-copy input');
  await city.waitFor();assert.equal(await city.inputValue(),'Rome');
  await city.fill('Pa');await page.locator('#choice [role=option]').waitFor();await city.press('Enter');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('choice')),'Paris');
  assert.equal(await copy.inputValue(),'Paris');
  await city.fill('New city');await city.press('Tab');
  assert.equal(await copy.inputValue(),'New city');
  assert.equal(await city.getAttribute('aria-invalid'),'false');
  await city.fill('draft');await city.press('Escape');assert.equal(await city.inputValue(),'New city');
  await city.fill('');await city.press('Tab');assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('choice')),'');
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'R');
  assert.equal(await page.locator('#choice .labelbox').getAttribute('data-position'),'R');
  await page.locator('#locked input').check();assert.equal(await city.getAttribute('readonly'),'');
  await page.goto(route('w16'));
  const box=(id,code)=>page.locator(`#${id} input[value="${code}"]`);
  await box('channels','email').waitFor();
  assert.equal(await box('channels','email').isChecked(),true);
  assert.equal(await box('channels','push').isChecked(),true);
  await box('channels','sms').check();
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('channels')),'email,push,sms');
  assert.equal(await box('channels-copy','sms').isChecked(),true);
  for(const code of ['email','push','sms']) await box('channels-copy',code).uncheck();
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('channels')),null);
  await box('channels','push').focus();await box('channels','push').press('Home');
  await box('channels','email').press('Space');await box('channels','email').press('ArrowRight');await box('channels','sms').press('Space');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('channels')),'email,sms');
  await page.locator('#columns').focus();await page.locator('#columns').press('End');
  assert.equal(await page.locator('#columns-value').textContent(),'3');
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'R');assert.equal(await page.locator('#channels .labelbox').getAttribute('data-position'),'R');
  await page.locator('#locked input').check();assert.equal(await box('channels','email').isDisabled(),true);
  await page.locator('#locked input').uncheck();assert.equal(await box('channels','email').isDisabled(),false);
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'TL');
  await page.screenshot({path:`/tmp/gramlot-local-choices-${name}-${base.startsWith('file:')?'file':new URL(base).port}.png`});
  await page.setViewportSize({width:360,height:800});
  for(const k of ['w15','w16']) {await page.goto(route(k));await page.locator('main').first().waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,k);}
  assert.deepEqual(errors,[],`${name} ${base}`);
  console.log(`PASS ${name} ${base}: free text, suggestions, shared codes, null/empty, keyboard, readonly, labelbox and compact layout`);
  await page.close();
 }} finally {await browser.close();}
}
