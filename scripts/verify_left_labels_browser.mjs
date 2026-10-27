import {galleryRow} from './gallery-navigation.mjs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, ...urls] = process.argv.slice(2);
const {chromium, webkit} = await import(pathToFileURL(entry));
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch({headless: true});
    try {
        for (const url of urls) {
            const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(url);
            const settings = async position => {
                await page.locator('.drawer[aria-label="Open bottom region"]').click();
                await page.locator('#gallery-label-position').selectOption(position);
                await page.locator('.drawer[aria-label="Close bottom region"]').click();
            };
            await galleryRow(page, 'w04');
            await (await galleryRow(page, 'w04')).click();
            const notes = page.frameLocator('#frame-w04');
            await notes.locator('#notes textarea').fill('Preserve these notes');
            const originalPadding = await notes.locator('#notes .labelbox').evaluate(el => getComputedStyle(el).padding);
            await settings('L');
            const aligned = async (frame, first, second, control) => {
                await frame.locator(`#${first} .labelbox[data-position=L]`).waitFor();
                await frame.locator(`#${first}`).evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                const a = await frame.locator(`#${first} ${control}`).boundingBox();
                const b = await frame.locator(`#${second} ${control}`).boundingBox();
                assert(Math.abs(a.x - b.x) < 1, `unaligned ${first}/${second}: ${a.x}, ${b.x}`);
                for (const id of [first, second]) {
                    assert.equal(await frame.locator(`#${id} .label-box`).evaluate(el => getComputedStyle(el).textAlign), 'right');
                }
            };
            await aligned(notes, 'notes', 'notes-copy', 'textarea');
            assert.equal(await notes.locator('#notes .labelbox').evaluate(el => getComputedStyle(el).padding), originalPadding);
            assert.equal(await notes.locator('#notes-copy textarea').inputValue(), 'Preserve these notes');
            await page.locator('#preview-mobile-w04').click();
            await notes.locator('html[data-gramlot-touch=on]').waitFor();
            await aligned(notes, 'notes', 'notes-copy', 'textarea');
            assert.equal(await notes.locator('body').evaluate(el => el.scrollWidth > el.ownerDocument.documentElement.clientWidth), false);
            await page.screenshot({path: `/tmp/left-labels-${name}-${new URL(url).port || 'static'}.png`});
            await settings('TL');
            await notes.locator('#notes .labelbox[data-position=TL]').waitFor();
            assert.equal(await notes.locator('#notes .labelbox').evaluate(el => getComputedStyle(el).padding), originalPadding);
            assert.equal(await notes.locator('#notes textarea').inputValue(), 'Preserve these notes');
            await settings('L');
            for (const [key, first, second] of [['w01', 'customer', 'customer-copy'], ['w02', 'newsletter', 'newsletter-copy']]) {
                await (await galleryRow(page, key)).click();
                await aligned(page.frameLocator(`#frame-${key}`), first, second, 'input');
            }
            // The library aligns intrinsic labels; the gallery supplies no label widths.
            await (await galleryRow(page, 'w19')).click();
            const form = page.frameLocator('#frame-w19');
            await form.locator('#first-name .labelbox[data-position=L]').waitFor();
            const spacing = await form.locator('#first-name').evaluate(host => {
                const label = host.shadowRoot.querySelector('label');
                const box = host.shadowRoot.querySelector('.labelbox');
                const labelBox = host.shadowRoot.querySelector('.label-box');
                const control = host.shadowRoot.querySelector('input');
                return {actual: control.getBoundingClientRect().left - label.getBoundingClientRect().right,
                    expected: parseFloat(getComputedStyle(box).columnGap) + parseFloat(getComputedStyle(labelBox).paddingRight)};
            });
            assert(Math.abs(spacing.actual - spacing.expected) <= 1, `unexpected formlet label gap: ${JSON.stringify(spacing)}`);
            await settings('example');
            assert.equal(await form.locator('#first-name #field-label').evaluate(el => el.style.width), '');
            await page.locator('#tab-w04').click();
            await notes.locator('#notes .labelbox[data-position=TL]').waitFor();
            assert.equal(await notes.locator('#notes .labelbox').evaluate(el => getComputedStyle(el).padding), originalPadding);
            assert.equal(await notes.locator('#notes-copy textarea').inputValue(), 'Preserve these notes');
            assert.deepEqual(errors, []);
            console.log(`PASS ${name} ${url}: textarea/textbox/checkbox columns, right labels, mobile fit, Data and authored layout preserved`);
            await page.close();
        }
    } finally { await browser.close(); }
}
