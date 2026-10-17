import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry, ...urls] = process.argv.slice(2);
const {chromium, webkit} = await import(pathToFileURL(entry));
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch({headless: true});
    try {
        for (const url of urls) {
            const page = await browser.newPage({viewport: {width: 1440, height: 1000}}), errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(url);
            await page.locator('details').filter({has: page.locator('#open-w11')}).locator('summary').first().click();
            for (const [key, id, toggle, popup] of [
                ['w11', 'date', '.calendar-toggle', '.calendar-popup'],
                ['w13', 'choice', '.toggle', '.choices'],
            ]) {
                await page.locator(`#open-${key}`).click();
                const frame = page.frameLocator(`#frame-${key}`);
                const input = frame.locator(`#${id} input`), button = frame.locator(`#${id} ${toggle}`);
                await input.waitFor();
                for (const theme of ['base', 'compact', 'mimi', 'joanna']) {
                    await page.locator('#gallery-settings-toggle').click();
                    await page.locator('#index-appearance').selectOption(theme);
                    await page.locator('#index-theme').selectOption('dark');
                    await page.locator('#gallery-label-position').selectOption('L');
                    await page.locator('[aria-label="Close settings"]').click();
                    for (const mode of ['normal', 'mobile']) {
                        await page.locator(`#preview-${mode}-${key}`).click();
                        await frame.locator(`html[data-gramlot-touch=${mode === 'mobile' ? 'on' : 'off'}]`).waitFor();
                        const a = await input.boundingBox(), b = await button.boundingBox();
                        assert(b.x >= a.x && b.y >= a.y - 1 && b.x + b.width <= a.x + a.width + 1 && b.y + b.height <= a.y + a.height + 1,
                            `${name}/${theme}/${mode}: icon must stay inside the input (${JSON.stringify({a,b})})`);
                        assert(await input.evaluate(el => parseFloat(getComputedStyle(el).paddingRight)) >= b.width,
                            `${name}/${key}/${theme}/${mode}: padding=${await input.evaluate(el=>getComputedStyle(el).paddingRight)}, icon=${b.width}`);
                        if (mode === 'mobile') assert(b.width >= 44 && b.height >= 44);
                        await button.click(); await frame.locator(`#${id} ${popup}`).waitFor({state: 'visible'});
                        await page.keyboard.press('Escape');
                        await frame.locator(`#${id} ${popup}`).waitFor({state: 'hidden'});
                        if (key === 'w11') {
                            assert.equal(await frame.locator('#date-copy .calendar-toggle').isVisible(), false);
                            assert(await frame.locator('#date-copy input').evaluate(el => parseFloat(getComputedStyle(el).paddingRight)) < b.width);
                        }
                    }
                }
                if (key === 'w11') await page.screenshot({path: `/tmp/inset-calendar-${name}-${new URL(url).port || 'static'}.png`});
            }
            assert.deepEqual(errors, []);
            console.log(`PASS ${name} ${url}: inset calendar/choice icons, reserved text, four themes, normal/touch, open/Escape, calendar opt-out`);
            await page.close();
        }
    } finally { await browser.close(); }
}
