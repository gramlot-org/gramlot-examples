/** Verify manual entry, paced field loading and independent copies in a hosted or exported pilot. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

const [playwrightEntry, ...urls] = process.argv.slice(2);
if (!playwrightEntry || !urls.length) throw new Error('Usage: verify_sample_data_browser.mjs PLAYWRIGHT_ENTRY URL...');
const {chromium, webkit} = await import(pathToFileURL(playwrightEntry));
for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch({headless: true});
    try {
        for (const url of urls) {
            const page = await browser.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            try {
                await page.goto(url);
                await page.waitForFunction(() => window.gramlot?.state === 'started');
                assert.equal(await page.locator('#customer-name').inputValue(), 'Ada Lovelace');
                assert.equal(await page.locator('#accent').inputValue(), '#2563eb');
                assert.equal(await page.locator('#draft-name').inputValue(), '');
                await page.locator('#draft-name').fill('Manual draft');
                assert.equal(await page.locator('#draft-preview').textContent(), 'Manual draft');
                await page.locator('#fill-sample').click();
                assert.equal(await page.locator('#draft-name').inputValue(), 'Ada Lovelace');
                assert.equal(await page.locator('#draft-city').inputValue(), '');
                await page.waitForFunction(() => document.getElementById('draft-city').value === 'London');
                const copied = await page.evaluate(() => {
                    const data = window.gramlot.data;
                    return {independent: data.getItem('draft') !== data.getItem('customer'),
                        credit: String(data.getItem('draft.credit')),
                        caption: data.getNode('draft.name').getAttr('caption')};
                });
                assert.deepEqual(copied, {independent: true, credit: '1250.5', caption: 'Customer name'});
                await page.locator('#draft-name').fill('Grace Hopper');
                assert.equal(await page.locator('#customer-name').inputValue(), 'Ada Lovelace');
                await page.locator('#clear-draft').click();
                assert.equal(await page.locator('#draft-name').inputValue(), '');
                await page.locator('#fill-sample').click();
                assert.equal(await page.locator('#draft-preview').textContent(), 'Ada Lovelace');
                await page.locator('#clear-draft').click();
                await page.waitForTimeout(400);
                assert.equal(await page.locator('#draft-city').inputValue(), '', 'Clear cancels the pending field');
                await page.locator('#fill-sample').click();
                await page.waitForTimeout(100);
                await page.evaluate(() => gramlot.data.setItem('customer.city', 'Paris'));
                await page.locator('#fill-sample').click();
                await page.evaluate(() => gramlot.data.setItem('customer.city', 'Rome'));
                await page.waitForFunction(() => document.getElementById('draft-city').value === 'Paris');
                await page.reload();
                await page.waitForFunction(() => window.gramlot?.state === 'started');
                assert.equal(await page.locator('#draft-name').inputValue(), '');
                assert.deepEqual(errors, []);
                console.log(`${name} ${url}: initial Bag, defaults, manual editing, paced fill, independent snapshot, cancellation, restart and reload passed`);
            } finally {
                await page.close();
            }
        }
    } finally {
        await browser.close();
    }
}
