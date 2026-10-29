import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fromTytx} from '@genrojs/tytx';
import {galleryRow} from './gallery-navigation.mjs';
import {groupletBehaviors} from './grouplet-behaviors.mjs';

const base = process.argv[2];
if (!base) throw new Error('Pass the local gallery URL');
const browser = await chromium.launch({headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    const errors = [], calls = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
        if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/gramlot/rpc')) {
            calls.push(fromTytx(request.postData()));
        }
    });
    page.on('response', response => {
        if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(base);
    await page.waitForFunction(() => window.gramlot?.state === 'started');
    for (const key of ['g01', 'g02', 'g03', 'g04']) {
        await (await galleryRow(page, key)).click();
        const frameElement = await page.locator(`#frame-${key}`).elementHandle();
        const frame = await frameElement.contentFrame();
        await frame.waitForFunction(() => window.gramlot?.state === 'started');
        await groupletBehaviors[key](frame);
        await page.screenshot({path: `/private/tmp/grouplets-${key}-rich.png`, fullPage: true});
        await page.setViewportSize({width: 560, height: 900});
        assert.ok(await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${key}: no horizontal overflow`);
        await page.setViewportSize({width: 1440, height: 1000});
        await page.locator(`#preview-${key}`).getByRole('tab', {name: 'Code', exact: true}).first().click();
        const editor = page.locator(`#code-${key}`);
        await editor.waitFor();
        const code = await editor.evaluate(element => element.parameters.value);
        assert.match(code, /@source/);
        assert.match(code, /def (customer_fields|address_fields|site_profile|order_cards)/);
        console.log(`${key}: gallery navigation, Python source and remote interaction passed`);
    }
    assert.deepEqual(calls.filter(c => c.name === 'customer_fields').map(c => c.params.kind), ['person','company','person','company']);
    assert.equal(calls.filter(c => c.name === 'address_fields' && c.params.slot).length, 2);
    assert.deepEqual(calls.filter(c => c.name === 'site_profile').map(c => c.params.revision), [1,2]);
    assert.equal(calls.filter(c => c.name === 'contact_fields').length, 2);
    assert.deepEqual(calls.filter(c => c.name === 'order_cards').map(c => c.params.revision), [1, 2]);
    assert.equal(calls.filter(c => c.name === 'order_address_fields' && c.params.slot === 'billing').length, 2);
    assert.equal(calls.filter(c => c.name === 'order_address_fields' && c.params.slot === 'shipping').length, 2);
    assert.equal(calls.filter(c => c.name === 'order_delivery_fields').length, 2);
    assert.deepEqual(errors, []);
    await page.screenshot({path: '/private/tmp/grouplets-gallery.png', fullPage: true});
    console.log('Four grouplet lessons passed in Chromium; no page or HTTP errors.');
} finally {
    await browser.close();
}
