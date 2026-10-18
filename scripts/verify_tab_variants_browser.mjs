import assert from 'node:assert/strict';
const {chromium, webkit} = await import(process.argv[2]);
const base = process.argv[3];
async function checkAlignment(tabs, position, align) {
    const bounds = await tabs.evaluate(element => {
        const strip = element.shadowRoot.querySelector('.tabs');
        const entries = [...strip.querySelectorAll('.tab-entry')];
        const style = getComputedStyle(strip);
        const vertical = strip.getAttribute('aria-orientation') === 'vertical';
        const rect = strip.getBoundingClientRect();
        const first = entries[0].getBoundingClientRect();
        const last = entries.at(-1).getBoundingClientRect();
        return vertical
            ? {leading: first.top - rect.top - parseFloat(style.paddingTop),
               trailing: rect.bottom - last.bottom - parseFloat(style.paddingBottom),
               overflow: strip.scrollHeight > strip.clientHeight}
            : {leading: first.left - rect.left - parseFloat(style.paddingLeft),
               trailing: rect.right - last.right - parseFloat(style.paddingRight),
               overflow: strip.scrollWidth > strip.clientWidth};
    });
    const detail = JSON.stringify({position, align, ...bounds});
    if (bounds.overflow || align === 'start') assert(Math.abs(bounds.leading) <= 2, detail);
    else if (align === 'end') assert(Math.abs(bounds.trailing) <= 2, detail);
    else assert(Math.abs(bounds.leading - bounds.trailing) <= 2, detail);
}

for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
        const page = await browser.newPage({viewport: {width: 1500, height: 1100}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base);
        await page.waitForFunction(() => window.gramlot?.data.getItem('galleryIndex.opened.intro') === true);
        await page.locator('#open-layout').click();
        await page.locator('#open-l07').click();
        const frame = page.frameLocator('#frame-l07');
        await frame.locator('#tab-variants').waitFor();
        for (const appearance of ['mimi', 'joanna']) {
            await page.locator('#gallery-settings-toggle').click();
            await page.locator('#index-appearance').selectOption(appearance);
            await page.locator('#index-theme').selectOption(appearance === 'mimi' ? 'light' : 'dark');
            await page.getByRole('button', {name: 'Close settings', exact: true}).click();
            for (const position of ['top', 'bottom', 'left', 'right']) {
                for (const mode of ['tabs', 'underline']) {
                    const tabs = frame.locator(`#tabs-variant-${mode}-${position}`);
                    for (const align of ['start', 'center', 'end']) {
                        await tabs.evaluate((element, align) => {
                            const app = element.ownerDocument.defaultView.gramlot;
                            app.src.renderer.elements.get(element).node.setAttr({tabAlign: align});
                        }, align);
                        await checkAlignment(tabs, position, align);
                    }
                    await tabs.evaluate(element => {
                        const app = element.ownerDocument.defaultView.gramlot;
                        app.src.renderer.elements.get(element).node.setAttr({width: '90px', height: '60px'});
                    });
                    await checkAlignment(tabs, position, 'end');
                    await tabs.getByRole('tab', {name: 'Profile', exact: true}).focus();
                    await page.keyboard.press('End');
                    assert.equal(await tabs.getByRole('tab', {name: 'Activity', exact: true}).getAttribute('aria-selected'), 'true');
                    await page.keyboard.press('Home');
                    assert.equal(await tabs.getByRole('tab', {name: 'Profile', exact: true}).getAttribute('aria-selected'), 'true');
                    await tabs.evaluate(element => {
                        const app = element.ownerDocument.defaultView.gramlot;
                        app.src.renderer.elements.get(element).node.setAttr({width: '100%', height: '240px', tabAlign: 'start'});
                    });
                    const tablist = tabs.getByRole('tablist');
                    assert.equal(await tablist.getAttribute('aria-orientation'), ['left', 'right'].includes(position) ? 'vertical' : 'horizontal');
                    await tabs.getByRole('tab', {name: 'Messages', exact: false}).click();
                    await tabs.locator('textarea').fill(`Message from ${appearance}`);
                    await tabs.locator('textarea').press('Tab');
                    await tabs.getByRole('tab', {name: 'Profile', exact: true}).click();
                    assert.equal(await tabs.locator('input').count(), 1);
                }
            }
            for (const position of ['top', 'left']) {
                for (const align of ['start', 'center', 'end']) {
                    await checkAlignment(frame.locator(`#tabs-variant-align-${position}-${align}`), position, align);
                }
            }
            await frame.locator('#tab-alignment').scrollIntoViewIfNeeded();
            await page.screenshot({path: `/tmp/tab-align-${appearance}-${name}.png`});
            await frame.locator('#variant-name-tabs-top input').fill(`Name ${appearance}`);
            await frame.locator('#variant-name-tabs-top input').press('Tab');
            assert.equal(await frame.locator('#variant-name-underline-right input').inputValue(), `Name ${appearance}`);
            await frame.locator('#tab-variants').scrollIntoViewIfNeeded();
            await page.screenshot({path: `/tmp/tab-variants-${appearance}-${name}.png`});
        }
        await page.setViewportSize({width: 390, height: 844});
        await frame.locator('#tab-variants').scrollIntoViewIfNeeded();
        assert(await frame.locator('body').evaluate(e => e.scrollWidth <= e.ownerDocument.defaultView.innerWidth), 'No phone horizontal overflow');
        const mobileTabs = frame.locator('#tabs-variant-underline-right');
        await mobileTabs.getByRole('tab', {name: 'Messages', exact: false}).click();
        assert.equal(await mobileTabs.locator('textarea').inputValue(), 'Message from joanna');
        await page.screenshot({path: `/tmp/tab-variants-phone-${name}.png`});
        assert.deepEqual(errors, []);
        console.log(`${name}: 14 variants, all alignments/modes/positions, safe overflow and keyboard, both themes, shared edits and phone width passed`);
    } finally { await browser.close(); }
}
