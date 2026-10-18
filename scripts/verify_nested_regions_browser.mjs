import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, base='http://127.0.0.1:8243/']=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for(const [name,type] of Object.entries({chromium,webkit})) {
 const browser=await type.launch();
 try {
  const page=await browser.newPage({viewport:{width:1500,height:1200}}),errors=[];
  page.on('pageerror',e=>{errors.push(e.message);console.log(e.message)});
  page.on('console',m=>{if(m.type()==='error')console.log(m.text())});

  await page.goto(new URL('l05',base).href);
  await page.locator('#lab-customer input').waitFor({timeout:15000}).catch(async e=>{console.log(await page.locator('body').innerText());throw e});
  assert.equal(await page.locator('gramlot-border-container').count(),5);
  await page.evaluate(()=>window.retained=[...document.querySelectorAll('gramlot-border-container, #lab-customer, #lab-note')]);
  const customer=page.locator('#lab-customer input'), note=page.locator('#lab-note textarea');
  await customer.fill('A');await customer.press('Tab');
  await note.fill('A note through every resize');await note.press('Tab');
  assert.equal(await page.evaluate(()=>gramlot.data.getItem('customer')),'Ada Lovelace');
  for(const [path,host,side,axis,min,max] of [
   ['outer-top','lab-outer','top','height',40,110],['outer-bottom','lab-outer','bottom','height',35,130],
   ['outer-left','lab-outer','left','width',90,240],['outer-right','lab-outer','right','width',90,240],
   ['workspace-left','lab-workspace','left','width',70,200],['workspace-bottom','lab-workspace','bottom','height',50,180],
   ['editor-bottom','lab-editor','bottom','height',60,180]]) {
   const slider=page.locator(`#size-${path} input`);
   await slider.focus();await slider.press('End');
   await page.waitForTimeout(40);
   const region=page.locator(`#${host}`).locator(`.region[data-side=${side}]`).first();
   assert(Math.abs((await region.boundingBox())[axis]-max)<2,`${path} max geometry`);
   await slider.press('Home');await page.waitForTimeout(40);
   assert(Math.abs((await region.boundingBox())[axis]-min)<2,`${path} min geometry`);
  }
  const drawer=page.locator('#lab-outer').locator('.separator[data-side=left] .drawer').first();
  await drawer.click();assert.equal(await drawer.getAttribute('aria-expanded'),'false');
  await drawer.click();assert.equal(await drawer.getAttribute('aria-expanded'),'true');
  await page.locator('#lab-minimize input').uncheck();
  assert.equal(await drawer.locator('.drawer-label').evaluate(el=>getComputedStyle(el).opacity),'1');
  await page.locator('#lab-radius input').focus();await page.locator('#lab-radius input').press('End');
  assert.equal(await customer.inputValue(),'A');assert.equal(await note.inputValue(),'A note through every resize');
  assert(await page.evaluate(()=>retained.every(el=>el.isConnected)&&retained.every(el=>document.getElementById(el.id)===el)));
  assert.equal(await page.evaluate(()=>gramlot.data.getItem('customer')),'Ada Lovelace');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:`/tmp/nested-lab-${name}.png`,fullPage:true});
  console.log(`${name}: Python l05, five containers, seven sliders min/max, retained invalid draft/Data/DOM, drawer and radius passed`);
 } finally {await browser.close();}
}
