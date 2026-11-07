import {verifyChart} from './chart-behaviors.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
// BASE_URL serves the main gallery pages, CHART_BASE_URL the chart gallery pages (GE-010 section 017).
const [playwrightEntry,base='http://127.0.0.1:61535',chartBase=null]=process.argv.slice(2);
if(!playwrightEntry)throw new Error('Usage: verify_charts_browser.mjs PLAYWRIGHT_ENTRY [BASE_URL [CHART_BASE_URL]]');
const {chromium,webkit}=await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
for(const [name,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const routes=[[base,'05-charts/01-bars','chart-bars'],[base,'05-charts/02-trends','chart-trends'],
   [base,'05-charts/05-snapshots','grid-charts'],
   ...(chartBase ? [[chartBase,'01-simple/01-shares','chart-shares'],[chartBase,'01-simple/02-points','chart-points'],
    [chartBase,'02-3d/01-bars_3d','chart-bars-3d'],[chartBase,'02-3d/02-surface','chart-surface'],
    [chartBase,'03-maps/01-territories','chart-territories']] : [])];
  for(const [root,route,key] of routes){
   errors.length=0;
   await page.goto(root.startsWith('file:') ? root+'/playgrounds/'+key+'/index.html' : root+'/pages/'+route);
   await page.waitForFunction(()=>['started','failed'].includes(window.gramlot?.state));
   assert.equal(await page.evaluate(()=>window.gramlot.state),'started',JSON.stringify(errors));
   await verifyChart(page, key);
   assert.deepEqual(errors, [], route);
   console.log(name, route, 'rendered');
  }
 }finally{await browser.close()}
}
