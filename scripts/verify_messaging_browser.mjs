/** Verify the c18/c19 lessons on actual hosted or directory-export galleries. */
import {pathToFileURL} from 'node:url';
const [entry, ...urls] = process.argv.slice(2);
if (!entry || !urls.length) throw new Error('Usage: node scripts/verify_messaging_browser.mjs PLAYWRIGHT_ENTRY GALLERY_URL ...');
const {chromium, webkit} = await import(pathToFileURL(entry));
import assert from 'node:assert/strict';
import {verifyExample} from './verify_pages_browser.mjs';
for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await type.launch();
 try {
 for(const base of urls) {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=key=>base+key+(base.startsWith('file:')?'/index.html':'');
  for (const key of ['c18', 'c19']) {
   await page.goto(url(key));
   await page.waitForFunction(() => window.gramlot?.state === 'started');
   await verifyExample(page, key);
  }
  assert.deepEqual(errors,[]);console.log('PASS',engine,base,'c18 c19');await page.close();
 }
 }finally{await browser.close();}
}
