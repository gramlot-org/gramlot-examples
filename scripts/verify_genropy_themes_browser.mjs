import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...urls]=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for(const url of urls) {
  const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  const appearance=page.locator('#index-appearance');await page.locator('#gallery-settings-toggle').click();await appearance.waitFor();
  await page.locator('details').filter({has:page.locator('#open-w01')}).locator('summary').first().click();
  const open=async key=>{await page.locator('#open-'+key).click();const frame=page.frameLocator('#frame-'+key);await frame.locator('main').first().waitFor();return frame;};
  const textbox=await open('w01');
  for(const [name,height] of [['mimi',18],['joanna',20]]) {
   if(!await appearance.isVisible())await page.locator('#gallery-settings-toggle').click();await appearance.selectOption(name);
   for(const mode of ['light','dark']) {
    if(!await appearance.isVisible())await page.locator('#gallery-settings-toggle').click();await page.locator('#index-theme').selectOption(mode);await page.locator('[aria-label="Close settings"]').click();
    await textbox.locator('#customer input').waitFor();
    await page.waitForFunction(([key,value])=>getComputedStyle(document.documentElement).getPropertyValue(key).trim()===value,['--gramlot-field-height',height+'px']);
    await textbox.locator('html').evaluate(async(el)=>{await el.ownerDocument.fonts.ready;});
    const input=textbox.locator('#customer input');
    await input.evaluate((el,height)=>new Promise(resolve=>{const check=()=>getComputedStyle(el).minHeight===height+'px'?resolve():requestAnimationFrame(check);check();}),height);
    assert.equal(await input.evaluate(el=>getComputedStyle(el).minHeight),height+'px');
    // WebKit's native input line box may add one pixel to the CSS minimum.
    const actualHeight=await input.evaluate(el=>el.getBoundingClientRect().height);
    assert.ok(actualHeight>=height && actualHeight<=height+1,`${name}: unexpected field height ${actualHeight}`);
    assert.equal(await input.evaluate(el=>getComputedStyle(el).padding),'1px 3px');
    assert.equal(await textbox.locator('#customer .labelbox').evaluate(el=>getComputedStyle(el).gap),'2px');
    const bg=await input.evaluate(el=>getComputedStyle(el).backgroundColor);
    assert.equal(bg,mode==='light'?'rgb(255, 255, 255)':'rgb(32, 33, 36)');
    await input.fill('Theme test');await input.press('Tab');assert.equal(await textbox.locator('#customer-copy input').inputValue(),'Theme test');
    await page.waitForTimeout(200); // let the existing CSS color transitions finish
    await page.screenshot({path:`/tmp/${name}-${mode}-${engineName}-${url.startsWith('file:')?'file':new URL(url).port}.png`});
   }
  }
  const cal=await open('w17');
  const selected=cal.locator('#calendar button[aria-pressed=true]');await selected.waitFor();
  assert.equal(await selected.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(52, 120, 202)');
  const choices=await open('w13');await choices.locator('#choice .toggle').click();
  assert.equal(await choices.locator('#choice .choices').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(44, 44, 46)');
  const validation=await open('w18');const invalid=validation.locator('#name input');const beforeError=await validation.locator('#name').boundingBox();await invalid.fill('A');await invalid.press('Tab');
  assert.deepEqual(await validation.locator('#name').boundingBox(),beforeError);
  assert.equal(await invalid.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(72, 37, 36)');
  assert.equal(await validation.locator('#name #field-message').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(72, 37, 36)');
  if(!url.startsWith('file:')) {await page.reload();await page.locator('#gallery-settings-toggle').click();await appearance.waitFor();assert.equal(await appearance.inputValue(),'joanna');assert.equal(await page.locator('#index-theme').inputValue(),'dark');}
  assert.deepEqual(errors,[]);console.log(`PASS ${engineName} ${url}: both profiles/light/dark, shadow fields, Data editing, calendar, choice popup, error tooltip, hosted persistence`);
  await page.close();
 }}finally{await browser.close();}
}
