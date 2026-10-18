import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,...bases]=process.argv.slice(2);
if(!entry||!bases.length) throw new Error('Usage: verify_rounded_border_browser.mjs PLAYWRIGHT_ENTRY LAYOUT_FOLDER_URL...');
const {chromium,webkit}=await import(pathToFileURL(entry));
for(const [engine,type] of Object.entries({chromium,webkit})){
 const b=await type.launch();
 try{for(const base of bases){
 const p=await b.newPage({viewport:{width:1100,height:950}});p.setDefaultTimeout(12000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(new URL(base.startsWith('file:')?'l03/index.html':'03_rounded',base).href);await p.locator('#rounded-name input').waitFor();
 await p.evaluate(()=>window.roundedNodes=[document.querySelector('#rounded-border'),document.querySelector('#rounded-inner')]);
 const slider=p.locator('#rounded-slider input');
 for(const [key,value] of [['End',48],['Home',0]]){
  await slider.focus();await slider.press(key);
  assert.equal(await p.evaluate(()=>gramlot.data.getItem('rounded')),value);
  for(const id of ['rounded-border','rounded-inner'])assert.equal(await p.locator('#'+id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),`${value}px`);
 }
 await p.evaluate(()=>gramlot.data.setItem('rounded',24));
 assert(await p.evaluate(()=>roundedNodes[0]===document.querySelector('#rounded-border')&&roundedNodes[1]===document.querySelector('#rounded-inner')));
 for(const design of ['headline','sidebar']){
 await p.locator('#rounded-design .toggle').click();
 const controlBox=await p.locator('#rounded-design input').boundingBox(), menuBox=await p.locator('#rounded-design .choices').boundingBox();
 assert(Math.abs(menuBox.width-controlBox.width+4)<1);
 const focus=await p.locator('#rounded-design input').evaluate(el=>({outline:getComputedStyle(el).outlineColor,border:getComputedStyle(el).borderTopColor,offset:getComputedStyle(el).outlineOffset}));
 assert.equal(focus.outline,focus.border);assert.equal(focus.offset,'-3px');
 await p.getByRole('option',{name:design==='headline'?'Headline':'Sidebar',exact:true}).click();
 for(const id of ['rounded-border','rounded-inner'])assert(await p.locator('#'+id).evaluate(el=>{const r=el.getBoundingClientRect();return [[1,1],[r.width-1,1],[1,r.height-1],[r.width-1,r.height-1]].every(([x,y])=>!el.contains(document.elementFromPoint(r.x+x,r.y+y)));}),`${engine} ${id} corner clipped`);
 for(const side of ['left','right','top','bottom']){
 const handle=p.locator('#rounded-border').locator(`.separator[data-side=${side}]`).first();
 const box=await handle.boundingBox(),vertical=['left','right'].includes(side),axis=vertical?'width':'height';
 const before=await p.locator('#rounded-'+side).boundingBox();
 const x=vertical?box.x+box.width/2:box.x+30,y=vertical?box.y+30:box.y+box.height/2;
 await p.mouse.move(x,y);await p.mouse.down();const sign=['top','left'].includes(side)?1:-1;
 await p.mouse.move(x+(vertical?12*sign:0),y+(vertical?0:12*sign));
 assert((await p.locator('#rounded-'+side).boundingBox())[axis]>before[axis]+8);await p.mouse.up();
 await handle.locator('button').click();await handle.locator('button').click();
 }
 }
 await p.locator('#rounded-date .calendar-toggle').click();const pop=p.locator('#rounded-date .calendar-popup');await pop.waitFor({state:'visible'});
 const inner=await p.locator('#rounded-inner').boundingBox(),pb=await pop.boundingBox();assert(pb.y<inner.y||pb.y+pb.height>inner.y+inner.height,'calendar extends beyond the rounded inner outline');
 await p.screenshot({path:`/tmp/rounded-${engine}-${new URL(base).port||'serverless'}-calendar.png`});
 const buttons=pop.locator('button');let picked=false;
 for(let i=0;i<await buttons.count();i++){const r=await buttons.nth(i).boundingBox();if(r&&(r.y+r.height/2>inner.y+inner.height||r.y+r.height/2<inner.y)){await buttons.nth(i).click();picked=true;break;}}
 assert(picked,'calendar has a clickable control beyond inner outline');await p.keyboard.press('Escape');
 await p.locator('#rounded-choice .toggle').click();await p.getByRole('option',{name:'Weekend',exact:true}).click();
 assert.equal(await p.evaluate(()=>gramlot.data.getItem('choice')),'weekend');
 await p.locator('#rounded-name input').fill('X');await p.locator('#rounded-name input').press('Tab');assert.equal(await p.evaluate(()=>gramlot.data.getItem('name')),'Ada');
 assert(await p.locator('#rounded-name #field-message').evaluate(el=>el.matches(':popover-open')),'validation message is in the top layer');
 for(const side of ['top','bottom','left','right'])await p.locator('#rounded-border').locator(`.separator[data-side=${side}]`).first().locator('button').click();
 await p.setViewportSize({width:390,height:850});await p.locator('#rounded-name input').waitFor({state:'visible'});assert.equal(await p.locator('#rounded-name input').inputValue(),'X');
 for(const side of ['top','bottom','left','right']){const drawer=p.locator('#rounded-border').locator(`.separator[data-side=${side}]`).first().locator('button');await drawer.click();await drawer.click();}
 await p.screenshot({path:`/tmp/rounded-${engine}-${new URL(base).port||'serverless'}-mobile.png`});assert.deepEqual(errors,[]);await p.close();console.log(`${engine}/${new URL(base).port||'serverless'} passed`);
 }}finally{await b.close();}
}
