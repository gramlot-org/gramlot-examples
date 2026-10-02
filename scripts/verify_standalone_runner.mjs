/** Acceptance check for the exported static-directory runner. */
import assert from 'node:assert/strict';
import {pathToFileURL, fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
const [url, playwright, executablePath] = process.argv.slice(2);
const {chromium} = await import(pathToFileURL(playwright));
const browser = await chromium.launch({headless: true, executablePath});
const context = await browser.newContext({viewport: {width: 1440, height: 1000}, offline: true});
const base = new URL(url.endsWith('/') ? url : `${url}/`);
assert.equal(base.protocol, 'file:', 'This acceptance check must use a direct file URL');
const errors = [];
context.on('page', page => {
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
});
context.on('request', request => {
    if (request.method() !== 'GET') errors.push(`Non-static request: ${request.method()} ${request.url()}`);
    if (/^https?:/.test(request.url())) errors.push(`External request: ${request.url()}`);
});
context.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const page = await context.newPage();
try {
    for (let number = 1; number <= 12; number++) {
        await page.goto(new URL(`e${String(number).padStart(2, '0')}/index.html`, base).href);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('#gramlot-root').innerText().then(text => text.length > 0), true);
        assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(247, 248, 245)');
    }
    await page.goto(new URL('index.html', base).href);
    await page.waitForSelector('#code-e01.hljs', {state: 'attached'});
    await page.waitForFunction(() => window.gramlot?.state === 'started');
    assert.equal(await page.locator('.runner-list .runner-list a').count(), 13);
    await page.locator('#open-html_svg').click();
    assert.equal(await page.locator('#panel-html_svg [id^=readme-] h1').innerText(), 'HTML / SVG');
    await page.locator('#runner-theme').selectOption('dark');
    await page.locator('#open-e06').click();
    const frame = page.frame({name: 'example-e06'});
    await frame.waitForFunction(() => window.gramlot?.state === 'started');
    await frame.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    assert.equal(await frame.locator('html').getAttribute('data-theme'), 'dark');
    const source = await readFile(fileURLToPath(new URL('../pages/html_svg/06_forms.js', import.meta.url)), 'utf8');
    assert.equal(await page.locator('#panel-e06 code[id^=code-]').textContent(), source);
    assert.ok(await page.locator('#panel-e06 .hljs-keyword').count() > 0);
    await frame.locator('#name').fill('Static Worker page');
    const divider = page.locator('#panel-e06 [role=separator]');
    assert.equal(await divider.getAttribute('aria-valuenow'), '65');
    await divider.press('ArrowLeft');
    await page.locator('#open-e12').click();
    await page.frame({name: 'example-e12'}).waitForFunction(() => window.gramlot?.state === 'started');
    await page.locator('#tab-e06').click();
    assert.equal(await frame.locator('#name').inputValue(), 'Static Worker page');
    assert.equal(await divider.getAttribute('aria-valuenow'), '60');
    await page.locator('#runner-theme').selectOption('light');
    await frame.waitForFunction(() => document.documentElement.dataset.theme === 'light');
    assert.equal(await frame.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('#keyboard-navigation').check();
    await page.locator('#tab-e06').press('End');
    assert.equal(await page.locator('#tab-e12').getAttribute('aria-selected'), 'true');
    await page.setViewportSize({width: 390, height: 844});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    assert.deepEqual(errors, []);
    console.log('PASS: direct file URLs with browser offline; 12 Worker pages; no HTTP requests; category, CSS, source, themes, tabs, split, retained state and narrow layout.');
} finally {
    await browser.close();
}
