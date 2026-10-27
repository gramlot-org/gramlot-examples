import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.GRAMLOT_PLAYWRIGHT_MODULE || 'playwright');
// Use only a disposable gallery copy: this test writes and restores its Python page.
const file=process.env.GRAMLOT_EDITABLE_PAGE;
assert.ok(file, 'GRAMLOT_EDITABLE_PAGE must name the disposable served Python page');
const baseline=await readFile(file,'utf8');
assert.ok(baseline.includes('nights >= 7'));
const changed=baseline.replace('nights >= 7','nights >= 5').replace('Seven nights: 10% off.','Five nights: 10% off.');
try {for(const engine of [chromium,webkit]) {
 await writeFile(file,baseline);await new Promise(r=>setTimeout(r,2500));const executablePath=engine===chromium?process.env.GRAMLOT_CHROMIUM_EXECUTABLE:process.env.GRAMLOT_WEBKIT_EXECUTABLE;const browser=await engine.launch(executablePath?{executablePath}:{});
 try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}});p.setDefaultTimeout(10000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GRAMLOT_GALLERY_URL || 'http://127.0.0.1:8266/');
 const choose=async()=>{const link=p.getByRole('link',{name:'Plan your stay',exact:true});if(!await link.isVisible())await p.getByText('Controllers',{exact:true}).first().click();await link.click();await p.frameLocator('#frame-c23').locator('#guests input').waitFor()};
 await choose();const f=p.frameLocator('#frame-c23');
 const five=async()=>{const n=f.locator('#nights input');await n.click();await n.press('ControlOrMeta+A');await n.pressSequentially('5');await n.press('Tab')};
 await five();assert.equal(await f.locator('#total').innerText(),'Stay total · €450');
 await writeFile(file,changed);await new Promise(r=>setTimeout(r,2500));await p.reload();await choose();
 assert.equal(await f.locator('#nights input').inputValue(),'3');
 await five();await p.locator('#gallery-inspector').click();
 const ins=p.locator('gramlot-tools-inspector');const tree=ins.locator('gramlot-poc-tree[data-root=data]');
 await tree.locator('[data-node-path="estimate"]').click();
 for(const [key,value] of Object.entries({subtotal:450,discount:45,total:405,deposit:122})){
  await tree.locator(`[data-node-path="estimate.${key}"]`).click();
  assert.equal(await ins.getByLabel('Value',{exact:true}).inputValue(),String(value));
 }
 assert.equal(await f.locator('#total').innerText(),'Stay total · €405');
 assert.equal(await f.locator('#deposit').innerText(),'30% deposit · €122');
 assert.deepEqual(errors,[]);console.log(engine.name()+': actual Python file edit + browser reload; reset to defaults; same five-night input; inspector 450 → 45 → 405 → 122 passed.');
 }finally{await browser.close()}
}}finally{await writeFile(file,baseline)}
