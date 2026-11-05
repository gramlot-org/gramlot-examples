import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const [playwrightEntry,base='http://127.0.0.1:61535']=process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: verify_gallery_single_browser.mjs PLAYWRIGHT_ENTRY [BASE_URL]');
const {chromium,webkit}=await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
for(const [name,engine] of Object.entries({chromium,webkit})){
 const b=await engine.launch();try{const p=await b.newPage();const errors=[];p.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
 await p.goto(base);await p.waitForFunction(()=>window.gramlot?.state==='started');
 const open=async title=>{await p.getByPlaceholder('Search examples').fill(title);await p.locator('#gallery-navigation-tree .leaf').getByText(title,{exact:true}).first().click()};
 await open('Hello, Gramlot!');await p.locator('#preview-e01').getByRole('tab',{name:'Code',exact:true}).first().click();
 await p.locator('#gallery-settings-button').click();await p.locator('#gallery-multipage input').uncheck();await p.evaluate(()=>window.gramlot.data.setItem('galleryIndex.settingsOpen',false));
 await p.locator('#preview-single').getByRole('tab',{name:'Code',exact:true}).first().waitFor();
 await p.waitForFunction(()=>document.querySelector('#frame-single')?.src.endsWith('/01-hello_world'));
 const iframe=await p.locator('#frame-single').elementHandle(), tabs=await p.locator('#preview-single').elementHandle();
 await open('Data and bindings');await p.waitForFunction(()=>window.gramlot.data.getItem('galleryIndex.singleUrl')?.includes('02-data_bindings'));
 assert.ok(await p.locator('#frame-single').evaluate((el,previous)=>el===previous,iframe));assert.ok(await p.locator('#preview-single').evaluate((el,previous)=>el===previous,tabs));
 assert.equal(await p.locator('#gallery-single iframe').count(),1);assert.equal(await p.locator('#index-pages iframe').count(),0);
 assert.equal(await p.locator('#preview-single').getByRole('tab',{name:'Code',exact:true}).first().getAttribute('aria-selected'),'true');
 await p.locator('#preview-single').getByRole('tab',{name:'Example',exact:true}).click();
 const f=p.frameLocator('#frame-single');await f.locator('input:not([type=range])').fill('Temporary');await f.locator('input:not([type=range])').press('Tab');
 await open('Hello, Gramlot!');await p.waitForFunction(()=>window.gramlot.data.getItem('galleryIndex.singleUrl')?.includes('01-hello_world'));
 await open('Data and bindings');await f.locator('input:not([type=range])').waitFor();assert.equal(await f.locator('input:not([type=range])').inputValue(),'Hello, Gramlot!');
 await open('Drawers');
 await p.waitForFunction(()=>window.gramlot.data.getItem('galleryGuide.available')===true);
 await open('Data and bindings');
 await f.locator('input:not([type=range])').waitFor();
 assert.equal(await p.evaluate(()=>document.querySelector('#gallery-guide').hidden),true);
 await p.reload();await p.waitForFunction(()=>window.gramlot?.state==='started');assert.equal(await p.evaluate(()=>window.gramlot.data.getItem('galleryIndex.multipage')),false);
 await open('Data and bindings');await p.locator('#preview-single').waitFor();
 await p.locator('#gallery-settings-button').click();await p.locator('#gallery-multipage input').check();await p.evaluate(()=>window.gramlot.data.setItem('galleryIndex.settingsOpen',false));
 await p.locator('#preview-fundamentals-bindings').waitFor();await open('Hello, Gramlot!');await p.locator('#preview-e01').waitFor();assert.equal(await p.locator('#index-pages iframe').count(),2);
 assert.deepEqual(errors,[]);console.log(name,'PASS single iframe identity, tabs, reset, persistence, multipage');
 }finally{await b.close()}
}
