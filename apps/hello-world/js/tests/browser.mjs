import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const [node,bun,playwright,executablePath]=process.argv.slice(2);
if(!executablePath)throw Error('Usage: node js/tests/browser.mjs NODE BUN PLAYWRIGHT_ENTRY CHROMIUM');
const {chromium}=await import(pathToFileURL(playwright));
const browser=await chromium.launch({headless:true,executablePath});
try {
 for(const [engine,runtime] of [['nodejs',node],['bun',bun]]) {
  const child=spawn(runtime,[fileURLToPath(new URL(`../server/${engine}/start.js`,import.meta.url))],{env:{...process.env,PORT:'0'},stdio:['ignore','pipe','inherit']});
  try {
   const url=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('startup timeout')),10000);createInterface({input:child.stdout}).once('line',line=>{clearTimeout(timer);resolve(line);});child.once('exit',code=>{clearTimeout(timer);reject(Error(`exit ${code}`));});});
   const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(url);await page.waitForFunction(()=>window.gramlot?.state==='started');
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('h1').textContent(),'Hello World');
   const state=await page.evaluate(()=>{const app=window.gramlot;const typed=app.source.getItem('main').constructor.tytxSuffix;app.dispose();return {typed,records:app.renderer.records.size,children:document.getElementById('gramlot-root').childNodes.length};});
   assert.deepEqual(state,{typed:'SOURCE',records:0,children:0});assert.deepEqual(errors,[]);await page.close();console.log('PASS installed Hello World '+engine);
  }finally{child.kill();await new Promise(r=>child.exitCode!==null?r():child.once('exit',r));}
 }
}finally{await browser.close();}
