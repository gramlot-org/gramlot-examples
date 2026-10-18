/** Exercise the delayed carousel preview and retained edits, including file:// exports. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {chromium, webkit} = await import(process.argv[2]);
const bases = process.argv.slice(3);
if (!bases.length) throw new Error('Pass Playwright entry and one or more gallery base URLs.');
const catalog = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url)));
const demos = catalog.families.flatMap(family => family.examples).filter(demo => demo.key !== 'l08');
for (const [engineName, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch({headless: true});
    try {
        for (const base of bases) {
            const page = await browser.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            try {
                await page.goto(new URL(base.startsWith('file:') ? 'l08/index.html' : 'l08', base).href);
                await page.waitForFunction(() => window.gramlot?.state === 'started');
                assert.equal(await page.locator('#live-w01').getAttribute('src'), null);
                const choose = async key => {
                    // Dispatch the same input event as a range gesture, selecting an exact catalogue index.
                    await page.locator('#stack-panel input').evaluate((input, value) => {
                        input.value = String(value);
                        input.dispatchEvent(new Event('input', {bubbles: true}));
                    }, demos.findIndex(demo => demo.key === key));
                    await page.waitForFunction(key => gramlot.data.getItem('stackDemo.active') === key, key);
                };
                await choose('w01');
                const frame = await page.locator('#live-w01').contentFrame();
                const field = frame.locator('#customer input');
                await field.fill('Retained carousel edit');
                await field.press('Tab');
                const frameElement = await page.locator('#live-w01').elementHandle();
                await choose('e02');
                await page.frameLocator('#live-e02').locator('#gramlot-root > *').first().waitFor();
                await choose('w01');
                assert.equal(await field.inputValue(), 'Retained carousel edit');
                assert.equal(await frameElement.evaluate(element => element === document.getElementById('live-w01')), true);
                assert.equal(await page.locator('#live-w01').getAttribute('src'), base.startsWith('file:') ? '../w01/index.html' : 'w01');
                assert.deepEqual(errors, []);
                console.log(`${engineName} ${base}: delayed preview, file routes and retained edits passed`);
            } finally {
                await page.close();
            }
        }
    } finally {
        await browser.close();
    }
}
