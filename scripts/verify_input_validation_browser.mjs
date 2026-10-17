import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...urls]=process.argv.slice(2);
const {chromium,webkit}=await import(pathToFileURL(entry));
for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try {for(const base of urls) {
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'w18'+(base.startsWith('file:')?'/index.html':''));
  const input=page.locator('#name input'),message=page.locator('#name #field-message');
  await input.waitFor();
  for(const attr of ['autocomplete','autocorrect','autocapitalize']) assert.equal(await input.getAttribute(attr),'off');
  assert.equal(await input.getAttribute('spellcheck'),'false');
  assert.equal(await message.evaluate(el=>getComputedStyle(el).transitionDuration),'0.2s');await page.evaluate(()=>document.fonts.ready);const layout=await page.locator('#name-copy').boundingBox();
  const fieldHeight=(await page.locator('#name').boundingBox()).height;
  const read=path=>page.evaluate(path=>window.gramlot.data.getItem(path),path);
  await input.fill('A');assert.equal(await read('name'),'Ada');await input.press('Tab');
  assert.equal(await read('name'),'Ada');assert.equal(await input.inputValue(),'A');assert.equal(await message.isVisible(),true);
  assert.equal(await message.textContent(),'Use between 2 and 8 characters.');
  assert.equal((await page.locator('#name-copy').boundingBox()).y,layout.y);
  assert.equal((await page.locator('#name').boundingBox()).height,fieldHeight);
  assert.equal(await input.evaluate(el=>getComputedStyle(el).backgroundColor),await input.evaluate(el=>{const probe=document.createElement('span');probe.style.color='var(--gramlot-error-background)';document.body.append(probe);const color=getComputedStyle(probe).color;probe.remove();return color;}));
  assert.equal(await message.evaluate(el=>el.matches(':popover-open')),true);
  await page.waitForTimeout(2200);assert.equal(await message.isVisible(),false);
  assert.equal(await input.getAttribute('aria-invalid'),'true');assert.equal(await read('name'),'Ada');
  await input.hover();assert.equal(await message.isVisible(),true);
  await input.focus();await input.press('Escape');assert.equal(await message.isVisible(),false);
  await input.press('Tab');await input.focus();assert.equal(await message.isVisible(),true);
  await page.screenshot({path:`/tmp/gramlot-floating-${name}-${base.startsWith('file:')?'file':new URL(base).port}.png`});
  await input.fill('Far too long');await input.press('Tab');assert.equal(await input.inputValue(),'Far too long');assert.equal(await read('name'),'Ada');
  await input.fill('Grace');await input.press('Tab');assert.equal(await read('name'),'Grace');assert.equal(await message.isVisible(),false);
  assert.equal(await page.locator('#name-copy input').inputValue(),'Grace');
  await input.fill('');await input.press('Tab');assert.equal(await read('name'),'Grace');assert.equal(await message.textContent(),'Please enter a name.');
  await page.locator('#live input').check();assert.equal(await input.inputValue(),'');
  await input.fill('B');assert.equal(await read('name'),'Grace');await input.fill('Bob');assert.equal(await read('name'),'Bob');
  const notes=page.locator('#notes textarea');await notes.fill('A note that is much longer than twenty characters');assert.equal(await read('notes'),'Hello');
  await notes.fill('');assert.equal(await read('notes'),'');
  const quantity=page.locator('#quantity input');await quantity.fill('');await quantity.press('Tab');assert.equal(await read('quantity'),0);
  assert.equal(await page.locator('#quantity #field-message').isVisible(),true);
  await quantity.fill('5');await quantity.press('Enter');assert.equal(await read('quantity'),5);
  await input.fill('X');await page.screenshot({path:`/tmp/gramlot-validation-${name}-${base.startsWith('file:')?'file':new URL(base).port}.png`});
  await page.setViewportSize({width:360,height:800});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);console.log(`PASS ${name} ${base}: invalid drafts/Data separation, required/length, recovery, live, optional empty, typed zero, floating tooltip/no layout shift, timeout/reopen, compact layout`);
  await page.close();
 }}finally{await browser.close();}
}
