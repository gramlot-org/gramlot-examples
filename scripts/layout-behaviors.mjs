/** Small behavioral checks for every container lesson; detailed geometry has dedicated suites. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url), 'utf8'));
const carouselDemos = catalog.families.flatMap(family => family.examples).filter(example => example.key !== 'l08');

async function edit(page, selector, value) {
    const field = page.locator(selector);
    await field.fill(value);
    await field.press('Tab');
    return field;
}
async function range(page, selector, value) {
    await page.locator(selector).evaluate((input, value) => {
        input.value = String(value);
        input.dispatchEvent(new Event('input', {bubbles: true}));
    }, value);
}
export const layoutBehaviors = {
    async l01(page) {
        await edit(page, '#customer-name input', 'Grace');
        assert.equal(await page.locator('#accepted-name').textContent(), 'Grace');
        const splitter = page.locator('#border-demo .separator[data-side=left]').first();
        await splitter.focus(); await splitter.press('ArrowRight');
        assert.equal(await page.locator('#customer-name input').inputValue(), 'Grace');
    },
    async l02(page) {
        const note = await edit(page, '#nested-note textarea', 'Retained after layout change');
        await page.locator('#design .toggle').click();
        await page.getByRole('option', {name: 'Sidebar', exact: true}).click();
        assert.equal(await note.inputValue(), 'Retained after layout change');
    },
    async l03(page) {
        await range(page, '#rounded-slider input', 12);
        for (const id of ['rounded-border', 'rounded-inner']) {
            assert.equal(await page.locator('#' + id).evaluate(el => getComputedStyle(el).borderTopLeftRadius), '12px');
        }
    },
    async l04(page) {
        const note = await edit(page, '#handles-note input', 'Retained drawer value');
        const handle = page.locator('#handles-demo .separator[data-side=left] .drawer').first();
        await handle.click(); assert.equal(await handle.getAttribute('aria-expanded'), 'false');
        await handle.click(); assert.equal(await note.inputValue(), 'Retained drawer value');
    },
    async l05(page) {
        await edit(page, '#lab-customer input', 'Grace Hopper');
        await range(page, '#lab-radius input', 18);
        assert.equal(await page.locator('#lab-outer').evaluate(el => getComputedStyle(el).borderTopLeftRadius), '18px');
        assert.equal(await page.locator('#lab-customer input').inputValue(), 'Grace Hopper');
        const regions = [
            ['lab-outer', 'outer.top', 'top'], ['lab-outer', 'outer.bottom', 'bottom'],
            ['lab-outer', 'outer.left', 'left'], ['lab-outer', 'outer.right', 'right'],
            ['lab-workspace', 'workspace.left', 'left'], ['lab-workspace', 'workspace.bottom', 'bottom'],
            ['lab-editor', 'editor.bottom', 'bottom'],
        ];
        for (const [id, path, side] of regions) {
            const slider = page.locator('#size-' + path.replace('.', '-') + ' input');
            const separator = page.locator('#' + id + ' .separator[data-side=' + side + ']').first();
            const before = Number(await slider.inputValue());
            await separator.focus();
            await separator.press(['top', 'bottom'].includes(side) ? 'ArrowDown' : 'ArrowRight');
            const expected = before + (['left', 'top'].includes(side) ? 1 : -1);
            assert.equal(await page.evaluate(path => gramlot.data.getItem('regions.' + path), path), expected);
            assert.equal(Number(await slider.inputValue()), expected);
            await range(page, '#size-' + path.replace('.', '-') + ' input', before);
            assert.equal(await page.locator('#' + id).evaluate((el, side) => el.control.style.getPropertyValue('--' + side), side), before + 'px');
            await page.evaluate(({path, value}) => gramlot.data.setItem('regions.' + path, value), {path, value: before + 0.37});
            assert.equal(await page.evaluate(path => gramlot.data.getItem('regions.' + path), path), before, 'The slider quantizes external Data');
            assert.equal(Number(await slider.inputValue()), before);
            assert.equal(await page.locator('#' + id).evaluate((el, side) => el.control.style.getPropertyValue('--' + side), side), before + 'px');
        }
        // Assert writeback before pointerup: synchronization must be live.
        const separator = page.locator('#lab-outer .separator[data-side=left]').first();
        await separator.scrollIntoViewIfNeeded();
        const box = await separator.boundingBox();
        const before = Number(await page.locator('#size-outer-left input').inputValue());
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 20.73, box.y + box.height / 2, {steps: 4});
        const size = await page.evaluate(() => gramlot.data.getItem('regions.outer.left'));
        assert(size > before, 'Dragging must update Data before release');
        assert(Number.isInteger(size), 'The slider corrects fractional splitter writes');
        assert.equal(await page.locator('#lab-outer').evaluate(el => el.control.style.getPropertyValue('--left')), size + 'px');
        assert.equal(Number(await page.locator('#size-outer-left input').inputValue()), size);
        await page.mouse.up();
        assert.equal(await page.locator('#lab-customer input').inputValue(), 'Grace Hopper');
    },
    async l06(page) {
        await page.locator('#events-border .separator[data-side=left] .drawer').first().click();
        assert.equal(await page.evaluate(() => gramlot.data.getItem('events.drawerCount')), 1);
        assert.deepEqual(JSON.parse(await page.locator('#events-drawer-payload').textContent()), {open: false, region: 'left'});
    },
    async l07(page) {
        const tabs = page.locator('#tabs-demo');
        await tabs.getByRole('tab', {name: /Notes/}).click();
        await edit(page, '#tabs-notes textarea', 'Retained notes');
        await tabs.getByRole('tab', {name: /Customer/}).click();
        await tabs.getByRole('tab', {name: /Notes/}).click();
        assert.equal(await page.locator('#tabs-notes textarea').inputValue(), 'Retained notes');
        assert.equal(await page.locator('#tab-variants gramlot-tab-container').count(), 8);
    },
    async l09(page) {
        await page.locator('gramlot-textbox input').first().fill('Shared draft');
        await page.locator('gramlot-textbox input').first().press('Tab');
        await page.click('#mela-open-dialog');
        await page.locator('#mela-dialog dialog[open]').waitFor();
        assert.equal(await page.locator('#mela-dialog gramlot-textbox input').inputValue(), 'Shared draft');
        await page.locator('#mela-dialog').getByText('Done', {exact: true}).click();
        await page.waitForFunction(() => !gramlot.data.getItem('mela.dialogOpen'));
        await page.click('#mela-open-floating');
        await page.locator('#mela-floating gramlot-textbox input').waitFor({state:'visible'});
        assert.equal(await page.locator('#mela-floating gramlot-textbox input').inputValue(), 'Shared draft');
        await page.locator('#mela-floating').getByText('Done', {exact: true}).click();
        await page.waitForFunction(() => !gramlot.data.getItem('mela.floatingOpen'));
    },
    async l08(page) {
        await range(page, '#stack-panel input', carouselDemos.findIndex(example => example.key === 'e02'));
        await page.waitForFunction(() => gramlot.data.getItem('stackDemo.active') === 'e02');
        await page.frameLocator('#live-e02').locator('#gramlot-root > *').first().waitFor();
        assert.equal(await page.locator('#stack-active-title').textContent(), await page.evaluate(() => gramlot.data.getItem('stackDemo.activeCaption')));
        assert.ok(await page.locator('#stack-active-title').textContent());
    },
};
