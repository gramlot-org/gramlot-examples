/**
 * Open every example page in Chromium through the core GramlotFileServer of each language:
 * `node scripts/verify_pages_browser.mjs <Python base URL> <JavaScript base URL>`, each a
 * `serve_pages` server on `src/gramlot_examples/pages` (`<base>/<family>/<NN_name>`).
 * Every page must start without errors or failed requests; b08, c03 and c08 call methods
 * of the Logic that the page module NN_name.js exports, the Python pages included.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';

const bases = process.argv.slice(2);
if (bases.length !== 2) throw new Error('Pass the Python and the JavaScript base URL');
const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url), 'utf8'));

// One behaviour per page with named logic: each step calls a method of its Logic class.
const LOGIC = {
    async b08(page, text) {
        await page.click('#freeze');
        assert.equal(await text('#frozen'), 'true');
        await page.click('#add');
        await page.click('#removeLast');
        await page.click('#removeLast');
        assert.equal(await page.locator('#items li').count(), 3, 'the removal waits for the thaw');
        await page.click('#thaw');
        assert.equal(await page.locator('#items li').count(), 1);
        assert.equal(await text('#count'), '1');
    },
    async c03(page, text) {
        assert.equal(await text('#final'), '80');
        await page.fill('#price', '120');
        await page.waitForFunction(() => document.getElementById('final').textContent === '108');
        assert.equal(await text('#changes'), '1');
    },
    async c08(page, text) {
        await page.click('#press', {modifiers: ['Shift']});
        assert.equal(await text('#presses'), 'Pressed 1 times');
        assert.equal(await text('#modifiers'), 'with Shift');
        await page.click('#freeze');
        await page.click('#removeNote');
        assert.equal(await page.locator('#notes > *').count(), 2);
        await page.click('#thaw');
        assert.equal(await page.locator('#notes > *').count(), 1);
    },
};

async function check(browser, base, family, example) {
    const url = `${base}/${family.key}/${example.folder}`;
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => {
        if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(url);
    await page.waitForFunction(() => ['started', 'failed'].includes(window.gramlot?.state));
    assert.equal(await page.evaluate(() => window.gramlot.state), 'started', `${url}: ${errors.join('; ')}`);
    assert.ok(await page.evaluate(() => document.getElementById('gramlot-root').childElementCount > 0), url);
    await LOGIC[example.key]?.(page, selector => page.locator(selector).textContent());
    assert.deepEqual(errors, [], url);
    await page.close();
}

const browser = await chromium.launch({headless: true});
try {
    for (const [language, base] of [['Python', bases[0]], ['JavaScript', bases[1]]]) {
        let count = 0;
        for (const family of families) {
            for (const example of family.examples) {
                await check(browser, base, family, example);
                count += 1;
            }
        }
        console.log(`PASS ${language} ${base}: ${count} pages, Logic of b08, c03 and c08`);
    }
} finally {
    await browser.close();
}
