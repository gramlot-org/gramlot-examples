import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {galleryRow} from './gallery-navigation.mjs';
for(const url of process.argv.slice(2))for(const engine of [chromium,webkit]){
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:1360,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 const settings=page.locator('#gallery-settings-button button');await settings.click();
 const choose=async(id,caption)=>{await page.locator(`#${id} input`).fill(caption);await page.locator(`#${id}`).getByRole('option',{name:caption,exact:true}).click();};
 await choose('index-appearance','Mela');await choose('index-palette','Theme default');await settings.click();
 await (await galleryRow(page,'l09')).click();
 const frame=page.frameLocator('#frame-l09');
 await frame.getByRole('heading',{name:'Mela: desktop and touch'}).waitFor();
 const title=frame.locator('main gramlot-textbox input');await title.fill('Retained Mela draft');await title.press('Tab');
 for(const mobile of [false,true]){
  await page.setViewportSize(mobile?{width:390,height:844}:{width:1360,height:960});
  for(const mode of ['Light','Dark']){
   await settings.click();await choose('index-theme',mode);await settings.click();
   const input=frame.locator('main gramlot-textbox input');
   await input.evaluate((el,height)=>new Promise(resolve=>{const check=()=>getComputedStyle(el).minHeight===height+'px'?resolve():requestAnimationFrame(check);check();}),mobile?44:28);
   assert.equal(await input.inputValue(),'Retained Mela draft');
   await frame.locator('main').getByRole('button',{name:'Document',exact:true}).click();
   await frame.getByRole('menuitem',{name:'Export',exact:true}).first().hover();
   await frame.getByRole('menuitem',{name:'PDF',exact:true}).first().waitFor();
   assert.equal(await frame.getByRole('menuitem',{name:'PDF',exact:true}).first().getAttribute('aria-disabled'),'true');
   await frame.getByRole('menuitem',{name:'Text preview',exact:true}).first().click();
   for(const kind of ['dialog','floating']){
    await frame.locator(`#mela-open-${kind}`).getByRole('button').click();
    const win=frame.locator(`#mela-${kind} dialog`);await win.waitFor({state:'visible'});
    assert.equal(await win.evaluate(el=>el.matches(':modal')),kind==='dialog');
    const rect=await win.boundingBox(),size=await frame.locator('html').evaluate(el=>({width:el.clientWidth,height:el.clientHeight}));
    assert.ok(rect.width<=size.width && rect.height<=size.height,JSON.stringify({rect,size}));
    if(url===process.argv[2] && engine===chromium)await page.screenshot({path:`/tmp/mela-${mobile?'mobile':'desktop'}-${mode.toLowerCase()}-${kind}.png`});
    await frame.locator(`#mela-${kind}`).getByRole('button',{name:'Close window',exact:true}).click();
   }
  }
 }
 assert.deepEqual(errors,[]);
 console.log(engine.name(),url,'Mela light/dark desktop/mobile, menu, dialog, floating, retained Data passed');
 }finally{await browser.close();}
}
