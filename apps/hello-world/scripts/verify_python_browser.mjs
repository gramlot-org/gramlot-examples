/** Verify one already-running GC-088 Python profile in real Chromium. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

const [url, playwrightPath, executablePath] = process.argv.slice(2);
if (!executablePath) {
    throw new Error('Usage: node verify_python_browser.mjs URL PLAYWRIGHT_ENTRY CHROMIUM');
}

const {chromium} = await import(pathToFileURL(playwrightPath));
const browser = await chromium.launch({headless: true, executablePath});
try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(url);
    await page.waitForFunction(() => window.gramlot?.state === 'started');
    assert.equal(await page.locator('h1').textContent(), 'Hello World');
    assert.equal(await page.locator('h1').count(), 1);
    assert.deepEqual(errors, []);
    const disposed = await page.evaluate(() => {
        window.gramlot.dispose();
        return {
            records: window.gramlot.renderer.records.size,
            children: document.querySelector('#gramlot-root').childNodes.length,
        };
    });
    assert.deepEqual(disposed, {records: 0, children: 0});
    console.log('Browser PASS: one Hello World heading, no page errors, clean disposal.');
} finally {
    await browser.close();
}
