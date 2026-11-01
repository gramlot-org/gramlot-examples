/** Run against the Python or JavaScript visual Source page URL. Checks the current composition on Chromium and WebKit; broader WebKit limits remain documented. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {chromium, webkit} from 'playwright';

export async function verifyVisualSource(page, engineName) {
await page.locator('#visual-source-tree').waitFor();
await page.locator('#visual-data-tree').waitFor();
await page.getByRole('button', {name:'Catalogue', exact:true}).click();
const catalogue = page.locator('#visual-widget-tree');
const source = page.locator('#visual-source-tree');
const search = page.getByRole('searchbox', {name:'Search widgets', exact:true});
const dragWidget = async (tag, target) => {
    await search.fill(tag);
    const row = catalogue.locator(`[data-path$=".${tag}"] > .row`);
    await row.waitFor({state:'visible'});
    await row.dragTo(target);
};
const root = source.locator('[data-path="pageRoot"] > .row');
await dragWidget('tabContainer', root);
await source.locator('[data-path="pageRoot.tabContainer_0"][aria-selected="true"]').waitFor();
assert.equal(await page.getByRole('heading', {name:'Required parameters', exact:true}).count(), 0);
await dragWidget('formlet', source.locator('[data-path="pageRoot.tabContainer_0"] > .row'));
await page.getByRole('heading', {name:'Required parameters', exact:true}).waitFor();
await page.getByRole('button', {name:'Insert', exact:true}).click();
await page.getByText('Choose title', {exact:true}).filter({visible:true}).first().waitFor();
await page.getByRole('textbox', {name:'title', exact:true}).fill('Customer');
await page.getByRole('textbox', {name:'title', exact:true}).press('Tab');
await page.getByRole('button', {name:'Insert', exact:true}).click();
await page.getByRole('tab', {name:'Customer', exact:true}).waitFor();
await page.locator('.region-title').filter({hasText:/^formlet_0 \[formlet\]$/}).waitFor();
await page.getByRole('tab', {name:'Container', exact:true}).click();
await page.getByRole('textbox', {name:'pageName', exact:true}).fill('customer');
await page.getByRole('textbox', {name:'pageName', exact:true}).press('Tab');
await page.getByRole('textbox', {name:'title', exact:true}).fill('Customer details');
await page.getByRole('textbox', {name:'title', exact:true}).press('Tab');
await page.getByRole('tab', {name:'Customer details', exact:true}).waitFor();
const titleInput = await page.getByRole('textbox', {name:'title', exact:true}).elementHandle();
await page.getByRole('button', {name:'Detach formlet_0 [formlet]', exact:true}).click();
const detached = page.getByRole('dialog', {name:'formlet_0 [formlet]', exact:true});
await detached.waitFor();
assert.equal(await titleInput.evaluate(element => element.isConnected && element.value === 'Customer details'), true);
await detached.getByRole('button', {name:'Close window', exact:true}).click();
await detached.waitFor({state:'detached'});
assert.equal(await titleInput.evaluate(element => element.isConnected && element.value === 'Customer details'), true);

await source.locator('[data-path="pageRoot"] > .row').click();
await page.locator('.region-title').filter({hasText:/^pageRoot \[div\]$/}).waitFor();
assert.equal(await page.locator('#visual-data-tree [data-path="__editor"]').count(), 0);
assert.equal(await page.locator('#visual-data-tree [data-path="catalogue"]').count(), 0);
await page.screenshot({path:`/private/tmp/visual-source-${engineName}.png`});
console.log(engineName, 'PASS: immediate creation, required tab title, selected-node properties, detach/dock identity and scoped Data tree');

}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const url=process.argv[2];
    if (!url) throw new Error('Pass the visual Source example URL, optionally followed by chromium or webkit');
    const engines=process.argv[3] ? {[process.argv[3]]:{chromium,webkit}[process.argv[3]]} : {chromium,webkit};
    for (const [engineName,engine] of Object.entries(engines)) {
        const browser=await engine.launch({headless:true});
        try {
            const page=await browser.newPage({viewport:{width:1100,height:800}}), errors=[], network=[];
            page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
            page.on('pageerror',error=>errors.push(error.message));
            await page.goto(url);
            try { await verifyVisualSource(page, engineName); }
            catch (error) { await page.screenshot({path:`/private/tmp/visual-source-${engineName}-failure.png`}); throw error; }
            assert.deepEqual(errors,[]);
            if (url.startsWith('file:')) assert.deepEqual(network, [], 'File export must not request HTTP resources');
        } finally { await browser.close(); }
    }
}
