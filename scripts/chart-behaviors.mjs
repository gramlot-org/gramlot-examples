import assert from 'node:assert/strict';
export async function verifyChart(page, key) {
   if(key !== 'grid-charts')await page.getByRole('button',{name:'Chart',exact:true}).first().click();
   await page.getByRole('button',{name:'Chart settings',exact:true}).waitFor({timeout:15000});
   await page.locator('gramlot-chart-view svg, gramlot-chart-view canvas').first().waitFor({timeout:30000});
   
   
   if(key === 'chart-bars'){
    const view=page.locator('gramlot-chart-view svg').first();
    const before=await view.innerHTML();
    await page.getByRole('textbox',{name:'North revenue',exact:true}).press('ControlOrMeta+A');
    await page.getByRole('textbox',{name:'North revenue',exact:true}).pressSequentially('240');
    await page.getByRole('textbox',{name:'North revenue',exact:true}).press('Tab');
    await page.waitForFunction(()=>window.gramlot.data.getItem('report.rows.north.revenue')===240);
    await page.waitForFunction(previous=>document.querySelector('gramlot-chart-view').shadowRoot.querySelector('svg').innerHTML!==previous,before);
    await page.evaluate(()=>window.gramlot.data.setItem('report._chart.chartType','line'));
    await page.evaluate(()=>window.gramlot.data.setItem('report._chart.open',false));
    await page.getByRole('button',{name:'Chart',exact:true}).first().click();
    await page.getByRole('button',{name:'Chart settings',exact:true}).waitFor();
    const config=await page.evaluate(()=>window.gramlot.data.getItem('report._chart.chartType'));
    assert.equal(config,'line');
    await page.locator('gramlot-search-box input').fill('North');
    await page.waitForFunction(()=>!document.querySelector('gramlot-chart-view').shadowRoot.querySelector('svg').textContent.includes('South'));
    assert.equal(await page.evaluate(()=>window.gramlot.data.getItem('report.rows').getNodes().length),4);
    await page.locator('gramlot-search-box input').fill('');
    await page.waitForFunction(()=>document.querySelector('gramlot-chart-view').shadowRoot.querySelector('svg').textContent.includes('South'));
   }
}
export const chartBehaviors = Object.fromEntries([
 'chart-bars','chart-trends','chart-shares','chart-points','grid-charts',
 'chart-bars-3d','chart-surface','chart-territories'
].map(key => [key, page => verifyChart(page, key)]));
