import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
if (!process.argv[2]) throw new Error('Pass the gallery URL');
for (const engine of [chromium, webkit]) {
 const browser=await engine.launch({headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}); const errors=[], calls=[];
 page.on('pageerror', e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('console',m.text())});
 page.on('request',r=>{if(r.method()==='POST')calls.push(r.postData()||'')});
 await page.goto(process.argv[2]);
 await page.waitForFunction(()=>window.gramlot?.state==='started');
 const tree=page.locator('#gallery-navigation-tree'); await tree.locator('[data-path="components"]').waitFor();
 assert.equal(calls.filter(x=>x.includes('navigation_section')).length,0);
 assert.equal(await tree.locator('[data-path="components.09-tree.w26"]').count(),0);
 await tree.locator('[data-path="components"]').locator(':scope > .row > button').click();
 await tree.locator('[data-path="components.09-tree"] > .row > button').click();
 await tree.locator('[data-path="components.09-tree.w26"]').waitFor();
 assert.equal(calls.filter(x=>x.includes('navigation_section')).length,2);
 await tree.locator('[data-path="components.09-tree.w26"] > .row').click();
 const frame=page.frameLocator('#frame-w26');await frame.locator('#example-tree').waitFor();
 await frame.locator('#tree-select-notes').click();
 await frame.locator('#tree-selected-path').filter({hasText:'documents.notes'}).waitFor();
 await frame.locator('#tree-rename').click();
 await frame.locator('[data-path="documents.notes"] .caption').filter({hasText:'Meeting notes'}).waitFor();
 await frame.locator('#example-tree [data-path="catalog"] button').click();
 await frame.locator('#example-tree [data-path="catalog.books"]').waitFor();
 assert.equal(calls.filter(x=>x.includes('catalog_children')).length,2);
 await tree.locator('[data-path="components"] > .row button').click();
 await tree.locator('[data-path="components"] > .row button').click();
 assert.equal(calls.filter(x=>x.includes('navigation_section')).length,2);
 await tree.locator('[data-path="components.01-text"] > .row button').click();
 await tree.locator('[data-path="components.01-text.w01"] > .row').click();
 await page.frameLocator('#frame-w01').locator('#customer input').waitFor();
 await page.locator('#index-pages').getByRole('tab',{name:'Bag tree',exact:true}).click();
 await page.waitForFunction(()=>gramlot.data.getItem('galleryIndex.navigationSelection')==='components.09-tree.w26');
 await frame.locator('#tree-selected-path').filter({hasText:'documents.notes'}).waitFor();
 await tree.locator('[data-path="layout"] > .row button').click();
 await tree.locator('[data-path="layout.01-border"]').waitFor();
 assert.equal(await tree.locator('[data-path="components"]').getAttribute('aria-expanded'),'false');
 assert.equal(await tree.locator('[data-path="layout"]').getAttribute('aria-expanded'),'true');
 // Switch away and back so the external selectedPath actually changes.
 await page.locator('#index-pages').getByRole('tab',{name:'Introduction',exact:true}).click();
 await page.locator('#index-pages').getByRole('tab',{name:'Bag tree',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#gallery-navigation-tree').shadowRoot.querySelector('[data-path="components"]').getAttribute('aria-expanded')==='true');
 assert.equal(await tree.locator('[data-path="layout"]').getAttribute('aria-expanded'),'false');
 assert.equal(calls.filter(x=>x.includes('navigation_section')).length,4);
 await page.screenshot({path:`/tmp/gramlot-gallery-tree-${engine.name()}.png`});
 await page.setViewportSize({width:390,height:844}); await page.locator('#gallery-mobile-menu').click();
 await tree.locator('[data-path="components.09-tree.w26"] > .row').click();
 await page.waitForFunction(()=>document.querySelector('#gallery-mobile-menu').getAttribute('aria-expanded')==='false');
 await page.screenshot({path:`/tmp/gramlot-gallery-tree-mobile-${engine.name()}.png`});
 assert.deepEqual(errors,[]);console.log('PASS',engine.name(),'auto-collapse siblings and external tab reveal, lazy sections, cached reopen, lazy example, two-way selection, live caption, retained tab state, mobile selection');
 } catch(error){console.error('FAIL',engine.name(),error);throw error;}finally{await browser.close();}
}
