import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [playwrightEntry, ...urls] = process.argv.slice(2);
if (!playwrightEntry || !urls.length) throw new Error('Usage: verify_components_browser.mjs PLAYWRIGHT_ENTRY URL...');
const {chromium, webkit} = await import(pathToFileURL(playwrightEntry));
for (const [name, engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await engine.launch({headless:true});
 try { for (const base of urls) {
  const page=await browser.newPage({viewport:{width:1280,height:900}}); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const route = key => base.startsWith('file:') ? base+key+'/index.html' : base+key;
  await page.goto(route('w01')); await page.locator('#customer input').waitFor();
  await page.locator('#customer input').fill('Grace');
  await page.waitForFunction(()=>window.gramlot.data.getItem('customer')==='Grace');
  assert.equal(await page.locator('#customer-copy input').inputValue(),'Grace');
  await page.locator('#position').selectOption('R');
  assert.equal(await page.locator('#customer .labelbox').getAttribute('data-position'),'R');
  await page.goto(route('w02')); await page.locator('#newsletter input').check();
  await page.waitForFunction(()=>window.gramlot.data.getItem('newsletter')===true);
  assert.equal(await page.locator('#newsletter-copy input').isChecked(),true);
  await page.goto(route('w03')); await page.locator('#shipping input[value="express"]').check();
  await page.waitForFunction(()=>window.gramlot.data.getItem('shipping')==='express');
  assert.equal(await page.locator('#alternative input[value="pickup"]').isChecked(),true);
  const range=page.locator('#columns');
  await range.scrollIntoViewIfNeeded();
  const bounds=await range.boundingBox(), y=bounds.y+bounds.height/2;
  await page.mouse.move(bounds.x+bounds.width-8,y);await page.mouse.down();
  await page.mouse.move(bounds.x+8,y,{steps:16});await page.mouse.up();
  assert.equal(await range.inputValue(),'1');
  assert.equal(await page.locator('#columns-value').textContent(),'1');
  assert.equal((await range.boundingBox()).y,bounds.y,'changing columns must not move the slider');
  await page.mouse.move(bounds.x+8,y);await page.mouse.down();
  await page.mouse.move(bounds.x+bounds.width-8,y,{steps:16});await page.mouse.up();
  assert.equal(await range.inputValue(),'3');
  assert.equal(await page.locator('#columns-value').textContent(),'3');
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('columns')),3);
  assert.equal((await range.boundingBox()).y,bounds.y);
  await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'BC');
  assert.equal(await page.locator('#shipping .labelbox').getAttribute('data-position'),'BC');
  await page.screenshot({path:`/tmp/gramlot-components-gallery-${name}-${base.startsWith('file:')?'static':new URL(base).port}.png`});

  for (const [key, id, tag, field, next] of [
   ['w04','notes','textarea','notes','Three\nnew lines'],
   ['w05','secret','input','secret','new-sample']]) {
   await page.goto(route(key)); const input=page.locator(`#${id} ${tag}`);
   await input.fill(next);
   assert.equal(await page.locator(`#${id}-copy ${tag}`).inputValue(),next);
   await page.locator('#live input').uncheck();
   await input.fill(next+'!');
   assert.equal(await page.evaluate(field=>window.gramlot.data.getItem(field),field),next);
   await input.press('Tab');
   assert.equal(await page.locator(`#${id}-copy ${tag}`).inputValue(),next+'!');
   await page.evaluate(position => { for (const [node] of window.gramlot.src.renderer.records) if (node.getAttr('lbl') != null) node.setAttr({lbl_position: position}); }, 'R');
   assert.equal(await page.locator(`#${id} .labelbox`).getAttribute('data-position'),'R');
   await page.locator('#locked input').check(); assert.equal(await input.isDisabled(),true);
   if(key==='w05') assert.equal(await input.getAttribute('type'),'password');
  }
  await page.goto(route('w06'));
  await page.locator('#express .caption').click();
  assert.deepEqual(await page.evaluate(()=>['standard','express','pickup'].map(k=>window.gramlot.data.getItem(k))),[false,true,false]);
  await page.locator('#independent input').check();
  await page.locator('#express input').focus(); await page.keyboard.press('ArrowDown');
  assert.deepEqual(await page.evaluate(()=>['standard','express','pickup','independent'].map(k=>window.gramlot.data.getItem(k))),[false,false,true,true]);
  await page.goto(route('w07'));
  const color=page.locator('#color input');
  await color.evaluate(input=>{input.value='#ff8800';input.dispatchEvent(new Event('input',{bubbles:true,composed:true}));});
  assert.equal(await page.locator('#color-copy input').inputValue(),'#ff8800');
  await page.locator('#live input').uncheck();
  await color.evaluate(input=>{input.value='#00aa55';input.dispatchEvent(new Event('input',{bubbles:true,composed:true}));});
  assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('color')),'#ff8800');
  await color.dispatchEvent('change');
  assert.equal(await page.locator('#color-copy input').inputValue(),'#00aa55');
  for(const key of ['w08','w09']) {
   await page.goto(route(key)); const slider=page.locator('#level input');
   await slider.scrollIntoViewIfNeeded(); const b=await slider.boundingBox();
   const vertical=key==='w09';
   assert.ok(vertical ? b.height>b.width*3 : b.width>b.height*3);
   const lo=vertical?[b.x+b.width/2,b.y+b.height-6]:[b.x+6,b.y+b.height/2];
   const hi=vertical?[b.x+b.width/2,b.y+6]:[b.x+b.width-6,b.y+b.height/2];
   await page.mouse.click(...lo);await page.mouse.move(...lo);await page.mouse.down();
   await page.mouse.move(...hi,{steps:20});await page.mouse.up();
   assert.equal(await slider.inputValue(),'100');
   assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('level')),100);
   assert.equal(await page.locator('#level-copy input').inputValue(),'100');
   await page.mouse.click(...lo); assert.equal(await slider.inputValue(),'0');
   await slider.press('ArrowUp'); assert.equal(await slider.inputValue(),'5');
   if (!vertical) { await slider.press('Home'); assert.equal(await slider.inputValue(),'0'); await slider.press('ArrowUp'); }
   await page.locator('#live input').uncheck();
   await slider.evaluate(input=>{input.value='25';input.dispatchEvent(new Event('input',{bubbles:true,composed:true}));});
   assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('level')),5);
   await slider.dispatchEvent('change');
   assert.equal(await page.locator('#level-copy input').inputValue(),'25');
   await page.locator('#locked input').check();assert.equal(await slider.isDisabled(),true);
  }
  await page.setViewportSize({width:360,height:800});
  for (const key of ['w04','w05','w06','w07','w08','w09']) {
   await page.goto(route(key)); await page.locator('main').first().waitFor();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${key}: no horizontal overflow`);
  }
  await page.setViewportSize({width:1280,height:900});
  await page.goto(base.startsWith('file:') ? base+'index.html':base);
  await page.getByText('Input components',{exact:true}).first().click();
  await page.getByRole('link',{name:'Textbox and labelbox',exact:true}).click();
  await page.frameLocator('#frame-w01').locator('#customer input').waitFor();
  assert.deepEqual(errors,[],`${name} ${base}`);
  console.log(`PASS ${name} ${base}: nine controls, live/commit, radio keys, slider dragging, compact layout and gallery frame`);
  await page.close();
 }} finally {await browser.close();}
}
