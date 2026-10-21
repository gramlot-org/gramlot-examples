import {galleryRow} from './gallery-navigation.mjs';
/** Verify tabs created on selection and retained Data on both delivered galleries and offline export. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
if (!process.argv.slice(2).length) throw new Error('Pass gallery URLs or an extracted file:// index');
for (const engine of [chromium, webkit]) {
 const browser = await engine.launch({headless: true});
 try { for(const base of process.argv.slice(2)) {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];const calls=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')calls.push(r.postData()||'');});
  await page.goto(base);await page.waitForFunction(()=>window.gramlot?.state==='started');await page.waitForLoadState('networkidle');
  assert.equal(await page.evaluate(()=>document.querySelector('#index-pages').children.length),1);assert.equal(await page.locator('iframe').count(),0);
  await (await galleryRow(page, 'components')).click();await page.locator('#panel-components h1').waitFor();
  await (await galleryRow(page, 'w01')).click();
  const frame=page.frameLocator('#frame-w01');await frame.locator('#customer input').waitFor();
  await frame.locator('#customer input').fill('Retained draft');await frame.locator('#customer input').press('Tab');
  assert.equal(await frame.locator('#customer-copy input').inputValue(),'Retained draft');
  await page.evaluate(()=>{window.testFrame=document.querySelector('#frame-w01');window.testSource=gramlot.src.renderer.elements.get(testFrame).node;});
  const firstCalls=calls.filter(s=>s.includes('lesson')&&s.includes('w01')).length;
  if(!base.startsWith('file:'))assert.equal(firstCalls,2);
  await (await galleryRow(page, 'w02')).click();await page.frameLocator('#frame-w02').locator('body').waitFor();
  await (await galleryRow(page, 'w01')).click();await page.waitForFunction(()=>gramlot.data.getItem('galleryIndex.active')==='w01');
  assert.equal(await page.evaluate(()=>document.querySelector('#frame-w01')===testFrame && gramlot.src.renderer.elements.get(testFrame).node===testSource),true);
  assert.equal(await frame.locator('#customer input').inputValue(),'Retained draft');
  assert.equal(calls.filter(s=>s.includes('lesson')&&s.includes('w01')).length,firstCalls);
  await page.locator('#preview-w01').getByRole('tab',{name:'Explanation',exact:true}).click();await page.locator('#readme-w01 h1').waitFor();
  await page.locator('#preview-w01').getByRole('tab',{name:'Example',exact:true}).click();
  assert.equal(await page.locator('#code-w01').count(),1);
  await page.locator('#gallery-inspector').click();await page.locator('gramlot-tools-inspector gramlot-poc-palette').waitFor();
  await page.setViewportSize({width:390,height:844});
  for(const view of ['code','inspector','example']){await page.locator(`#gallery-view-${view}`).click();await page.waitForFunction(v=>document.querySelector('#gallery').dataset.mobileView===v,view);}
  assert.equal(await frame.locator('#customer input').inputValue(),'Retained draft');
  await page.setViewportSize({width:1440,height:1000});
  if(!base.startsWith('file:')) {
  await (await galleryRow(page, 'layout')).click();await page.locator('#panel-layout h1').waitFor();
  await (await galleryRow(page, 'l04')).click();await page.frameLocator('#frame-l04').locator('body').waitFor();
  await page.waitForFunction(()=>gramlot.data.getItem('galleryGuide.available')===true);
  await page.locator('#gallery-guide-play').click();await page.waitForFunction(()=>gramlot.data.getItem('galleryGuide.status')==='running');
  await page.locator('#gallery-guide-stop').click();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS',engine.name(),base,'empty initial index, first-click Source, iframe/Data identity, no repeat RPC, explanations/code, inspector, mobile views', base.startsWith('file:') ? '(offline guide excluded: existing file-origin restriction)' : 'and guided demo');
  await page.close();
 }}finally{await browser.close();}
}
