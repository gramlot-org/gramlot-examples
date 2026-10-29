import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
import {galleryRow} from './gallery-navigation.mjs';
const origin=process.env.GALLERY_URL || 'http://127.0.0.1:64551';
for (const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:960}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin);await page.locator('#gallery-navigation-tree').waitFor();await (await galleryRow(page,'menu-15')).click();
  const frame=page.frameLocator('#frame-menu-15');
  const grid=frame.locator('#orders-grid');
  await grid.locator('tbody tr').nth(11).waitFor();
  assert.equal(await grid.locator('tbody tr').count(),12);
  await grid.evaluate(el=>{window.__qualifiedGrid=el;window.__qualifiedRow=el.shadowRoot.querySelector('tbody tr');});
  await frame.locator('#orders-update').click();
  await frame.locator('#orders-status').filter({hasText:'First row updated'}).waitFor();
  assert.match(await grid.locator('tbody tr').first().innerText(),/99\.50/);
  await frame.locator('#orders-remove').click();
  await frame.locator('#orders-count').filter({hasText:'11'}).waitFor();
  assert.equal(await grid.locator('tbody tr').count(),11);
  // Save row identity after a deliberate Data update, before changing themes.
  await grid.evaluate(el=>{window.__qualifiedRow=el.shadowRoot.querySelector('tbody tr');});
  await page.locator('#gallery-settings-button button').click();
  const result=[];
  for(const theme of ['Base','Compact','mimi','joanna','Mela']) {
   const appearance=page.locator('#index-appearance');
   await appearance.locator('input').fill(theme);
   await appearance.getByRole('option',{name:theme,exact:true}).click();
   for(const mode of ['Light','Dark']) {
    const control=page.locator('#index-theme');
    await control.locator('input').fill(mode);
    await control.getByRole('option',{name:mode,exact:true}).click();
    await page.waitForTimeout(180);
    const styles=await grid.evaluate(el=>{
     const h=el.shadowRoot.querySelector('th'),v=el.shadowRoot.querySelector('.body-viewport');
     return {identity:window.__qualifiedGrid===el && window.__qualifiedRow===el.shadowRoot.querySelector('tbody tr'),
      header:getComputedStyle(h).backgroundColor,color:getComputedStyle(h).color,
      height:el.getBoundingClientRect().height,bodyTop:v.getBoundingClientRect().top,headerBottom:el.shadowRoot.querySelector('.header-frame').getBoundingClientRect().bottom};
    });
    assert.equal(styles.identity,true);assert.ok(styles.height>400);assert.ok(styles.bodyTop>=styles.headerBottom-1);
    result.push({theme,mode,...styles});
    if(theme==='Compact' && mode==='Light') await page.screenshot({path:`/private/tmp/frame-grid-gallery-light-${name}.png`});
   }
  }
  await page.locator('#index-appearance input').fill('Compact');
  await page.locator('#index-appearance').getByRole('option',{name:'Compact',exact:true}).click();
  await page.locator('#index-theme input').fill('Light');
  await page.locator('#index-theme').getByRole('option',{name:'Light',exact:true}).click();
  await page.locator('#gallery-settings-button button').click();
  assert.equal(await grid.locator('td[data-field=notes]').first().evaluate(el=>getComputedStyle(el).whiteSpace),'pre-wrap');
  const headingStyles=await grid.evaluate(el=>{
   const root=el.shadowRoot, row=root.querySelector('tbody th[scope=row]'), column=root.querySelector('th[data-field]');
   return {row:getComputedStyle(row).backgroundColor,column:getComputedStyle(column).backgroundColor,
    ordinals:[...root.querySelectorAll('tbody th[scope=row]')].map(cell=>cell.textContent)};
  });
  assert.equal(headingStyles.row,headingStyles.column,'row headers share the neutral header palette');
  assert.deepEqual(headingStyles.ordinals,Array.from({length:11},(_,i)=>String(i+1)));
  const heights=await grid.locator('tbody tr').evaluateAll(rows=>rows.slice(0,2).map(row=>row.getBoundingClientRect().height));
  assert.ok(heights[0]>heights[1], 'multiline notes determine row height');
  const firstRow=grid.locator('tbody tr').first(), rowHandle=firstRow.locator('.row-height-handle');
  const point=await rowHandle.boundingBox();
  await page.mouse.move(point.x+point.width/2,point.y+point.height/2);await page.mouse.down();
  await page.mouse.move(point.x+point.width/2,point.y+point.height/2+55,{steps:6});await page.mouse.up();
  assert.ok(Math.abs((await firstRow.boundingBox()).height-heights[0]-55)<1);
  assert.equal((await grid.locator('tbody tr').nth(1).boundingBox()).height,heights[1]);
  await page.screenshot({path:`/private/tmp/frame-grid-row-resized-${name}.png`});
  await rowHandle.dblclick();
  assert.ok(Math.abs((await firstRow.boundingBox()).height-heights[0])<1,'double click restores multiline content height');
  const movingLabel=await firstRow.getAttribute('data-row');
  const targetRow=grid.locator('tbody tr').nth(2), targetBox=await targetRow.boundingBox();
  const secondLabel=await grid.locator('tbody tr').nth(1).getAttribute('data-row');
  const movingRow=grid.locator(`tbody tr[data-row="${movingLabel}"]`);
  await movingRow.dragTo(targetRow,{sourcePosition:{x:70,y:10},targetPosition:{x:70,y:targetBox.height-2}});
  assert.equal(await grid.locator('tbody tr').nth(2).getAttribute('data-row'),movingLabel);
  await movingRow.dragTo(grid.locator(`tbody tr[data-row="${secondLabel}"]`),{sourcePosition:{x:70,y:10},targetPosition:{x:70,y:2}});
  assert.equal(await grid.locator('tbody tr').first().getAttribute('data-row'),movingLabel);
  await grid.locator('th[data-field=quantity]').click();
  await grid.locator('th[data-field=price]').click({modifiers:['Shift']});
  const displayed=await grid.locator('tbody tr').evaluateAll(rows=>rows.map(row=>[
   Number(row.querySelector('td[data-field=quantity]').textContent), Number(row.querySelector('td[data-field=price]').textContent)]));
  assert.deepEqual(displayed,displayed.toSorted((a,b)=>a[0]-b[0]||a[1]-b[1]));
  assert.equal(await grid.locator('th[data-field=quantity]').getAttribute('aria-sort'),'ascending');
  assert.equal(await grid.locator('th[data-field=price]').getAttribute('data-sort-priority'),'2');
  assert.ok(await frame.locator('#orders-frame svg').count()>0, 'title uses Source-authored SVG');
  await page.screenshot({path:`/private/tmp/frame-grid-gallery-${name}.png`});
  assert.deepEqual(errors,[]);
  for(let i=0;i<result.length;i+=2) assert.notEqual(result[i].header,result[i+1].header);
  assert.ok(new Set(result.map(r=>r.height)).size>1);
  console.log(JSON.stringify({browser:name,themeCombinations:result.length,retainedIdentity:true,headerBodySeparation:true,rows:11,commands:'passed',indexedDrag:'passed',multicolumnSort:'passed',errors}));
 } finally {await browser.close();}
}
