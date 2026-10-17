import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...urls]=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for (const base of urls) {
  const page=await browser.newPage({viewport:{width:1280,height:900}}), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const route=k=>base+k+(base.startsWith('file:')?'/index.html':'');
  await page.goto(route('w13'));
  const first=page.locator('#choice input'), second=page.locator('#choice-copy input');
  await first.waitFor(); await page.waitForFunction(()=>document.querySelector('#choice').control.value==='Express');
  await first.fill('Sta'); await page.locator('#choice [role=option]').waitFor(); await first.press('Enter');
  await page.waitForFunction(()=>window.gramlot.data.getItem('choice')==='standard');
  assert.equal(await second.inputValue(),'Standard');
  await first.fill('invalid'); await first.press('Tab');
  assert.equal(await first.getAttribute('aria-invalid'),'true');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('choice')),'standard');
  await first.focus(); await first.press('Escape'); await page.waitForFunction(()=>document.querySelector('#choice').control.value==='Standard');
  await page.locator('#choice .toggle').click(); await page.locator('#choice [role=option]').first().waitFor();
  await first.press('ArrowDown'); await first.press('Enter');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('choice')),'express');
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'R');
  assert.equal(await page.locator('#choice .labelbox').getAttribute('data-position'),'R');
  await page.locator('#locked input').check(); assert.equal(await first.getAttribute('readonly'),'');
  await page.goto(route('w14')); await first.waitFor();
  await page.waitForFunction(()=>document.querySelector('#choice').control.value.startsWith('Sample 001'));
  const initial=await first.inputValue();
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('samples').getNodes().length),100);
  await first.fill('Sample 02'); await page.waitForFunction(()=>document.querySelector('#choice').choices.children.length===10);
  assert.equal(await page.locator('#choice [role=option]').count(),10);
  await page.locator('#choice [role=option]').nth(5).click();
  await page.waitForFunction(()=>window.gramlot.data.getItem('choice')==='item_025');
  assert.match(await second.inputValue(),/^Sample 025/);
  await first.fill('Sample 001'); await page.locator('#choice [role=option]').waitFor();
  assert.equal(await page.locator('#choice [role=option]').textContent(),initial);
  await page.screenshot({path:`/tmp/gramlot-choices-${name}-${base.startsWith('file:')?'file':new URL(base).port}.png`});
  await first.fill(''); await first.press('Tab');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('choice')),null);
  await page.setViewportSize({width:360,height:800});
  for(const k of ['w13','w14']) {await page.goto(route(k));await first.waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,k);}
  assert.deepEqual(errors,[],`${name} ${base}`);
  console.log(`PASS ${name} ${base}: search, selection, keyboard, invalid/null, labelbox, readonly, stable random Bag, compact layout`);
  await page.close();
 }} finally {await browser.close();}
}
