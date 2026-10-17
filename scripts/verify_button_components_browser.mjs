import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...urls]=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await type.launch({headless:true});
 try {for(const url of urls) {
  const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.locator('details').filter({has:page.locator('#open-w22')}).locator('summary').first().click();
  const open=async key=>{await page.locator(`#open-${key}`).click();const frame=await(await page.locator(`#frame-${key}`).elementHandle()).contentFrame();await frame.waitForFunction(()=>window.gramlot?.state==='started');return frame;};
  let f=await open('w22');
  await f.locator('#command-confirm button').click();await f.locator('dialog button[type=submit]').click();
  assert.equal(await f.locator('#command-result').innerText(),'Confirmed');
  await f.locator('#command-delay button').click();await f.locator('#command-result').filter({hasText:'Delayed: 1'}).waitFor();
  await f.locator('#command-native').click();assert.equal(await f.locator('#command-result').innerText(),'Explicit HTML event');
  f=await open('w23');await f.locator('#toggle-command button').click();
  assert.equal(await f.locator('#toggle-result').innerText(),'Enabled');assert.equal(await f.locator('#toggle-checkbox input').isChecked(),true);
  assert.ok((await f.locator('#toggle-command .led').boundingBox()).width>0);
  await f.locator('#toggle-checkbox input').uncheck();assert.equal(await f.locator('#toggle-command button').getAttribute('aria-pressed'),'false');
  f=await open('w24');await f.locator('#export-command .split').click();assert.equal(await f.locator('#dropdown-result').innerText(),'Default export');
  await f.locator('#export-command .arrow').click();await f.locator('#export-csv button').click();
  assert.equal(await f.locator('#dropdown-result').innerText(),'CSV export');
  await f.locator('#export-command .split').click();assert.equal(await f.locator('#dropdown-result').innerText(),'Default export');
  await f.locator('#export-command .arrow').click();await f.locator('#export-pdf button').click({modifiers:['Shift']});
  assert.equal(await f.locator('#export-command .split').innerText(),'Export PDF');
  await page.locator('#preview-mobile-w24').click();await f.locator('html[data-gramlot-touch=on]').waitFor();
  assert.equal(await f.locator('#dropdown-result').innerText(),'PDF export');
  await page.screenshot({path:`/tmp/gallery-buttons-${engine}-${new URL(url).port}.png`});
  assert.deepEqual(errors,[]);console.log(`PASS ${engine} ${url}: three examples, ask/delay/native, LED binding, normal/Shift dropdown, same-frame mobile`);
  await page.close();
 }}finally{await browser.close();}
}
