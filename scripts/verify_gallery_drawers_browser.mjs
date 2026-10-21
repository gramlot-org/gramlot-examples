import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
if (!process.argv[2]) throw new Error('Pass one or more gallery URLs');
for(const url of process.argv.slice(2)) for(const engine of [chromium,webkit]) {
 const browser=await engine.launch();
 try {
 const page=await browser.newPage({viewport:{width:1440,height:900}}); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);
 const inspector=page.locator('.gallery-toolbar #gallery-inspector');
 await inspector.waitFor();
 assert.match(await inspector.textContent(),/Inspector/);
 const drawer=page.locator('#gallery-regions [data-side="bottom"] .drawer');
 await drawer.click();
 await page.locator('#index-appearance').waitFor({state:'visible'});
 await page.locator('#index-theme').selectOption('dark');
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('#index-theme').selectOption('light');
 await drawer.click();
 await inspector.click();
 await page.locator('gramlot-tools-inspector gramlot-poc-palette').waitFor({state:'visible'});
 await inspector.click();
 await page.locator('gramlot-tools-inspector').waitFor({state:'detached'});
 await drawer.click();
 if(url===process.argv[2] && engine===chromium) await page.screenshot({path:'/tmp/gallery-inspector-settings.png'});
 await page.setViewportSize({width:390,height:844});
 await inspector.click();
 await page.locator('gramlot-tools-inspector[docked] gramlot-poc-palette').waitFor({state:'visible'});
 await inspector.click();
 await page.locator('#index-appearance').waitFor({state:'visible'});
 assert.deepEqual(errors,[]);
 console.log('PASS',url,engine.name(),'toolbar inspector, direct settings drawer, theme, mobile inspector return');
 }finally{await browser.close();}
}
