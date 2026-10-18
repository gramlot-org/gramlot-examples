/** Smoke every catalogue page and the index in isolated Chromium/WebKit pages. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const [playwrightEntry, ...urls] = process.argv.slice(2);
if (!playwrightEntry || !urls.length) throw new Error('Usage: verify_all_gallery_pages_browser.mjs PLAYWRIGHT_ENTRY URL...');
const {chromium, webkit} = await import(pathToFileURL(playwrightEntry));
const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url)));
const keys = ['', ...families.flatMap(family => family.examples.map(example => example.key))];
const failures = [];
for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch({headless: true});
    try {
        for (const base of urls) {
            let count = 0;
            for (const key of keys) {
                const page = await browser.newPage();
                page.setDefaultTimeout(15000);
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                const url = base + key + (base.startsWith('file:') ? (key ? '/index.html' : 'index.html') : '');
                try {
                    await page.goto(url);
                    await page.waitForFunction(() => ['started', 'failed'].includes(window.gramlot?.state));
                    assert.equal(await page.evaluate(() => window.gramlot.state), 'started');
                    assert.ok(await page.locator('#gramlot-root').evaluate(node => node.childElementCount > 0));
                    if (key === 'c16') {
                        await page.locator('#name').fill('Grace');
                        assert.equal(await page.locator('#card').getAttribute('title'), 'Customer: Grace');
                        assert.equal(await page.locator('#card').getAttribute('customer'), 'Grace');
                    }
                    // Startup may launch remote fragments or auxiliary frames after state=started.
                    // Let those requests finish before asserting and closing this isolated page.
                    await page.waitForLoadState('networkidle');
                    assert.deepEqual(errors, []);
                    count++;
                } catch (error) {
                    const failure = `${name} ${url}: ${error.message}; ${errors.join('; ')}`;
                    failures.push(failure);
                    console.error(failure);
                } finally {
                    page.removeAllListeners('pageerror');
                    await page.close();
                }
            }
            console.log(`${name} ${base}: ${count}/${keys.length} pages started and rendered without errors`);
        }
    } finally {
        await browser.close();
    }
}
if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
}
