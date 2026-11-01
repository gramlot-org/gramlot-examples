import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [playwrightEntry,baseUrl]=process.argv.slice(2);
if (!playwrightEntry || !baseUrl) throw new Error('Expected Playwright module and gallery base URL');
const {webkit}=await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
const b=await webkit.launch({headless:true});try{const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(`${baseUrl.replace(/\/$/,'')}/pages/07-tools/02-advanced/04-editable_image`);const target=p.locator('#local-image');await target.getByRole('button',{name:'Take photo'}).click();await target.locator('[role=status]').getByText('Camera permission was denied').waitFor();assert.equal(await p.locator('dialog').count(),0);assert.deepEqual(errors,[]);console.log('PASS WebKit: unavailable permission closes dialog and reports denial');}finally{await b.close()}
