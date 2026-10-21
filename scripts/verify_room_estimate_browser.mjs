// Verify the baseline and three independent source variants from the downloadable project.
import assert from 'node:assert/strict';
const {chromium, webkit} = await import(process.env.GRAMLOT_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.GRAMLOT_EXAMPLE_URL || 'http://127.0.0.1:8262/';
for (const engine of [chromium, webkit]) {
    const executablePath = engine === chromium ? process.env.GRAMLOT_CHROMIUM_EXECUTABLE : process.env.GRAMLOT_WEBKIT_EXECUTABLE;
    const browser = await engine.launch(executablePath ? {executablePath} : {});
    try {
        const page = await browser.newPage({viewport: {width: 680, height: 900}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const open = async route => {
            await page.goto(base + route);
            await page.locator('#guests input').waitFor();
            await page.waitForFunction(() => document.querySelector('#total')?.textContent === 'Stay total · €270');
        };
        const edit = async (id, value) => {
            const field = page.locator(`#${id} input`);
            await field.click(); await field.press('ControlOrMeta+A');
            await field.pressSequentially(value); await field.press('Tab');
        };
        const expect = async (id, amount) => {
            await page.waitForFunction(({id, amount}) => document.getElementById(id)?.textContent.endsWith(`€${amount}`), {id, amount});
        };
        const chain = async (rate, extra, nightly, subtotal, discount, total, deposit) => {
            for (const [id, amount] of Object.entries({rate, extra, nightly, subtotal, discount, total, deposit})) await expect(id, amount);
        };
        await open(''); await chain(90, 0, 90, 270, 0, 270, 81);
        await edit('guests', '3'); await chain(90, 25, 115, 345, 0, 345, 104);
        await page.locator('#room .toggle').click();
        await page.getByRole('option', {name: 'Superior', exact: true}).click();
        await chain(140, 25, 165, 495, 0, 495, 149);
        await edit('nights', '7'); await chain(140, 25, 165, 1155, 115.5, 1039.5, 312);
        await page.getByRole('button', {name: 'Prepare summary', exact: true}).click();
        assert.equal(await page.locator('#summary').innerText(), 'Stay estimate: €1039.5');
        await edit('guests', '5');
        assert.equal(await page.locator('#guests input').getAttribute('aria-invalid'), 'true');
        await chain(140, 25, 165, 1155, 115.5, 1039.5, 312);
        await edit('guests', '');
        assert.equal(await page.locator('#guests input').getAttribute('aria-invalid'), 'true');
        await edit('guests', '4'); await chain(140, 50, 190, 1330, 133, 1197, 359);
        assert.equal(await page.locator('#summary').innerText(), 'Stay estimate: €1039.5');
        await edit('nights', '6'); await chain(140, 50, 190, 1140, 0, 1140, 342);
        await edit('nights', '31');
        assert.equal(await page.locator('#nights input').getAttribute('aria-invalid'), 'true');
        await expect('total', 1140);
        await page.getByRole('button', {name: 'Prepare summary', exact: true}).click();
        assert.equal(await page.locator('#summary').innerText(), 'Stay estimate: €1140');
        await open('guest_limit'); await edit('guests', '5'); await chain(90, 75, 165, 495, 0, 495, 149);
        await edit('guests', '7'); assert.equal(await page.locator('#guests input').getAttribute('aria-invalid'), 'true'); await expect('total', 495);
        await open('discount'); await edit('nights', '5'); await chain(90, 0, 90, 450, 45, 405, 122);
        await open('supplement'); await edit('guests', '3'); await chain(90, 15, 105, 315, 0, 315, 95);
        await open(''); await page.setViewportSize({width: 390, height: 900});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        assert.deepEqual(errors, []);
        console.log(`${engine.name()}: room selection, seven chained results, discount boundary, rejected drafts, summary snapshot, three edited Pages and mobile passed.`);
    } finally { await browser.close(); }
}
