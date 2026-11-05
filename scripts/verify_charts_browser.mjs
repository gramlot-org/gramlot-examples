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
  for(const route of ['01-simple/01-bars','01-simple/02-trends','01-simple/03-shares','01-simple/04-points','02-time/01-snapshots','03-3d/01-bars','03-3d/02-surface','04-maps/01-territories']){
   errors.length=0;
   const keys={'01-simple/01-bars':'chart-bars','01-simple/02-trends':'chart-trends',
    '01-simple/03-shares':'chart-shares','01-simple/04-points':'chart-points',
    '02-time/01-snapshots':'grid-charts','03-3d/01-bars':'chart-bars-3d',
    '03-3d/02-surface':'chart-surface','04-maps/01-territories':'chart-territories'};
   await page.goto(base.startsWith('file:') ? base+'/playgrounds/'+keys[route]+'/index.html' : base+'/pages/05-charts/'+route);
   await page.waitForFunction(()=>['started','failed'].includes(window.gramlot?.state));
   assert.equal(await page.evaluate(()=>window.gramlot.state),'started',JSON.stringify(errors));
   if(!route.startsWith('02-time'))await page.getByRole('button',{name:'Chart',exact:true}).first().click();
   await page.getByRole('button',{name:'Chart settings',exact:true}).waitFor({timeout:15000});
   await page.locator('gramlot-chart-view svg, gramlot-chart-view canvas').first().waitFor({timeout:30000});
   assert.deepEqual(errors,[],route);
   console.log(name,route,'rendered');
   if(route.endsWith('01-bars')&&route.startsWith('01-simple')){
    const view=page.locator('gramlot-chart-view svg').first();
    const before=await view.innerHTML();
    await page.getByRole('textbox',{name:'North revenue',exact:true}).press('ControlOrMeta+A');
    await page.getByRole('textbox',{name:'North revenue',exact:true}).pressSequentially('240');
    await page.getByRole('textbox',{name:'North revenue',exact:true}).press('Tab');
    await page.waitForFunction(()=>window.gramlot.data.getItem('report.rows.north.revenue')===240);
    await page.waitForFunction(previous=>document.querySelector('gramlot-chart-view').shadowRoot.querySelector('svg').innerHTML!==previous,before);
    await page.evaluate(()=>window.gramlot.data.setItem('report._chart.chartType','line'));
    await page.evaluate(()=>window.gramlot.data.setItem('report._chart.open',false));
    await page.getByRole('button',{name:'Chart',exact:true}).first().click();
    await page.getByRole('button',{name:'Chart settings',exact:true}).waitFor();
    const config=await page.evaluate(()=>window.gramlot.data.getItem('report._chart.chartType'));
    assert.equal(config,'line');
    await page.locator('gramlot-search-box input').fill('North');
    await page.waitForFunction(()=>!document.querySelector('gramlot-chart-view').shadowRoot.querySelector('svg').textContent.includes('South'));
    assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('report.rows').getNodes().length),4);
    await page.locator('gramlot-search-box input').fill('');
    await page.waitForFunction(()=>document.querySelector('gramlot-chart-view').shadowRoot.querySelector('svg').textContent.includes('South'));
   }
  }
 }finally{await browser.close()}
}
