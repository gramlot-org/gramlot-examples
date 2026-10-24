import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {galleryRow} from './gallery-navigation.mjs';
for(const url of process.argv.slice(2))for(const engine of [chromium,webkit]){
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>window.gramlot?.state==='started');
 await page.locator('#gallery-navigation-tree').getByRole('treeitem').first().waitFor();
 await (await galleryRow(page,'w01')).click();
 await page.locator('#gallery-settings-button button').click();
 const win=page.locator('#gallery-settings dialog');await win.waitFor();
 await page.frameLocator('#frame-w01').locator('#customer input').waitFor();
 await page.locator('#gallery-regions .separator[data-side="right"]').waitFor({state:'visible'});
 const splitter=await page.locator('#gallery-regions .separator[data-side="right"]').boundingBox();
 assert.ok(splitter);
 await page.locator('#gallery-settings').evaluate((el,left)=>{
  gramlot.src.renderer.elements.get(el).node.setAttr({left:left+'px',top:'150px'});
 },splitter.x-180);
 for(const mode of ['Light','Dark']){
  await page.locator('#index-theme input').fill(mode);await page.locator('#index-theme').getByRole('option',{name:mode,exact:true}).click();
  await page.mouse.move(10,10);
  const box=await win.boundingBox();
  const result=await page.evaluate(({x,y})=>{
   const hit=document.elementFromPoint(x,y);
   let node=hit;while(node){if(node.id==='gallery-settings')break;node=node.parentElement??node.getRootNode().host;}
   const shell=document.getElementById('gallery-settings').shell;
   return {covered:!!node,hit:hit?.localName,color:getComputedStyle(shell).backgroundColor,modal:shell.matches(':modal')};
  },{x:splitter.x+splitter.width/2,y:box.y+15});
  assert.equal(result.covered,true,JSON.stringify(result));
  assert.match(result.color,/^rgb\(/);assert.equal(result.modal,false);
  if(url===process.argv[2]&&engine===chromium)await page.screenshot({path:`/tmp/gramlot-floating-layer-${mode.toLowerCase()}.png`});
 }
 await page.locator('#gallery-settings button[aria-label="Close window"]').click();
 await page.locator('#gallery-regions .separator[data-side="right"]').focus();
 await page.locator('#gallery-regions .separator[data-side="right"]').press('ArrowLeft');
 assert.deepEqual(errors,[]);
 console.log(engine.name(),url,'opaque floating covers splitter in light/dark; background remains nonmodal');
 }finally{await browser.close();}
}
