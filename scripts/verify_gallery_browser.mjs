/** Check readable source tabs in delivered galleries: node scripts/verify_gallery_browser.mjs <URL> [...]. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';

const urls = process.argv.slice(2);
if (!urls.length) throw new Error('Pass at least one gallery URL');
const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url)));
const keys = families.flatMap(family => family.examples.map(example => example.key));
const browser = await chromium.launch({headless: true});
try {
    for (const url of urls) {
        const page = await browser.newPage({viewport: {width: 1280, height: 800}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(url);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        for (const key of keys) {
            await page.locator(`#open-${key}`).evaluate(link => link.closest('details').open = true);
            await page.click(`#open-${key}`);
            const frame = await page.locator(`#frame-${key}`).elementHandle();
            await (await frame.contentFrame()).waitForFunction(() => window.gramlot?.state === 'started');
            const pane = page.locator(`#codepane-${key}`);
            const tabs = pane.getByRole('tab');
            const primary = page.locator(`#code-panel-${key}`);
            assert.equal(await tabs.first().getAttribute('aria-selected'), 'true');
            assert.equal(await primary.isVisible(), true);
            const bounds = await primary.boundingBox();
            assert.ok(bounds.height > 100 && bounds.width > 100, `${key}: source must have usable visible area`);
            const python = await page.locator(`#code-${key}`).evaluate(code => code.classList.contains('language-python'));
            assert.ok((await tabs.first().textContent()).startsWith(python ? 'Python' : 'JavaScript'));
            if (python) assert.equal(await tabs.count(), ['b08', 'c02', 'c03', 'c08', 'c15', 'c17', 'c14', 'c18', 'c19'].includes(key) ? 2 : 1);
            if (await tabs.count() > 1) {
                assert.equal(await tabs.nth(1).textContent(), 'logic.js');
                assert.match(await page.locator(`#logic-${key}`).textContent(), /^export class Logic/);
                assert.ok(!(await page.locator(`#logic-${key}`).textContent()).includes('export class Page'));
                await primary.evaluate(element => element.scrollTop = 80);
                const scroll = await primary.evaluate(element => element.scrollTop);
                await tabs.nth(1).click();
                assert.equal(await primary.isVisible(), false);
                assert.equal(await page.locator(`#logic-panel-${key}`).isVisible(), true);
                const secondary = await page.locator(`#logic-panel-${key}`).boundingBox();
                assert.ok(secondary.height > 100 && secondary.width > 100);
                await tabs.nth(1).press('Home');
                assert.equal(await primary.isVisible(), true);
                assert.equal(await primary.evaluate(element => element.scrollTop), scroll);
                assert.equal(await tabs.first().getAttribute('aria-selected'), 'true');
            }
            assert.equal(await frame.evaluate(element => element === document.getElementById(element.id)), true);
            assert.equal(await pane.locator('[role="tabpanel"]:visible').count(), 1);
        }
        assert.deepEqual(errors, []);
        console.log(`PASS ${url}: ${keys.length} readable primary sources, source tabs, keyboard and preserved previews`);
        await page.close();
    }
} finally {
    await browser.close();
}
