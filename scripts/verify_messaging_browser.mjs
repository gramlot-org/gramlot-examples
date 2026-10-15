/** Verify the c18/c19 lessons on actual hosted or directory-export galleries. */
import {pathToFileURL} from 'node:url';
const [entry, ...urls] = process.argv.slice(2);
if (!entry || !urls.length) throw new Error('Usage: node scripts/verify_messaging_browser.mjs PLAYWRIGHT_ENTRY GALLERY_URL ...');
const {chromium, webkit} = await import(pathToFileURL(entry));
import assert from 'node:assert/strict';
for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await type.launch();
 try {
 for(const base of urls) {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=key=>base+key+(base.startsWith('file:')?'/index.html':'');
  await page.goto(url('c18')); await page.waitForFunction(()=>window.gramlot?.state==='started');
  await page.locator('#message').fill('One');await page.locator('#direct').click();assert.match(await page.locator('#summary').textContent(),/One \(click\)/);
  await page.locator('#publish').click();assert.match(await page.locator('#summary').textContent(),/One \(saved\)/);
  await page.locator('#send-left').click();assert.equal(await page.locator('#received-left').textContent(),'Hello left');assert.equal(await page.locator('#received-right').textContent(),'');
  await page.locator('#ask').click();await page.locator('dialog input').fill('Two');await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#summary').textContent==='Two (saved)');
  await page.locator('#ask').click();await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('#summary').textContent(),'Two (saved)');
  await page.goto(url('c19'));await page.waitForFunction(()=>window.gramlot?.state==='started');
  const child=await (await page.locator('#detail').elementHandle()).contentFrame();await child.waitForFunction(()=>window.gramlot?.state==='started');
  await page.locator('#message').fill('Parent');await page.locator('#send-child').click();await child.waitForFunction(()=>document.querySelector('#received').textContent==='Parent');
  assert.equal(await page.locator('#received').textContent(),'Parent');
  await child.locator('#message').fill('Child');await child.locator('#reply').click();await page.waitForFunction(()=>document.querySelector('#received').textContent==='Child');
  assert.deepEqual(errors,[]);console.log('PASS',engine,base,'c18 c19');await page.close();
 }
 }finally{await browser.close();}
}
