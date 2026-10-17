import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [playwrightEntry, ...urls] = process.argv.slice(2);
if (!playwrightEntry || !urls.length) throw new Error('Usage: verify_typed_components_browser.mjs PLAYWRIGHT_ENTRY URL...');
const {chromium, webkit} = await import(pathToFileURL(playwrightEntry));
async function fill(input,text) { await input.focus(); await input.fill(text); }
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for(const base of urls) {
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.clock.setFixedTime(new Date(2026,9,17,12));
  const route=k=>base+k+(base.startsWith('file:')?'/index.html':'');
  await page.goto(route('w10'));await page.locator('#amount input').waitFor();
  const amount=page.locator('#amount input');
  assert.equal(await amount.inputValue(),'12,50');
  await fill(amount,'38,25');await amount.press('Enter');
  assert.equal(await page.locator('#amount-copy input').inputValue(),'38,25');
  await fill(amount,'bad');await amount.press('Tab');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('amount')),38.25);
  assert.equal(await amount.getAttribute('aria-invalid'),'true');
  await amount.focus();await amount.press('Escape');assert.equal(await amount.inputValue(),'38,25');
  await page.locator('#live input').check();await fill(amount,'39,50');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('amount')),39.5);
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'R');
  assert.equal(await page.locator('#amount .labelbox').getAttribute('data-position'),'R');
  const exact=page.locator('#exact input');await fill(exact,'9007199254740993,75');await exact.press('Tab');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('exact').toString()),'9007199254740993.75');
  assert.equal(await page.locator('#exact-value').textContent(),'9007199254740993,75');
  const quantity=page.locator('#quantity input');await fill(quantity,'2,5');await quantity.press('Tab');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('quantity')),3);
  await page.screenshot({path:`/tmp/gramlot-typed-${name}-${base.startsWith('file:')?'file':new URL(base).port}.png`});
  await page.goto(route('w11'));const date=page.locator('#date input');await date.waitFor();
  assert.match(await date.inputValue(),/16 ottobre 2026/);
  await fill(date,'ieri');await date.press('Enter');assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('date').toISOString()),'2026-10-16T00:00:00.000Z');
  await fill(date,'domani');await date.press('Enter');await date.press('Tab');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('date').toISOString()),'2026-10-18T00:00:00.000Z');
  assert.match(await date.inputValue(),/18 ottobre/);
  await fill(date,'31/02/2026');await date.press('Tab');assert.equal(await date.getAttribute('aria-invalid'),'true');
  await fill(date,'');await date.press('Tab');assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('date')),null);
  await page.goto(route('w12'));const time=page.locator('#time input');await time.waitFor();
  await fill(time,'14:35:20.125');await time.press('Enter');await time.press('Tab');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('time').toISOString()),'1970-01-01T14:35:20.125Z');
  await fill(time,'25:00');await time.press('Tab');assert.equal(await time.getAttribute('aria-invalid'),'true');
  await fill(time,'00:00');await time.press('Tab');assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('time').getUTCHours()),0);
  await page.locator('#locked input').check();assert.equal(await time.getAttribute('readonly'),'');
  await page.setViewportSize({width:360,height:800});
  for(const k of ['w10','w11','w12']) {await page.goto(route(k));await page.locator('main').first().waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,k);}
  assert.deepEqual(errors,[],`${name} ${base}`);
  console.log(`PASS ${name} ${base}: localized typed edits, invalid/null, Decimal, date words, time, labelbox, readonly, compact layout`);
  await page.close();
 }} finally {await browser.close();}
}
