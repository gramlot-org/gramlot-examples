import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...bases]=process.argv.slice(2);
if(!entry||!bases.length) throw new Error('Usage: verify_border_examples_browser.mjs PLAYWRIGHT_ENTRY LAYOUT_FOLDER_URL...');
const {chromium,webkit}=await import(pathToFileURL(entry));
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const base of bases)for(const route of ['01_border','02_nested']){
  const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];
  page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));
  const target=base.startsWith('file:') ? `${route==='01_border'?'l01':'l02'}/index.html` : `border/${route}`;
  await page.goto(new URL(target,base).href);
  await page.waitForFunction(()=>['started','failed','disposed'].includes(window.gramlot?.state));
  assert.equal(await page.evaluate(()=>gramlot.state),'started',errors.join('; '));
  if(route==='01_border'){
   await page.locator('#customer-name input').fill('Grace');await page.locator('#customer-name input').press('Tab');
   assert.equal(await page.locator('#accepted-name').textContent(),'Grace');
   await page.locator('#border-demo .separator[data-side=left] button').click();
   await page.locator('#border-demo .separator[data-side=right] button').click();
   assert.equal(await page.locator('#customer-name input').inputValue(),'Grace');
  }else{
   const note=page.locator('#nested-note textarea');await note.fill('Retained example');await note.press('Tab');
   await page.locator('#design .toggle').click();await page.getByRole('option',{name:'Sidebar',exact:true}).click();assert.equal(await note.inputValue(),'Retained example');
  }
  await page.waitForLoadState('networkidle');assert.deepEqual(errors,[]);
  await page.setViewportSize({width:390,height:800});
  assert(await page.locator('gramlot-border-container').first().isVisible());
  await page.close();console.log(`${engine} ${base}${route}: render, editing and layout interaction passed`);
 }}finally{await browser.close();}
}
