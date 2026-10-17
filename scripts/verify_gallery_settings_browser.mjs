import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, ...urls] = process.argv.slice(2);
const {chromium, webkit} = await import(pathToFileURL(entry));
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for(const url of urls) {
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 const gear=page.locator('#gallery-settings-toggle'),popup=page.locator('#gallery-settings');
 await gear.waitFor();assert.equal(await popup.isVisible(),false);const before=await page.locator('.index-main').boundingBox();
 await gear.click();await popup.waitFor();assert.deepEqual(await page.locator('.index-main').boundingBox(),before);
 await page.locator('#index-appearance').selectOption('mimi');await page.locator('#index-theme').selectOption('dark');
 await page.locator('#gallery-label-position').selectOption('R');await page.keyboard.press('Escape');assert.equal(await popup.isVisible(),false);
 await page.locator('details').filter({has:page.locator('#open-w17')}).locator('summary').first().click();
 await page.locator('#open-w17').click();const frame=page.frameLocator('#frame-w17');
 await frame.locator('#calendar .labelbox[data-position="R"]').waitFor();
 assert.equal(await frame.locator('#position').count(),0);
 assert.equal(await frame.locator('html').getAttribute('data-theme'),'dark');
 await gear.click();await page.locator('#gallery-label-position').selectOption('example');
 await frame.locator('#calendar .labelbox[data-position="TL"]').waitFor();
 await page.locator('#index-theme').selectOption('light');await page.screenshot({path:`/tmp/gallery-settings-${name}-${new URL(url).port||'static'}.png`});
 await page.locator('[aria-label="Close settings"]').click();assert.equal(await popup.isVisible(),false);
 await page.locator('#open-w01').click();const first=page.frameLocator('#frame-w01');await first.locator('#position').selectOption('BC');
 await first.locator('#customer .labelbox[data-position="BC"]').waitFor();
 await gear.click();await page.locator('#gallery-label-position').selectOption('L');await page.locator('[aria-label="Close settings"]').click();
 await first.locator('#customer .labelbox[data-position="L"]').waitFor();
 await gear.click();await page.locator('#gallery-label-position').selectOption('example');await page.locator('[aria-label="Close settings"]').click();
 await first.locator('#customer .labelbox[data-position="BC"]').waitFor();
 if(!url.startsWith('file:')) {await gear.click();await page.locator('#gallery-label-position').selectOption('TR');await page.reload();await gear.click();assert.equal(await page.locator('#gallery-label-position').inputValue(),'TR');}
 await page.setViewportSize({width:390,height:750});if(!await popup.isVisible())await gear.click();
 const box=await popup.boundingBox();assert(box.x>=0&&box.x+box.width<=390&&box.y>=0&&box.y+box.height<=750);
 assert.deepEqual(errors,[]);console.log(`PASS ${name} ${url}: popup, theme/color, lazy-frame labels, authored-pointer restore, persistence, narrow viewport`);await page.close();
 }}finally{await browser.close();}
}
