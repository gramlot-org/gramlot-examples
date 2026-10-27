import {galleryRow} from './gallery-navigation.mjs';
/** Verify content loaded on visibility on hosted and file-based galleries. */
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
for(const engine of [chromium,webkit]) {
 const browser=await engine.launch({headless:true});
 try {for(const base of process.argv.slice(2)) for(const mobile of [false,true]) {
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000}});page.setDefaultTimeout(15000);
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem(`gramlot.gallery.preferences:${location.pathname}`,JSON.stringify({codeVisible:false})));
  await page.goto(base);await page.waitForFunction(()=>window.gramlot?.state==='started');await page.waitForLoadState('networkidle');
  await page.evaluate(()=>{window.lessonCalls=[];const fn=gramlot.src.remoteSource;gramlot.src.remoteSource=function(target,name,params){lessonCalls.push({...params,time:performance.now()});return fn.call(this,target,name,params);};});
  assert.equal(await page.locator('iframe').count(),0);
  if(mobile)await page.locator('#gallery-mobile-menu').click();
  await (await galleryRow(page, 'components')).click();await page.locator('#panel-components h1').waitFor({state:'attached'});
  if(mobile && await (await galleryRow(page, 'w01')).isHidden())await page.locator('#gallery-mobile-menu').click();
  await (await galleryRow(page, 'w01')).click();const frame=page.frameLocator('#frame-w01');await frame.locator('#customer input').waitFor();
  await frame.locator('#customer input').fill('Keep this draft');await frame.locator('#customer input').press('Tab');
  assert.equal(await frame.locator('#customer-copy input').inputValue(),'Keep this draft');
  await page.evaluate(()=>window.retainedFrame=document.querySelector('#frame-w01'));
  assert.deepEqual(await page.evaluate(()=>lessonCalls.filter(c=>c.key==='w01').map(c=>c.view??'example')),['example']);
  assert.equal(await page.locator('#readme-w01').count(),0); assert.equal(await page.locator('#code-w01').count(),0);
  if(mobile)await page.locator('#gallery-view-code').click();else await page.locator('#index-code-toggle').click();
  await page.locator('#code-w01 .code-line').first().waitFor();
  if(mobile)await page.locator('#gallery-view-example').click();
  await page.locator('#preview-w01').getByRole('tab',{name:'Explanation',exact:true}).click();await page.locator('#readme-w01 h1').waitFor();
  await page.locator('#preview-w01').getByRole('tab',{name:'Example',exact:true}).click();
  if(mobile)await page.locator('#gallery-mobile-menu').click();
  await (await galleryRow(page, 'w02')).click();await page.frameLocator('#frame-w02').locator('body').waitFor();
  if(mobile)await page.locator('#gallery-mobile-menu').click();
  await (await galleryRow(page, 'w01')).click();await frame.locator('#customer input').waitFor();
  assert.equal(await page.evaluate(()=>document.querySelector('#frame-w01')===retainedFrame),true);
  assert.equal(await frame.locator('#customer input').inputValue(),'Keep this draft');
  assert.deepEqual(await page.evaluate(()=>lessonCalls.filter(c=>c.key==='w01').map(c=>c.view??'example')),['example','code','description']);
  assert.deepEqual(errors,[]);console.log('PASS',engine.name(),base,mobile?'mobile':'desktop','hidden content makes no RPC, load on visibility, retained Source/iframe/Data and once-only requests');await page.close();
 }}finally{await browser.close();}
}
