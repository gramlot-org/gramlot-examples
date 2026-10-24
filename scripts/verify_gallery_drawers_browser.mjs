import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
if (!process.argv[2]) throw new Error('Pass one or more gallery URLs');
for(const url of process.argv.slice(2)) for(const engine of [chromium,webkit]) {
 const browser=await engine.launch();
 try {
 const page=await browser.newPage({viewport:{width:1440,height:900}}); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);
 const inspector=page.locator('#gallery-rail #gallery-inspector button');
 await inspector.waitFor();
 assert.equal(await inspector.getAttribute('aria-label'),'Inspector');
 const drawer=page.locator('#gallery-settings-button button');
 await drawer.click();
 await page.locator('#index-appearance').waitFor({state:'visible'});
 await page.locator('#index-theme input').fill('Dark'); await page.locator('#index-theme').getByRole('option',{name:'Dark',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('#index-theme input').fill('Light'); await page.locator('#index-theme').getByRole('option',{name:'Light',exact:true}).click();
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
 console.log('PASS',url,engine.name(),'toolbar inspector, floating settings formlet, theme, mobile inspector return');
 }finally{await browser.close();}
}
