/** Exercise one central carousel stack and retained edits, including file:// exports. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildGallery} from '../src/gramlot_examples/index.js';
const {routes} = buildGallery();
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
                await page.goto(new URL(base.startsWith('file:') ? 'l08/index.html' : routes.l08.url, base).href);
                await page.waitForFunction(() => window.gramlot?.state === 'started');
                assert.equal(await page.locator('#live-w01').getAttribute('src'), null);
                assert.equal(await page.locator('gramlot-stack-container').count(), 1);
                assert.equal(await page.locator('iframe[id^="mini-"]').count(), 0);
                assert.equal(await page.locator('#carousel-drawer').count(), 0);
                assert.equal(await page.locator('iframe[id^="live-"]').count(), demos.length);
                await page.waitForFunction(() => document.querySelectorAll('iframe[id^="live-"][src]').length === 1);
                const sliderBox=await page.locator('#stack-panel').boundingBox(),stackBox=await page.locator('#stack-full').boundingBox();
                assert.ok(sliderBox.y+sliderBox.height<=stackBox.y, JSON.stringify({sliderBox,stackBox}));
                assert.equal(await page.locator('iframe[id^="live-"][src]').count(), 1);
                const initialKey = demos[0].key;
                const choose = async key => {
                    // Dispatch the same input event as a range gesture, selecting an exact catalogue index.
                    await page.locator('#stack-panel input').evaluate((input, value) => {
                        input.value = String(value);
                        input.dispatchEvent(new Event('input', {bubbles: true}));
                    }, demos.findIndex(demo => demo.key === key));
                    await page.waitForFunction(key => gramlot.data.getItem('stackDemo.active') === key, key);
                };
                // A rapid sweep must not start every embedded application.
                await page.locator('#stack-panel input').evaluate((input, count) => {
                    for (let index = 0; index < count; index++) {
                        input.value = String(index);
                        input.dispatchEvent(new Event('input', {bubbles: true}));
                    }
                }, demos.length);
                await choose('w01');
                assert.equal(await page.locator('iframe[id^="live-"][src]').count(), 2);
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
                assert.equal(await page.locator('#live-w01').getAttribute('src'), base.startsWith('file:') ? '../w01/index.html' : new URL(routes.w01.url, base).pathname);
                const loaded = await page.locator('iframe[id^="live-"][src]').evaluateAll(frames => frames.map(frame => frame.id));
                assert.deepEqual(loaded.sort(), [initialKey, 'w01', 'e02'].map(key => `live-${key}`).sort());
                assert.equal(await page.locator('iframe[id^="live-"][src]').count(), 3);
                await page.setViewportSize({width:390,height:844});
                assert.equal(await page.locator('gramlot-stack-container').count(),1);
                assert.ok(await page.locator('#carousel-layout').evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
                assert.equal(await field.inputValue(),'Retained carousel edit');
                if(engineName==='chromium' && base===bases[0])await page.screenshot({path:'/tmp/gramlot-single-carousel-mobile.png',fullPage:true});
                assert.deepEqual(errors, []);
                console.log(`${engineName} ${base}: one central stack, bounded loading, rapid sweep, file routes, narrow layout and retained edits passed`);
            } finally {
                await page.close();
            }
        }
    } finally {
        await browser.close();
    }
}
