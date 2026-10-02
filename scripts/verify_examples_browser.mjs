/** Local examples acceptance check; uses an already installed Playwright and Chrome. */
import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [url, playwrightEntry, executablePath, output = 'build/examples-review'] = process.argv.slice(2);
if (!url || !playwrightEntry || !executablePath) {
    throw new Error('Usage: node scripts/verify_examples_browser.mjs URL PLAYWRIGHT_ENTRY CHROME [OUTPUT]');
}
const {chromium} = await import(pathToFileURL(resolve(playwrightEntry)));
const families = JSON.parse(await readFile(new URL('../runner/catalog.json', import.meta.url), 'utf8'));
const bound = families.filter(({key}) => key !== 'html_svg');
await mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true, executablePath});
console.log(`Browser: ${browser.version()}`);
const errors = [];
const context = await browser.newContext({viewport: {width: 1440, height: 1000}, colorScheme: 'light'});
context.on('page', page => {
    page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack}`));
    page.on('console', message => {
        // The browser's own favicon request is not a page resource.
        if (message.type() === 'error' && !message.location().url.endsWith('/favicon.ico')) {
            errors.push(`${page.url()}: console ${message.text()} ${message.location().url}`);
        }
    });
});
context.on('response', response => {
    if (response.url().startsWith(url) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});
const page = await context.newPage();
const familyDetails = key => page.locator(`.runner-sidebar details:has(> summary > #open-${key})`);
const isOpen = key => familyDetails(key).evaluate(details => details.open);
// A click on the summary marker, left of the family link inside the summary.
const toggleFamily = async key => {
    const summary = familyDetails(key).locator('> summary');
    const box = await summary.boundingBox();
    await summary.click({position: {x: 8, y: box.height / 2}});
};
const routes = Array.from({length: 12}, (_, i) => `e${String(i + 1).padStart(2, '0')}`);
const snapshot = () => {
    const visit = node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        return [node.localName, node.namespaceURI,
            // Radio group names are scoped by the Gramlot instance (P11): compare them without the instance id.
            [...node.attributes].map(a => [a.name, a.value.replace(/^gramlot-[0-9a-f-]{36}-/, 'gramlot-<instance>-')])
                .sort(([a], [b]) => a.localeCompare(b)),
            [...node.childNodes].map(visit).filter(n => n !== null)];
    };
    return visit(document.querySelector('#gramlot-root'));
};
try {
    for (const route of routes) {
        const rendered = [];
        for (const language of ['py', 'js']) {
            const response = await page.goto(`${url}/${language}/${route}`);
            assert.equal(response.status(), 200);
            await page.waitForFunction(() => window.gramlot?.state === 'started');
            rendered.push(await page.evaluate(snapshot));
            assert.deepEqual(await page.locator('label[for]').evaluateAll(labels => labels.filter(l => !l.control).map(l => l.htmlFor)), [], 'Every explicit label resolves to its control');
            assert.equal(await page.locator('link[href$="/themes/gramlot-base/theme.css"]').count(), 1);
            assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(247, 248, 245)');
            assert.equal(await page.evaluate(() => [...document.querySelectorAll('svg')].every(svg =>
                svg.namespaceURI === 'http://www.w3.org/2000/svg')), true);
            if (route === 'e06') {
                const range = page.locator('input[type=range]').first();
                const initial = await range.inputValue();
                await range.fill('25');
                assert.equal(await range.inputValue(), '25');
                await page.locator('button[type=reset]').click();
                assert.equal(await range.inputValue(), initial);
                assert.equal(await page.locator('input[readonly]').first().getAttribute('readonly') !== null, true);
                assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
            }
            if (route === 'e07') {
                const details = page.locator('details').first();
                const before = await details.getAttribute('open');
                await details.locator('summary').click();
                assert.notEqual(await details.getAttribute('open'), before);
            }
        }
        assert.deepEqual(rendered[1], rendered[0], `Python/JS rendered parity: ${route}`);
        await page.emulateMedia({colorScheme: 'dark'});
        await page.setViewportSize({width: 390, height: 844});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route}: narrow layout`);
        await page.emulateMedia({colorScheme: 'light'});
        await page.setViewportSize({width: 1440, height: 1000});
        console.log(`${route}: Python/JavaScript render and parity passed`);
    }
    for (const family of bound) {
        for (const {key, folder} of family.examples) {
            const rendered = [];
            for (const language of ['py', 'js']) {
                const response = await page.goto(`${url}/${language}/${key}`);
                assert.equal(response.status(), 200);
                await page.waitForFunction(() => window.gramlot?.state === 'started');
                await page.waitForTimeout(50);
                rendered.push(await page.evaluate(snapshot));
                assert.deepEqual(await page.locator('label[for]').evaluateAll(labels => labels.filter(l => !l.control).map(l => l.htmlFor)), [], 'Every explicit label resolves to its control');
                assert.equal(await page.locator('link[href$="/themes/gramlot-base/theme.css"]').count(), 1);
                assert.equal(await page.evaluate(() => [...document.querySelectorAll('svg')].every(svg =>
                    svg.namespaceURI === 'http://www.w3.org/2000/svg')), true);
            }
            assert.deepEqual(rendered[1], rendered[0], `Python/JS rendered parity: ${key}`);
            console.log(`${key} ${family.key}/${folder}: Python/JavaScript render and parity passed`);
        }
    }
    for (const integration of ['py', 'js']) {
        await page.goto(`${url}/${integration}/index`);
        await page.waitForSelector('#code-e01.hljs', {state: 'attached'});
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('[role=tab]:visible').count(), 1, 'Only introduction starts open');
        assert.equal(await page.locator('input[name=runner-language]').count(), 0);
        assert.equal(await page.locator('.runner-list a').count(),
            families.reduce((total, family) => total + 1 + family.examples.length, 0));
        assert.equal(await page.locator('iframe[src]').count(), 0, 'No example loads before selection');
        assert.equal(await page.locator('#panel-intro iframe').count(), 0);
        assert.equal(await page.locator('#panel-intro').isVisible(), true);
        assert.deepEqual(await page.locator('.runner-sidebar details').evaluateAll(all => all.map(details => details.open)),
            families.map((_, index) => index === 0), 'Only the first family starts open');
        assert.equal(await page.locator('.runner-logo').evaluate(img => img.complete && img.naturalWidth > 0), true);
        await page.locator('#open-html_svg').click();
        const category = page.locator('#panel-html_svg');
        assert.equal(await category.isVisible(), true);
        assert.equal(await category.locator('[id^=readme-] h1').count(), 1);
        assert.equal(await category.locator('iframe').count(), 0);
        assert.equal(await page.locator('.runner-list .runner-list a').count(),
            families.reduce((total, family) => total + family.examples.length, 0));
        await page.locator('#runner-theme').selectOption('dark');
        await page.locator('#open-e06').click();
        const formFrame = page.frame({name: 'example-e06'});
        await formFrame.waitForURL(`**/${integration}/e06`);
        await formFrame.waitForFunction(() => window.gramlot?.state === 'started');
        await formFrame.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
        assert.equal(await formFrame.locator('html').getAttribute('data-theme'), 'dark', 'New frames inherit theme');
        await page.locator('#runner-theme').selectOption('light');
        await formFrame.waitForFunction(() => document.documentElement.dataset.theme === 'light');
        assert.equal(await formFrame.locator('html').getAttribute('data-theme'), 'light', 'Loaded frames follow theme');
        await formFrame.locator('#name').fill('Preserve this input');
        const instance = await formFrame.evaluate(() => window.gramlot.pageId);
        const panelCode = page.locator('#panel-e06 code[id^=code-]');
        const sourceResponse = await context.request.get(`${url}/pages/html_svg/06_forms.${integration === 'py' ? 'py' : 'js'}`);
        assert.equal(await panelCode.textContent(), await sourceResponse.text(), 'Exact integration source is displayed');
        assert.ok(await panelCode.locator('.hljs-keyword').count() > 0, 'Code is syntax highlighted');
        const divider = page.locator('#panel-e06 [id^=divider-]');
        await divider.focus();
        const initialRatio = Number(await divider.getAttribute('aria-valuenow'));
        assert.equal(initialRatio, 65, 'Preview starts at 65 percent');
        await page.keyboard.press('ArrowRight');
        assert.ok(Number(await divider.getAttribute('aria-valuenow')) > initialRatio);
        const dividerBox = await divider.boundingBox();
        await page.mouse.move(dividerBox.x + dividerBox.width / 2, dividerBox.y + dividerBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(dividerBox.x - 100, dividerBox.y + dividerBox.height / 2, {steps: 8});
        await page.mouse.up();
        const selectedRatio = await divider.getAttribute('aria-valuenow');
        assert.ok(Number(selectedRatio) < initialRatio, 'Dragging changes preview proportion');

        await page.locator('#open-e12').click();
        await page.frame({name: 'example-e12'}).waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('[role=tab]:visible').count(), 4);
        await page.locator('#tab-e06').click();
        assert.equal(await formFrame.locator('#name').inputValue(), 'Preserve this input');
        assert.equal(await divider.getAttribute('aria-valuenow'), selectedRatio, 'Tab changes preserve split position');
        assert.equal(await formFrame.evaluate(() => window.gramlot.pageId), instance, 'Frame was not reloaded');
        await page.locator('#open-e06').click();
        assert.equal(await page.locator('[role=tab]:visible').count(), 4, 'Reopen reuses the tab');
        const panel = page.locator('#panel-e06');
        assert.equal(await panel.isVisible(), true);
        assert.match(await panel.locator('.runner-explanation').innerText(), /Reset/);
        const descriptionBox = await panel.locator('.runner-explanation').boundingBox();
        const frameBox = await panel.locator('iframe').boundingBox();
        const codeBox = await panelCode.boundingBox();
        assert.ok(frameBox.x + frameBox.width <= codeBox.x + 1, 'Code is to the right of preview');
        assert.ok(descriptionBox.y + descriptionBox.height <= frameBox.y + 1, 'Explanation sits above frame');
        const paths = await page.locator('iframe[src]').evaluateAll(frames => frames.map(f => new URL(f.src).pathname));
        assert.ok(paths.every(path => path.startsWith(`/${integration}/`)), 'Integration owns language');
        await page.locator('#open-e13').click();
        await page.frame({name: 'example-e13'}).waitForFunction(() => window.gramlot?.state === 'started');
        await page.locator('#tab-e06').click();
        const keyboard = page.locator('#keyboard-navigation');
        assert.equal(await keyboard.isChecked(), false);
        assert.equal(await page.locator('#tab-e06').getAttribute('tabindex'), '-1');
        await keyboard.check();
        assert.equal(await page.locator('#tab-e06').getAttribute('tabindex'), '0');
        await page.locator('#tab-e06').focus();
        await page.keyboard.press('End');
        assert.equal(await page.locator('#tab-e13').getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('.runner-resources').count(), 0);
        assert.equal(await panel.locator('[id^=readme-] h1').count(), 1);
        await keyboard.uncheck();
        const links = await page.locator('a[href^="/pages/"]').evaluateAll(nodes => [...new Set(nodes.map(a => a.getAttribute('href')))]);
        for (const link of links) assert.equal((await context.request.get(`${url}${link}`)).status(), 200, link);
        await page.evaluate(() => {
            const renderer = window.gramlot.renderer;
            const node = renderer.elements.get(document.getElementById('runner')).node;
            renderer.freeze(node);
            renderer.unfreeze(node);
        });
        await page.waitForSelector('#code-e01.hljs', {state: 'attached'});
        assert.equal(await page.locator('#panel-e13').isVisible(), true);
        assert.equal(await divider.getAttribute('aria-valuenow'), selectedRatio);
        await page.locator('#open-e06').click();
        assert.equal(await page.locator('#panel-e06').isVisible(), true);
        await toggleFamily('html_svg');
        assert.equal(await isOpen('html_svg'), false, 'The summary marker closes a family');
        await page.locator('#tab-e06').click();
        assert.equal(await isOpen('html_svg'), true, 'Selecting an example opens its family');
        for (const {key} of bound) {
            await page.locator(`#open-${key}`).click();
            assert.equal(await page.locator(`#panel-${key}`).isVisible(), true);
            assert.equal(await isOpen(key), true, 'The family link opens its family');
            await toggleFamily(key);
            assert.equal(await isOpen(key), false, 'The summary marker closes a family');
            await page.locator(`#open-${key}`).click();
            assert.equal(await isOpen(key), true, 'The family link opens its family');
        }
        for (const family of bound) {
            await page.locator(`#open-${family.key}`).click();
            assert.equal(await page.locator(`#panel-${family.key} [id^=readme-] h1`).count(), 1);
            for (const {key, folder} of family.examples) {
                await page.locator(`#open-${key}`).click();
                const frame = page.frame({name: `example-${key}`});
                await frame.waitForURL(`**/${integration}/${key}`);
                await frame.waitForFunction(() => window.gramlot?.state === 'started');
                const logic = page.locator(`#logic-${key}`);
                if (await logic.count()) {
                    const response = await context.request.get(`${url}/pages/${family.key}/${folder}_aux.js`);
                    assert.equal(await logic.textContent(), await response.text(), `${key}: companion shown`);
                }
            }
        }
        console.log(`${integration} runner: IDs, navigation, frame state, themes, resizing, keyboard, reattachment and every binding/controllers example passed`);
    }
    await page.screenshot({path: `${output}/runner-light.png`, fullPage: true});
    await page.locator('#runner-theme').selectOption('dark');
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(247, 248, 245)');
    await page.screenshot({path: `${output}/runner-dark.png`, fullPage: true});
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: `${output}/runner-narrow.png`, fullPage: true});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Runner must fit narrow viewport');
    assert.deepEqual(errors, [], 'Browser errors or failed local assets');
    const count = 24 + 2 * bound.reduce((total, family) => total + family.examples.length, 0);
    console.log(`PASS: ${count} pages; language parity; native controls; runner navigation; light/dark/narrow smoke checks.`);
} finally {
    await browser.close();
}
