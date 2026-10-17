import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, base = 'http://127.0.0.1:8205/'] = process.argv.slice(2);
const {chromium,webkit} = await import(pathToFileURL(entry));
for (const [name, engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1000,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base + 'w25');
  const field=id=>page.locator('#'+id+' #control');
  const data=path=>page.evaluate(p=>window.gramlot.data.getItem('profile.'+p),path);
  const edit=async(id,value)=>{await field(id).focus();await field(id).fill(value);await field(id).press('Tab');};
  await field('code').waitFor();
  assert.equal(await page.locator('#validation-group #validation-fields').count(),1);
  await page.screenshot({path:'/tmp/gramlot-validation-playground-'+name+'.png',fullPage:true});
  await edit('full-name','');assert.equal(await data('full_name'),'Ada Lovelace');
  assert.equal(await field('full-name').getAttribute('aria-invalid'),'true');
  await edit('full-name','Grace');assert.equal(await data('full_name'),'Grace');
  await edit('notes','x'.repeat(41));assert.equal(await data('notes'),'Please ring the bell.');
  await edit('notes','Short note');assert.equal(await data('notes'),'Short note');
  const appointment = await data('appointment');
  await edit('appointment','');assert.deepEqual(await data('appointment'),appointment);
  assert.equal(await field('appointment').getAttribute('aria-invalid'),'true');
  await edit('delivery','');assert.equal(await data('delivery'),'standard');
  assert.equal(await field('delivery').getAttribute('aria-invalid'),'true');
  await edit('code','abc');assert.equal(await data('code'),'ABC');assert.equal(await field('code').inputValue(),'ABC');
  const height=(await page.locator('#code').boundingBox()).height;
  await edit('code','123');assert.equal(await data('code'),'ABC');assert.equal(await field('code').inputValue(),'123');
  assert.equal(await field('code').getAttribute('aria-invalid'),'true');assert.equal((await page.locator('#code').boundingBox()).height,height);
  await edit('fallback','');assert.equal(await data('fallback'),'Guest');
  await edit('email','broken');assert.equal(await data('email'),'broken');assert.equal(await field('email').getAttribute('aria-invalid'),'false');
  await field('strict').check();await edit('email','stillbroken');assert.equal(await data('email'),'broken');assert.equal(await field('email').getAttribute('aria-invalid'),'true');
  await edit('quantity','11');assert.equal(await data('quantity'),2);
  await edit('nickname','admin');assert.equal(await data('nickname'),'Ada');assert.match(await data('validation_status'),/Rejected/);
  await edit('nickname','Eve');assert.equal(await data('nickname'),'Eve');assert.equal(await data('validation_status'),'Accepted: Eve');
  await edit('remote-name','taken');await page.waitForFunction(()=>document.getElementById('remote-name').control.getAttribute('aria-busy')==='false');
  assert.equal(await data('remote_name'),'AVAILABLE');assert.match(await page.locator('#remote-name #field-message').textContent(),/reserved/);
  await edit('remote-name','newname');await page.waitForFunction(()=>window.gramlot.data.getItem('profile.remote_name')==='NEWNAME');
  assert.equal(await field('remote-name').inputValue(),'NEWNAME');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'/tmp/gramlot-validation-'+name+'.png',fullPage:true});
  console.log(name+': validation gallery, local rules, warnings, notifications and actual endpoint RPC passed');
 } finally {await browser.close();}
}
