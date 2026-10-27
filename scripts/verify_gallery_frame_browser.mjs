import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
if (!process.argv[2]) throw new Error('Usage: node scripts/verify_gallery_frame_browser.mjs <gallery-url> [...]');
for(const url of process.argv.slice(2))for(const engine of [chromium,webkit]){
 const browser=await engine.launch();const page=await browser.newPage({viewport:{width:1440,height:950}});page.setDefaultTimeout(12000);
 const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 page.on('request',r=>{if(r.method()==='POST')requests.push(r.postData())});
 try{
 await page.goto(url);const tree=page.locator('#gallery-navigation-tree');await tree.locator('[data-path="html_svg"]').waitFor();
 await page.waitForFunction(()=>!!document.querySelector('#gallery-navigation-tree').shadowRoot.querySelector('[data-path="html_svg"] button'));
 assert.deepEqual(errors,[]);
 assert.equal(requests.filter(x=>x.includes('navigation_section')).length,0);
 assert.equal(await page.locator('#index-navigation-toggle,#index-code-toggle,#gallery-mobile-menu').count(),0);
 const regions=page.locator('#gallery-regions');
 await page.locator('#gallery-settings-button button').click();await page.locator('#index-theme input').fill('Dark'); await page.locator('#index-theme').getByRole('option',{name:'Dark',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.locator('#index-theme input').fill('Light'); await page.locator('#index-theme').getByRole('option',{name:'Light',exact:true}).click();
 await page.locator('#gallery-settings-button button').click();
 await tree.locator('[data-path="html_svg"] > .row > button').click();
 await tree.locator('[data-path="html_svg.06-nested"]').waitFor();
 assert.equal(requests.filter(x=>x.includes('navigation_section')).length,1);
 await tree.locator('[data-path="html_svg.06-nested"] > .row').click();
 await page.frameLocator('iframe[src="pages/00-html_svg/06-nested/00-index"]').getByRole('heading',{name:'Nested directory'}).waitFor();
 assert.equal(requests.filter(x=>x.includes('navigation_section')).length,1);
 await tree.locator('[data-path="html_svg.06-nested"] > .row > button').click();
 await tree.locator('[data-path="html_svg.06-nested.01-child"]').waitFor();
 assert.equal(requests.filter(x=>x.includes('navigation_section')).length,2);
 await tree.locator('[data-path="html_svg.06-nested.01-child"] > .row').click();
 await page.frameLocator('iframe[src="pages/00-html_svg/06-nested/01-child"]').getByRole('heading',{name:'Nested child page'}).waitFor();
 await tree.locator('[data-path="components"] > .row > button').click();
 await tree.locator('[data-path="components.09-tree"] > .row > button').click();
 await tree.locator('[data-path="components.09-tree.w26"]').waitFor();
 assert.equal(await tree.locator('[data-path="html_svg"]').getAttribute('aria-expanded'),'false');
 await tree.locator('[data-path="components.09-tree.w26"] > .row').click();
 const frame=page.frameLocator('#frame-w26');await frame.locator('#example-tree').waitFor();
 await frame.locator('#tree-select-notes').click();
 await page.locator('#code-w26').waitFor();
 await regions.locator('[data-side="right"] .drawer').click();
 await page.locator('#gallery-inspector').click();await page.locator('gramlot-tools-inspector gramlot-poc-palette').waitFor();await page.locator('#gallery-inspector').click();
 await page.locator('#index-pages').getByRole('tab',{name:'Nested directory',exact:true}).click();
 await page.locator('#index-pages').getByRole('tab',{name:'Bag tree',exact:true}).click();
 await frame.locator('#tree-selected-path').filter({hasText:'documents.notes'}).waitFor();
 await page.screenshot({path:`/tmp/frame-gallery-${engine.name()}.png`});
 await page.setViewportSize({width:390,height:844});
 await page.locator('#gallery-navigation-button button').click();await tree.waitFor({state:'visible'});
 await tree.locator('[data-path="components.09-tree.w26"] > .row').click();
 await frame.locator('#example-tree').waitFor({state:'visible'});
 assert.deepEqual(errors,[]);console.log('PASS',url,engine.name(),'frame hooks, URL tabs, nested resolvers/index pages, gallery code/inspector/settings, mobile drawers');
 }catch(error){console.log('ERRORS',errors);await page.screenshot({path:'/tmp/frame-gallery-failure.png'});throw error;}finally{await browser.close();}
}
