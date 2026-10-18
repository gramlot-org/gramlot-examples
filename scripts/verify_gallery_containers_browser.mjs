import assert from 'node:assert/strict';
const {chromium, webkit} = await import(process.argv[2]);
const base = process.argv[3] ?? 'http://127.0.0.1:8243';
const sourceLanguage = process.argv[4] ?? 'Python';
for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch({headless: true});
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
        await page.goto(base);
        await page.waitForFunction(() => window.gramlot?.data.getItem('galleryIndex.opened.intro') === true);
        await page.locator('#open-layout').click();
        await page.locator('#open-l04').click();
        const preview = page.locator('#preview-l04');
        const frame = page.frameLocator('#frame-l04');
        const note = frame.locator('#handles-note input');
        await note.fill('Kept across views'); await note.press('Tab');
        const identity = await page.locator('#frame-l04').evaluateHandle(el => ({frame: el, document: el.contentDocument}));
        await preview.getByRole('tab', {name: 'Explanation', exact: true}).click();
        await page.locator('#readme-l04').getByRole('heading', {name: 'Try it', exact: true}).waitFor();
        assert.equal(await page.locator('#frame-l04').isVisible(), false);
        await preview.getByRole('tab', {name: 'Example', exact: true}).click();
        assert.equal(await note.inputValue(), 'Kept across views');
        const border = page.locator('#gallery-regions');
        const left = border.locator('.separator[data-side="left"] > .drawer:visible');
        await left.click();
        await page.waitForFunction(() => document.querySelector('#index-navigation-toggle').getAttribute('aria-expanded') === 'false');
        await page.locator('#index-navigation-toggle').click();
        await page.waitForFunction(() => document.querySelector('#index-navigation-toggle').getAttribute('aria-expanded') === 'true');
        const separator = border.locator('.separator[data-side="left"]:visible');
        await separator.focus(); await separator.press('ArrowRight');
        const resized = await separator.getAttribute('aria-valuenow');
        assert.ok(Number(resized) > 240);
        await page.locator('#index-code-toggle').click();
        await page.locator('#index-code-toggle').click();
        assert.equal(await note.inputValue(), 'Kept across views');
        await page.locator('#open-l07').click(); await page.locator('#index-pages').getByRole('tab', {name: await page.locator('#open-l04').textContent(), exact: true}).click();
        assert.equal(await note.inputValue(), 'Kept across views');
        await page.locator('#open-controllers').click();
        await page.locator('#open-c03').click();
        const sourceTabs = page.locator('#codepane-c03');
        if (sourceLanguage === 'Python') {
            await sourceTabs.getByRole('tab', {name: 'logic.js', exact: true}).click();
            await page.locator('#logic-c03').waitFor({state: 'visible'});
            assert.equal(await page.locator('#code-c03').isVisible(), false);
        } else {
            assert.equal(await sourceTabs.getByRole('tab', {name: 'logic.js', exact: true}).count(), 0);
            assert.match(await page.locator('#code-c03').textContent(), /export class Logic/);
        }
        await sourceTabs.getByRole('tab', {name: sourceLanguage, exact: true}).click();
        await page.locator('#code-c03').waitFor({state: 'visible'});
        await page.locator('#open-l04').click();
        await page.locator('#gallery-settings-toggle').click();
        await page.locator('#gallery-label-position').selectOption('L');
        assert.equal(await page.evaluate(() => gramlot.data.getItem('galleryIndex.labelPosition')), 'L');
        await page.locator('#gallery-label-position').selectOption('example');
        for (const appearance of ['mimi', 'joanna']) {
            await page.locator('#index-appearance').selectOption(appearance);
            await page.locator('#index-theme').selectOption('dark');
            await page.locator('#gallery-settings').getByRole('button', {name: 'Close settings', exact: true}).click();
            await preview.getByRole('tab', {name: 'Explanation', exact: true}).click();
            await page.screenshot({path: `/tmp/gallery-${appearance}-${name}.png`});
            await preview.getByRole('tab', {name: 'Example', exact: true}).click();
            await page.locator('#gallery-settings-toggle').click();
        }
        await page.locator('#gallery-settings').getByRole('button', {name: 'Close settings', exact: true}).click();
        await page.setViewportSize({width: 390, height: 844});
        await page.locator('#gallery-mobile-menu').click();
        await page.locator('#open-binding').click();
        assert.equal(await page.locator('#gallery-mobile-menu').getAttribute('aria-expanded'), 'true');
        await page.locator('#open-l04').click();
        await note.waitFor({state: 'visible'});
        assert.equal(await note.inputValue(), 'Kept across views');
        await page.locator('#gallery-view-code').click();
        await page.locator('#code-l04').waitFor({state: 'visible'});
        await page.locator('#gallery-view-inspector').click();
        await page.locator('#gallery-inspector-panel').waitFor({state: 'visible'});
        await page.locator('#gallery-view-example').click();
        await preview.getByRole('tab', {name: 'Explanation', exact: true}).click();
        await page.locator('#readme-l04').getByRole('heading', {name: 'Try it', exact: true}).waitFor();
        await page.screenshot({path: `/tmp/gallery-phone-${name}.png`});
        await preview.getByRole('tab', {name: 'Example', exact: true}).click();
        assert.equal(await note.inputValue(), 'Kept across views');
        assert.equal(await page.evaluate(ref => ref.frame === document.querySelector('#frame-l04') && ref.document === ref.frame.contentDocument, identity), true);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.setViewportSize({width: 1440, height: 1000});
        await page.locator('#index-code-toggle').waitFor({state:'visible'});
        assert.equal(await note.inputValue(), 'Kept across views');
        await page.waitForFunction(expected => document.querySelector('#gallery-regions').shadowRoot.querySelector('.separator[data-side=left]').getAttribute('aria-valuenow') === expected, resized, {timeout: 3000});
        assert.deepEqual(errors, []);
        console.log(`${name}: gallery drawers, resizing, explanation, themes, mobile navigation/code/inspector and iframe/Data retention passed`);
    } finally { await browser.close(); }
}
