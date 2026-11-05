import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const [playwrightEntry, base='http://127.0.0.1:61535']=process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: verify_gallery_view_browser.mjs PLAYWRIGHT_ENTRY [BASE_URL]');
const {chromium,webkit}=await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
for(const [name,engine] of Object.entries({chromium,webkit})){
const b=await engine.launch();try{const p=await b.newPage({viewport:{width:1920,height:1000}});const errors=[];
p.on('pageerror',e=>errors.push(e.message));
await p.goto(base);await p.waitForFunction(()=>window.gramlot?.state==='started');
const open=async title=>{await p.getByPlaceholder('Search examples').fill(title);await p.locator('#gallery-navigation-tree').getByText(title,{exact:true}).first().click();};
await open('Hello, Gramlot!');await p.locator('#preview-e01').getByRole('tab',{name:'Code',exact:true}).click();
await open('Data and bindings');
await p.waitForFunction(()=>window.gramlot.data.getItem('galleryIndex.lessonViews.fundamentals-bindings')==='code');
await p.locator('#preview-fundamentals-bindings').getByRole('tab',{name:'Example',exact:true}).click();
const frame=p.frameLocator('#frame-fundamentals-bindings');await frame.locator('input[type=range]').waitFor();
const box=await frame.locator('input[type=range]').boundingBox();assert.ok(box.width<500,JSON.stringify(box));
await frame.locator('input:not([type=range])').fill('Preserved draft');await frame.locator('input:not([type=range])').press('Tab');
await p.locator('#gallery-settings-button').click();await p.locator('#gallery-keep-view input').uncheck();
await p.evaluate(()=>window.gramlot.data.setItem('galleryIndex.settingsOpen',false));
await p.locator('#index-pages').getByRole('tab',{name:'Hello, Gramlot!',exact:true}).click();
await p.waitForFunction(()=>window.gramlot.data.getItem('galleryIndex.lessonViews.e01')==='code');
await p.locator('#index-pages').getByRole('tab',{name:'Data and bindings',exact:true}).click();
assert.equal(await frame.locator('input:not([type=range])').inputValue(),'Preserved draft');

await p.setViewportSize({width:640,height:800});const small=await frame.locator('input[type=range]').boundingBox();assert.ok(small.width<=640);
await p.reload();await p.waitForFunction(()=>window.gramlot?.state==='started');assert.equal(await p.evaluate(()=>window.gramlot.data.getItem('galleryIndex.keepLessonView')),false);
assert.deepEqual(errors,[]);console.log(name,'PASS: view preference, per-example state, reload, widths',box.width,small.width);
}finally{await b.close()}}
