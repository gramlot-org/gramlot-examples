import {verifyChart} from './chart-behaviors.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const [playwrightEntry,base='http://127.0.0.1:61535']=process.argv.slice(2);
if(!playwrightEntry)throw new Error('Usage: verify_charts_browser.mjs PLAYWRIGHT_ENTRY [BASE_URL]');
const {chromium,webkit}=await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
for(const [name,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['01-bars','02-trends','03-shares','04-points','05-snapshots','06-bars_3d','07-surface','08-territories']){
   errors.length=0;
   const keys={'01-bars':'chart-bars','02-trends':'chart-trends',
    '03-shares':'chart-shares','04-points':'chart-points',
    '05-snapshots':'grid-charts','06-bars_3d':'chart-bars-3d',
    '07-surface':'chart-surface','08-territories':'chart-territories'};
   await page.goto(base.startsWith('file:') ? base+'/playgrounds/'+keys[route]+'/index.html' : base+'/pages/05-charts/'+route);
   await page.waitForFunction(()=>['started','failed'].includes(window.gramlot?.state));
   assert.equal(await page.evaluate(()=>window.gramlot.state),'started',JSON.stringify(errors));
   await verifyChart(page, keys[route]);
   assert.deepEqual(errors, [], route);
   console.log(name, route, 'rendered');
  }
 }finally{await browser.close()}
}
