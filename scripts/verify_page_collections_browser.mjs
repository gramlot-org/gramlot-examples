import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.argv[2];
for(const engine of [chromium,webkit]) {
 const browser=await engine.launch();
 try {
  const context=await browser.newContext();const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const cases=[
   ['04-rpc/02-remote_data/01-remote','#record',[]],
   ['01-inputs/09-tree/01-basics','gramlot-tree',['inputs','tree']],
   ['06-editors/02-options','.cm-editor',['inputs','layout','editors']],
   ['06-editors/05-typst','gramlot-typst-preview',['layout','editors','typst']]
  ];
  for(const [route,selector,names] of cases) {
   const response=await page.goto(new URL('pages/'+route,base).href);
   const html=await response.text();
   const config=JSON.parse(html.match(/new PageBootstrap\((.*)\)\.run/)[1]);
   assert.deepEqual(config.resources.collections.map(c=>c.name),names);
   await page.waitForFunction(()=>window.gramlot?.state==='started');
   await page.locator(selector).first().waitFor();
   if(route.includes('/01-remote')) {
    await page.locator('#record').selectOption('desk');
    await page.locator('#stock').filter({hasText:'0 in stock'}).waitFor();
   }
   if(route.includes('/05-typst')) await page.getByRole('img',{name:'Typst document preview'}).waitFor({timeout:60000});
   if(route.includes('/02-options')) await page.locator('.cm-content').first().fill('print("still editable")');
   console.log(engine.name(),route,'page-local bootstrap and rendering passed');
  }
  assert.deepEqual(errors,[]);
  await context.close();
 }finally{await browser.close();}
}
