import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.GRAMLOT_PLAYWRIGHT_MODULE || 'playwright');
for(const engine of [chromium,webkit]) {
 const executablePath=engine===chromium?process.env.GRAMLOT_CHROMIUM_EXECUTABLE:process.env.GRAMLOT_WEBKIT_EXECUTABLE;
 const browser=await engine.launch(executablePath?{executablePath}:{});
 try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});page.setDefaultTimeout(10000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GRAMLOT_GALLERY_URL || 'http://127.0.0.1:8265/');
 await page.getByText('Controllers',{exact:true}).first().click();
 await page.getByRole('link',{name:'Plan your stay',exact:true}).click();
 const frame=page.frameLocator('#frame-c23');await frame.locator('#guests input').waitFor();
 await page.locator('#index-navigation-toggle').click();await page.locator('#index-code-toggle').click();
 // Presentation for the recording; no application Source, Data or behavior is altered.
 await frame.locator('body').evaluate(el=>{const s=el.ownerDocument.createElement('style');s.textContent='.estimate-page{margin-left:24px;margin-right:0;max-width:650px}';el.append(s)});
 await page.locator('#gallery-inspector').click();
 const inspector=page.locator('gramlot-tools-inspector');
 await inspector.getByRole('tab',{name:'Data',exact:true}).waitFor();
 const grip=inspector.getByLabel('Resize inspector: arrow keys');
 for(let i=0;i<13;i++)await grip.press('ArrowRight');for(let i=0;i<13;i++)await grip.press('ArrowDown');
 const bar=await inspector.locator('gramlot-poc-palette .bar').boundingBox();
 await page.mouse.move(bar.x+80,bar.y+12);await page.mouse.down();await page.mouse.move(880,35,{steps:20});await page.mouse.up();
 const dataTree=inspector.locator('gramlot-poc-tree[data-root=data]');
 await dataTree.locator('[data-node-path="estimate"]').click();
 await dataTree.locator('[data-node-path="estimate.total"]').click();
 assert.equal(await inspector.getByLabel('Value',{exact:true}).inputValue(),'270');
 const nights=frame.locator('#nights input');await nights.click();await nights.press('ControlOrMeta+A');await nights.pressSequentially('5');await nights.press('Tab');
 await inspector.getByLabel('Value',{exact:true}).evaluate(e=>e.blur());
 await page.waitForTimeout(150);
 assert.equal(await inspector.getByLabel('Value',{exact:true}).inputValue(),'450');
 const read=async(key,expected)=>{await dataTree.locator(`[data-node-path="estimate.${key}"]`).click();assert.equal(await inspector.getByLabel('Value',{exact:true}).inputValue(),String(expected))};
 await read('subtotal',450);await read('discount',0);await read('total',450);await read('deposit',135);
 await nights.click();await nights.press('ControlOrMeta+A');await nights.pressSequentially('7');await nights.press('Tab');
 await read('subtotal',630);await read('discount',63);await read('total',567);await read('deposit',170);
 await nights.click();await nights.press('ControlOrMeta+A');await nights.pressSequentially('5');await nights.press('Tab');
 await read('subtotal',450);await read('discount',0);await read('total',450);await read('deposit',135);
  assert.deepEqual(errors,[]);
 console.log(engine.name()+': real inspector Data follows subtotal, discount, total and deposit in both directions.');
 }finally{await browser.close()}
}
