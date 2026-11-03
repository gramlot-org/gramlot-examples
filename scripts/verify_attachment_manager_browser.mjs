import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [playwrightEntry, baseUrl, engineName='chromium'] = process.argv.slice(2);
if (!playwrightEntry || !baseUrl) throw new Error('Expected Playwright module and gallery base URL');
const engines = await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
const b=await engines[engineName].launch({headless:true});try {const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await p.goto(`${baseUrl.replace(/\/$/,'')}/pages/01-uploader/03-attachment_manager`);const manager=p.locator('#attachment-manager'),u=manager.locator('gramlot-uploader');await u.waitFor();
await u.locator('input[type=file]').setInputFiles([{name:'first.txt',mimeType:'text/plain',buffer:Buffer.from('one')},{name:'second.txt',mimeType:'text/plain',buffer:Buffer.from('two')}]);
await p.waitForFunction(()=>globalThis.gramlot.data.getItem('attachmentsDemo.queue').getNodes().length===2);assert.equal(await u.locator('li').filter({hasText:'queued'}).count(),2);
await p.getByRole('button',{name:'Save record'}).click();await p.waitForFunction(()=>globalThis.gramlot.data.getItem('attachmentsDemo.queue').getNodes().filter(n=>n.value.getItem('status')==='completed').length===2);
await manager.getByRole('button',{name:'first.txt',exact:true}).click();await manager.locator('.preview pre').getByText('one',{exact:true}).waitFor();
await manager.getByRole('button',{name:'Remove attachment'}).click();await manager.getByRole('button',{name:'first.txt',exact:true}).waitFor({state:'detached'});
await u.locator('input[type=file]').setInputFiles({name:'later.txt',mimeType:'text/plain',buffer:Buffer.from('three')});await manager.getByRole('button',{name:'later.txt',exact:true}).waitFor();
assert.deepEqual(errors,[]);console.log('PASS ASGI: reusable manager queues, uploads, lists, previews, removes and uploads again');
}finally{await b.close()}
