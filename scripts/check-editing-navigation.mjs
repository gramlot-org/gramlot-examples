import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {galleryRow} from './gallery-navigation.mjs';
const origin=process.env.GALLERY_URL || 'http://127.0.0.1:61509';
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/');
 await page.locator('#gallery-navigation-tree').waitFor({state:'visible'});
 await (await galleryRow(page,'grid-10')).click();
 await page.frameLocator('#frame-grid-10').locator('#grid-editing-demo tbody tr').first().waitFor();
 assert.deepEqual(errors,[]);
 console.log('Gallery index → Grid → Editing lesson passed');
} finally {await browser.close();}
