/** Public database lessons must work before and after gallery promotion. */
import assert from 'node:assert/strict';
import {chromium, expect} from '@playwright/test';
const base=process.argv[2];
const browser=await chromium.launch({headless:true});
const errors=[];
async function open(path) {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror', error=>errors.push(error.message));
    const response=await page.goto(`${base}${path}`);
    assert.equal(response.status(),200);
    try {
        await page.waitForFunction(()=>window.gramlot?.state==='started');
    } catch (error) {
        console.error('Page startup failed:', path, errors, await page.locator('body').innerText());
        throw error;
    }
    return page;
}
try {
    let page=await open('/');
    await page.getByRole('treeitem').first().waitFor();
    await page.getByPlaceholder('Search examples').fill('cached invoice');
    await page.locator('#gallery-navigation-tree').getByText('Asqueel only · cached invoice rows',{exact:true}).waitFor();
    console.log('PASS',new URL(page.url()).pathname);
    await page.close();
    page=await open('/pages/81-asqueel/01-state_customers');
    await page.locator('#state input').fill('VIC');
    await page.getByRole('option',{name:'Victoria',exact:true}).click();
    await page.waitForFunction(()=>Boolean(gramlot.data.getItem('selection.state')));
    await page.locator('#customer input').click();
    await page.locator('#customer input').press('ArrowDown');
    await page.getByRole('option').first().click();
    assert.ok(await page.evaluate(()=>gramlot.data.getItem('selection.customer')));
    console.log('PASS',new URL(page.url()).pathname);
    await page.close();
    page=await open('/pages/82-grid-database/02-invoice_rows');
    await page.locator('#db-grid-status').filter({hasText:/^Loaded$/}).waitFor({timeout:60000});
    assert.equal(await page.evaluate(()=>gramlot.data.getItem('invoice_rows.selection.count')),1000);
    assert.ok(await page.evaluate(()=>gramlot.data.getItem('invoice_rows.selection.rows').getNodes()[0].attr.customer_name));
    await page.locator('#db-grid-limit').selectOption('100');
    await page.waitForFunction(()=>gramlot.data.getItem('invoice_rows.selection.count')===100);
    console.log('PASS',new URL(page.url()).pathname);
    await page.close();
    page=await open('/pages/84-cached-selection/01-invoice_rows');
    await page.locator('#trial-mode').filter({hasText:'cachedFetch'}).waitFor({timeout:60000});
    assert.equal(await page.evaluate(()=>gramlot.data.getItem('trial.selection.count')),1000);
    assert.equal(await page.evaluate(()=>gramlot.data.getItem('trial.selection.resident')),200);
    await page.getByLabel('Max rows', {exact:true}).selectOption('100');
    await page.locator('#trial-mode').filter({hasText:'resident'}).waitFor();
    assert.equal(await page.evaluate(()=>gramlot.data.getItem('trial.selection.count')),100);
    await page.getByLabel('Max rows', {exact:true}).selectOption('1000');
    await page.locator('#trial-mode').filter({hasText:'cachedFetch'}).waitFor();
    await page.getByLabel('Server search').fill('zzzz-no-such-public-row');
    await page.waitForFunction(()=>gramlot.data.getItem('trial.selection.count')===0);
    await page.getByLabel('Server search').fill('');
    await page.waitForFunction(()=>gramlot.data.getItem('trial.selection.count')===1000);
    await page.locator('#trial-grid th[data-field=quantity]').click();
    await page.waitForFunction(()=>gramlot.data.getItem('trial.selection.window.sortedBy')==='quantity:a');
    await page.getByLabel('Max rows', {exact:true}).selectOption('500000');
    await page.waitForFunction(()=>gramlot.data.getItem('trial.selection.count')===410429,null,{timeout:120000});
    assert.equal(await page.evaluate(()=>gramlot.data.getItem('trial.selection.resident')),200);
    console.log('PASS full XL selection: 410429 server rows, 200 browser rows');
    console.log('PASS',new URL(page.url()).pathname);
    await page.close();
    page=await open('/pages/90-page_store/01_bidirectional');
    await page.locator('#quantity').fill('5');
    await page.locator('#quantity').press('Tab');
    await expect(page.locator('#mirror-quantity')).toHaveValue('5');
    await expect(page.locator('#total')).toHaveText('62.5');
    await page.locator('#quantity').fill('-1');
    await page.locator('#quantity').press('Tab');
    await expect(page.locator('#status')).toHaveText('Enter a non-negative whole quantity');
    await expect(page.locator('#total')).toHaveText('62.5');
    await page.close();

    page=await open('/pages/90-page_store/03_family');
    const direct=page.frameLocator('#direct-customer');
    const nested=page.frameLocator('#customer-branch').frameLocator('iframe');
    await direct.locator('#customer-key').fill('1');
    await direct.locator('#load-customer').click();
    await expect(direct.locator('#customer-name')).toHaveText('Mario Rossi');
    await nested.locator('#customer-key').fill('2');
    await nested.locator('#load-customer').click();
    await expect(nested.locator('#customer-name')).toHaveText('Anna Bianchi');
    await expect(direct.locator('#customer-name')).toHaveText('Mario Rossi');
    const popupReady=page.waitForEvent('popup');
    await page.locator('#open-family-window').click();
    const popup=await popupReady;
    await popup.locator('#customer-key').fill('99');
    await popup.locator('#load-customer').click();
    await expect(popup.locator('#customer-error')).toHaveText('Customer not found');
    await popup.locator('#customer-key').fill('2');
    await popup.locator('#load-customer').click();
    await expect(popup.locator('#customer-name')).toHaveText('Anna Bianchi');
    await popup.close();
    await expect(direct.locator('#customer-name')).toHaveText('Mario Rossi');
    await page.close();
    console.log('PASS PageStore binding, validation, direct/nested frames and connected window');

    page=await open('/pages/91-kajenn_db/01_customer');
    // The lesson opens with the first listed customer loaded.
    await expect(page.locator('#customer-status')).toHaveText('loaded');
    const customerId=await page.locator('#loaded-key').innerText();
    assert.ok(customerId);
    const original={name:await page.locator('#customer-name').inputValue(),email:await page.locator('#customer-email').inputValue()};
    assert.ok(original.name && original.email, 'Customer fixture must be restorable through its required fields');
    let changed=false;
    try {
        await page.locator('#customer-name').fill('');
        await page.locator('#save-customer').click();
        await expect(page.locator('#customer-error')).toHaveText('Name is required.');
        await page.locator('#customer-name').fill('Gallery verification');
        await page.locator('#customer-email').fill('gallery-verification@example.com');
        changed=true;
        await page.locator('#save-customer').click();
        await expect(page.locator('#customer-status')).toHaveText('saved');
        await page.locator('#reload-customer').click();
        await expect(page.locator('#customer-status')).toHaveText('loaded');
        await expect(page.locator('#customer-name')).toHaveValue('Gallery verification');
        await expect(page.locator('#customer-email')).toHaveValue('gallery-verification@example.com');
    } finally {
        if(changed) {
            await page.locator('#customer-name').fill(original.name);
            await page.locator('#customer-email').fill(original.email);
            await page.locator('#save-customer').click();
            await expect(page.locator('#customer-status')).toHaveText('saved');
            await page.locator('#reload-customer').click();
            await expect(page.locator('#customer-status')).toHaveText('loaded');
            await expect(page.locator('#customer-name')).toHaveValue(original.name);
            await expect(page.locator('#customer-email')).toHaveValue(original.email);
        }
    }
    await page.locator('#customer-key').fill('unknown-customer');
    await page.locator('#customer-key').press('Tab');
    await expect(page.locator('#customer-status')).toHaveText('error');
    await expect(page.locator('#loaded-key')).toHaveText(customerId);
    await page.close();
    console.log('PASS customer validation, save/reload, original values restored, unknown key preserves loaded ID');

    page=await open('/pages/92-chat/01-echo');
    await page.getByRole('textbox',{name:'Message',exact:true}).fill('Gallery verification');
    await page.getByRole('button',{name:'Send',exact:true}).click();
    await expect(page.getByText('Gallery verification',{exact:true})).toHaveCount(2);
    await page.getByRole('button',{name:'Source example',exact:true}).click();
    // The Source reply is an order panel: its Items tab shows the initial rows.
    await page.locator('.order-panel').getByText('Items',{exact:true}).click();
    await expect(page.locator('.order-panel').getByText('Notebook',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'New conversation',exact:true}).click();
    await expect(page.getByText('Gallery verification',{exact:true})).toHaveCount(0);
    await page.close();
    console.log('PASS Chat echo, order panel Source reply and reset');
    assert.deepEqual(errors,[]);
    console.log(`PASS ${base}: Asqueel catalogue, dependent selectors, resident grid, JSONL and cached selection/search/sort`);
} finally {await browser.close();}
