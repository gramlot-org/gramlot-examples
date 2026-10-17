import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...urls]=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for(const base of urls) {
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.clock.setFixedTime(new Date(2026,9,17,12));
  await page.goto(base+'w17'+(base.startsWith('file:')?'/index.html':''));
  const input=page.locator('#date input'),plain=page.locator('#plain input');
  await input.waitFor();assert.equal(await page.locator('#plain .calendar-toggle').isVisible(),false);
  const read=()=>page.evaluate(()=>window.gramlot.data.getItem('date')?.toISOString()??null);
  assert.equal(await read(),'2026-10-16T00:00:00.000Z');
  await page.locator('#calendar [data-date="2026-10-20"]').click();
  assert.equal(await read(),'2026-10-20T00:00:00.000Z');assert.match(await input.inputValue(),/20/);assert.match(await plain.inputValue(),/20/);
  await input.focus();await input.press('Alt+ArrowDown');
  await page.locator('#date .calendar-popup').waitFor({state:'visible'});
  await page.locator('#date .calendar-popup [data-date="2026-10-22"]').click();
  assert.equal(await read(),'2026-10-22T00:00:00.000Z');assert.equal(await page.locator('#date .calendar-popup').isVisible(),false);
  await page.locator('#date .calendar-toggle').click();await page.keyboard.press('Escape');
  assert.equal(await page.locator('#date .calendar-popup').isVisible(),false);
  await input.fill('ieri');await input.press('Enter');assert.equal(await read(),'2026-10-16T00:00:00.000Z');
  await input.fill('domani');await input.press('Enter');assert.equal(await read(),'2026-10-18T00:00:00.000Z');
  await page.locator('#calendar [data-date="2026-10-18"]').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await read(),'2026-10-18T00:00:00.000Z');await page.keyboard.press('Enter');assert.equal(await read(),'2026-10-19T00:00:00.000Z');
  await page.locator('#date .calendar-toggle').click();await page.locator('#date button[aria-label="Clear date"]').click();assert.equal(await read(),null);
  await page.locator('#calendar button[aria-label="Today"]').click();assert.equal(await read(),'2026-10-17T00:00:00.000Z');
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'R');assert.equal(await page.locator('#calendar .labelbox').getAttribute('data-position'),'R');
  await page.locator('#locked input').check();assert.equal(await page.locator('#date .calendar-toggle').isDisabled(),true);assert.equal(await page.locator('#calendar button').first().isDisabled(),true);
  await page.locator('#locked input').uncheck();await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'TL');
  await page.screenshot({path:`/tmp/gramlot-calendar-${name}-${base.startsWith('file:')?'file':new URL(base).port}.png`});
  await page.setViewportSize({width:360,height:800});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#date .calendar-toggle').click();
  const popup=await page.locator('#date .calendar-popup').boundingBox();assert(popup.x>=0&&popup.x+popup.width<=361);
  await page.keyboard.press('Escape');
  assert.deepEqual(errors,[],`${name} ${base}`);
  console.log(`PASS ${name} ${base}: typed D, popup/default/opt-out, natural text, keyboard, null, readonly, labelbox, compact layout`);
  await page.close();
 }} finally {await browser.close();}
}
