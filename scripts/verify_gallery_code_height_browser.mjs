/** Code fills its panel after viewport changes, detachment and reattachment. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {galleryRow} from './gallery-navigation.mjs';

const [entry, base = 'http://127.0.0.1:8101/'] = process.argv.slice(2);
const {chromium, webkit} = await import(pathToFileURL(entry));
for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
        const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        await (await galleryRow(page, 'w01')).click();
        await page.getByRole('tab', {name: 'Code', exact: true}).click();
        const editor = page.locator('#code-w01');
        await editor.locator('.cm-editor').waitFor();
        const instance = await editor.evaluateHandle(element => element.editor);
        const content = await editor.locator('.cm-content').textContent();
        const fillsPanel = async () => {
            await page.waitForFunction(() => {
                const panel = document.querySelector('#code-panel-w01');
                const control = document.querySelector('#code-w01');
                const p = panel.getBoundingClientRect(), c = control.getBoundingClientRect();
                return c.height > 100 && Math.abs(p.bottom - c.bottom - 3) < 1
                    && Math.abs(p.width - c.width - 6) < 1;
            });
            assert.equal(await editor.evaluate((element, previous) => element.editor === previous, instance), true);
            assert.equal(await editor.locator('.cm-content').textContent(), content);
            assert.equal(await page.locator('#code-panel-w01').evaluate(el => el.scrollHeight <= el.clientHeight + 1), true);
        };
        await fillsPanel();
        for (const viewport of [{width: 1100, height: 700}, {width: 390, height: 844}]) {
            await page.setViewportSize(viewport);
            await fillsPanel();
        }
        await page.setViewportSize({width: 1440, height: 1000});
        await page.getByRole('button', {name: 'Detach Code', exact: true}).click();
        await fillsPanel();
        await page.getByRole('button', {name: 'Close window', exact: true}).click();
        await fillsPanel();
        await page.getByRole('tab', {name: 'Example', exact: true}).click();
        await page.getByRole('tab', {name: 'Code', exact: true}).click();
        await fillsPanel();
        assert.deepEqual(errors, []);
        await page.screenshot({path: `/private/tmp/gallery-code-height-${name}.png`});
        console.log(`PASS ${name}: Code fills desktop/mobile panel, detached and reattached; same editor and content, no outer scrollbar.`);
    } finally {
        await browser.close();
    }
}
