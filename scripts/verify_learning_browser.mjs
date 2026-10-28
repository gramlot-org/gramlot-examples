/** Focused teaching-path check: HTML/components, bound forms and retained tabs. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, base = 'http://127.0.0.1:8101/'] = process.argv.slice(2);
const routes = {w01: 'pages/01-inputs/01-text/01-textbox', b09: 'pages/02-binding/02-editing/03-forms', l07: 'pages/05-containers/02-tabs'};
const {chromium, webkit} = await import(pathToFileURL(entry));

for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
        const page = await browser.newPage({viewport: {width: 1200, height: 900}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const data = path => page.evaluate(path => gramlot.data.getItem(path), path);
        const open = async route => {
            await page.goto(new URL(routes[route], base).href);
            await page.waitForFunction(() => window.gramlot?.data, null, {timeout: 15000});
        };
        await open('w01');
        await page.locator('#customer input').waitFor();
        await page.locator('#customer-html').fill('Grace');
        await page.waitForFunction(() => gramlot.data.getItem('customer') === 'Grace');
        assert.equal(await page.locator('#customer input').inputValue(), 'Grace');
        assert.equal(await page.locator('#customer-copy input').inputValue(), 'Grace');
        await page.locator('#customer input').fill('Ada');
        assert.equal(await page.locator('#customer-html').inputValue(), 'Ada');
        await page.locator('#clear-html').click();
        assert.equal(await data('customer'), '');
        await page.locator('#customer input').fill('Another name');
        await page.locator('#clear-component button').click();
        assert.equal(await page.locator('#customer-html').inputValue(), '');
        await page.getByText('Options · labels and editing', {exact: true}).click();
        await page.getByRole('checkbox', {name: 'Editing', exact: true}).uncheck();
        await page.locator('#customer-html').fill('On change');
        assert.equal(await data('customer'), '');
        await page.locator('#customer-html').press('Tab');
        assert.equal(await data('customer'), 'On change');
        await page.locator('#position').selectOption('L');
        await page.getByRole('checkbox', {name: 'State', exact: true}).check();
        assert.equal(await page.locator('#customer-html').getAttribute('readonly'), '');
        assert.equal(await page.locator('#customer input').getAttribute('readonly'), '');
        await page.getByText('Options · labels and editing', {exact: true}).click();
        await page.screenshot({path: `/private/tmp/learning-comparison-${name}.png`, fullPage: true});
        await page.setViewportSize({width: 390, height: 844});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await page.screenshot({path: `/private/tmp/learning-comparison-mobile-${name}.png`, fullPage: true});

        await open('b09');
        await page.locator('#name').fill('Grace');
        await page.locator('#name').press('Tab');
        assert.equal(await page.locator('#out-name').textContent(), 'Grace');
        await page.locator('#region').selectOption('west');
        assert.equal(await data('form.region'), 'west');
        await page.locator('#topics').selectOption(['html', 'svg']);
        assert.deepEqual(await data('form.topics'), ['html', 'svg']);
        await page.locator('#daily').check();
        assert.equal(await data('form.frequency.weekly'), false);
        assert.equal(await page.locator('input[type=file]').count(), 1);
        assert.equal(await page.getByRole('button', {name: 'Submit unavailable'}).isDisabled(), true);

        await page.setViewportSize({width: 1200, height: 900});
        await open('l07');
        const tabs = page.locator('#tabs-demo');
        await page.locator('#tabs-name input').fill('A');
        const original = await page.locator('#tabs-name input').elementHandle();
        await tabs.getByRole('tab', {name: /^Notes/}).click();
        await page.locator('#tabs-notes textarea').fill('Keep this note');
        await tabs.getByRole('tab', {name: 'Customer', exact: true}).click();
        assert.equal(await page.locator('#tabs-name input').inputValue(), 'A');
        assert.equal(await data('tabsDemo.name'), 'Ada');
        assert.ok(await original.evaluate(el => el.isConnected));
        await page.getByText('Options · presentation, badges and closing', {exact: true}).click();
        await page.locator('#tabs-lock input').check();
        await tabs.getByRole('button', {name: 'Close Notes', exact: true}).click();
        assert.equal(await tabs.getByRole('tab', {name: /^Notes/}).count(), 1);
        await page.locator('#tabs-lock input').uncheck();
        await tabs.getByRole('button', {name: 'Close Notes', exact: true}).click();
        assert.equal(await tabs.getByRole('tab', {name: /^Notes/}).count(), 0);
        assert.equal(await data('tabsDemo.notes'), 'Keep this note');
        await page.getByText('Compare tab styles, positions and alignment', {exact: true}).click();
        assert.equal(await page.locator('[id^="tabs-variant-"]').count(), 14);
        await page.locator('#variant-name-tabs-top input').fill('Shared');
        await page.locator('#variant-name-tabs-top input').press('Tab');
        assert.equal(await page.locator('#variant-name-underline-bottom input').inputValue(), 'Shared');
        assert.deepEqual(errors, []);
        console.log(`PASS ${name}: HTML/component bindings, labels, clear, read only, narrow layout; form values; tab draft identity, close veto, retained Data, 14 variants.`);
    } finally {
        await browser.close();
    }
}
