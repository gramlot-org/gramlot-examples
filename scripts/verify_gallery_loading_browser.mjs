import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
import {galleryRow} from './gallery-navigation.mjs';
const url=process.argv[2];
for (const engine of (process.env.ENGINES === "chromium" ? [chromium] : process.env.ENGINES === "webkit" ? [webkit] : [chromium, webkit])) {
 const browser=await engine.launch();
 try {
  for(let run=0;run<3;run++) {
   const context=await browser.newContext({viewport:{width:1280,height:850}});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   let start=performance.now();await page.goto(url);
   await page.waitForFunction(()=>window.gramlot?.state==='started');
   await page.frameLocator('#gallery-introduction iframe').getByRole('heading',{name:'Example gallery'}).waitFor();
   const shell=Math.round(performance.now()-start),times=[];
   for(const key of ['w01','l09','w01']) {
    const row=await galleryRow(page,key);start=performance.now();await row.click();
    const frame=page.frameLocator('#frame-'+key);
    try { await frame.locator('main input').first().waitFor(); } catch(error) {
     console.log('DIAGNOSTIC',JSON.stringify({errors,frames:await Promise.all(page.frames().map(async f=>({url:f.url(),text:(await f.locator('body').innerText()).slice(0,1200)})))}));throw error;
    }
    times.push(Math.round(performance.now()-start));
   }
   const frames=await Promise.all(['w01','l09'].map(async key=>{
    const frame=await page.locator('#frame-'+key).elementHandle();const content=await frame.contentFrame();
    return content.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/gramlot/collections/')).map(r=>({url:r.name,transfer:r.transferSize,decoded:r.decodedBodySize})));
   }));
   if(process.env.BASELINE!=='1') {
    for(const resources of frames) {
     assert.ok(resources.some(r=>r.url.includes('/inputs/')));
     assert.ok(resources.some(r=>r.url.includes('/layout/')));
     assert.ok(resources.every(r=>!r.url.includes('/typst/')&&!r.url.includes('/editors/')));
    }
    if(engine===chromium) assert.ok(frames[1].some(r=>r.transfer===0 && r.decoded>0),'collections reused from browser cache');
    assert.deepEqual(errors,[]);
   }
   console.log(JSON.stringify({engine:engine.name(),run,shell,textbox:times[0],mela:times[1],return:times[2],collectionBytes:frames.map(rs=>rs.reduce((n,r)=>n+r.transfer,0)),errors}));
   await context.close();
  }
 } finally { await browser.close(); }
}
