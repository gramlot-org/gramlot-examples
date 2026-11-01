import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [playwrightEntry,baseUrl]=process.argv.slice(2);
if (!playwrightEntry || !baseUrl) throw new Error('Expected Playwright module and gallery base URL');
const {chromium}=await import(pathToFileURL(resolve(playwrightEntry)));
import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true});try {const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>{let canvas,ctx;window.displayTracks=[];window.displayActivation=[];window.denyDisplay=false;
Object.defineProperty(navigator.mediaDevices,'getDisplayMedia',{configurable:true,value:()=>{window.displayActivation.push(navigator.userActivation.isActive);if(window.denyDisplay)return Promise.reject(new DOMException('Not allowed','NotAllowedError'));
canvas=document.createElement('canvas');canvas.width=128;canvas.height=64;ctx=canvas.getContext('2d');const stream=canvas.captureStream(10);let color=false;const timer=setInterval(()=>{ctx.fillStyle=(color=!color)?'#28a':'#a82';ctx.fillRect(0,0,128,64);if(stream.getTracks().every(t=>t.readyState==='ended'))clearInterval(timer);},50);window.displayTracks.push(...stream.getTracks());return Promise.resolve(stream);}});});
await p.goto(`${baseUrl.replace(/\/$/,'')}/pages/07-tools/02-advanced/04-editable_image`);
for(const id of ['local-image','server-image']){
 const target=p.locator(`#${id}`);await target.getByRole('button',{name:'Capture screen'}).click();
 const dialog=p.getByRole('dialog',{name:'Edit image'});await dialog.waitFor();
 assert.equal(await p.evaluate(()=>window.displayTracks.at(-1).readyState),'ended');
 await dialog.getByRole('button',{name:'Confirm'}).click();await target.locator('img').waitFor({state:'visible'});
 console.log(`PASS ASGI: screen frame and ${id} destination`);
}
assert.deepEqual(await p.evaluate(()=>window.displayActivation),[true,true]);
const before=await p.evaluate(()=>window.gramlot.data.getItem('imageDemo.localImage'));await p.evaluate(()=>window.denyDisplay=true);
await p.locator('#local-image').getByRole('button',{name:'Capture screen'}).click();await p.locator('#local-image [role=status]').getByText('Screen capture was cancelled or not permitted').waitFor();
assert.equal(await p.evaluate(()=>window.gramlot.data.getItem('imageDemo.localImage')),before);assert.deepEqual(errors,[]);console.log('PASS ASGI: chooser denial preserves the previous image');
}finally{await b.close()}
