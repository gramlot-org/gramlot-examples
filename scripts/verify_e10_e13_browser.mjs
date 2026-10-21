/**
 * Open examples e10 and e13 in Chromium through a served folder of `html_svg` pages:
 * `node scripts/verify_e10_e13_browser.mjs <base URL> [<base URL> ...]`, one base per server
 * (the Python and the JavaScript pages through the core GramlotFileServer of `serve_pages.py` and `serve_pages.mjs`).
 * The renderers run in the browser: a page they refuse stops in the state `failed`.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const bases = process.argv.slice(2);
if (!bases.length) throw new Error('Pass at least one base URL');

async function open(browser, url, {timers = false} = {}) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (timers) {
        await page.addInitScript(() => {
            const start = window.setInterval.bind(window), stop = window.clearInterval.bind(window);
            window.activeTimers = new Set();
            window.setInterval = (...args) => { const id = start(...args); window.activeTimers.add(id); return id; };
            window.clearInterval = id => { window.activeTimers.delete(id); stop(id); };
        });
    }
    await page.goto(url);
    await started(page, errors);
    return {page, errors};
}

async function started(page, errors) {
    await page.waitForFunction(() => ['started', 'failed'].includes(window.gramlot?.state));
    assert.equal(await page.evaluate(() => window.gramlot.state), 'started', `${page.url()}: ${errors.join('; ')}`);
}

/** e10: each × button removes its labelled card from the Source; reload restores the cards. */
async function cards(browser, base) {
    const {page, errors} = await open(browser, `${base}/04-page_composition/01-cards_with_icons`);
    assert.equal(await page.locator('.icon-cards article').count(), 3);
    // The × buttons are HTML buttons whose inline code reaches the Source through `this`, not through the window global.
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('.card-remove')].map(button => ({
        tag: button.localName, global: /window\.gramlot/.test(window.gramlot.dom.getBaseSourceNode(button).getAttr('connect_onclick'))}))),
        [{tag: 'button', global: false}, {tag: 'button', global: false}, {tag: 'button', global: false}]);
    await page.evaluate(() => {
        window.originalCards = window.gramlot.src.builder.source.getItem('main.main_content.cards');
        window.originalSibling = document.querySelector('.icon-cards article');
        window.removedCard = window.originalCards.getNode('drawing');
        window.recordCount = window.gramlot.src.renderer.records.size;
    });
    await page.getByRole('button', {name: 'Remove Drawing', exact: true}).click();
    assert.equal(await page.locator('.icon-cards article').count(), 2);
    assert.deepEqual(await page.evaluate(() => ({
        labels: window.originalCards.getNodes().map(node => node.label),
        sameSource: window.originalCards === window.gramlot.src.builder.source.getItem('main.main_content.cards'),
        sameSibling: window.originalSibling === document.querySelector('.icon-cards article'),
        removedRecord: !window.gramlot.src.renderer.records.has(window.removedCard),
        fewerRecords: window.gramlot.src.renderer.records.size < window.recordCount,
    })), {labels: ['structure', 'reading'], sameSource: true, sameSibling: true,
        removedRecord: true, fewerRecords: true});
    await page.getByRole('button', {name: 'Remove Structure', exact: true}).click();
    await page.getByRole('button', {name: 'Remove Reading', exact: true}).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.icon-cards article').count(), 0);
    assert.equal(await page.evaluate(() => window.originalCards.getNodes().length), 0);
    await page.reload();
    await started(page, errors);
    assert.equal(await page.locator('.icon-cards article').count(), 3);
    assert.deepEqual(errors, []);
    await page.close();
}

/** e13: the buttons create, update and remove Source nodes; the `_timing` controller of the animation ends with its section. */
async function playground(browser, base) {
    const {page, errors} = await open(browser, `${base}/05-live_source`, {timers: true});
    // The animation is a controller with `_timing`, not a Source script; no inline code reads the window global.
    assert.deepEqual(await page.evaluate(() => {
        const source = window.gramlot.src.source;
        const motion = source.getItem('main.main_content.motion').getNodes();
        const handlers = [...document.querySelectorAll('button')].map(button => window.gramlot.dom.getBaseSourceNode(button).getAttr('connect_onclick'));
        return {scripts: document.querySelectorAll('script:not([src]):not([type])').length,
            controller: motion.filter(node => node.nodeTag === 'dataController').map(node => [node.getAttr('func'), node.getAttr('_timing')]),
            globals: handlers.filter(code => /window\.gramlot/.test(code)).length, handlers: handlers.length};
    }), {scripts: 0, controller: [['animate', 0.05]], globals: 0, handlers: 6});
    const list = page.locator('.live-items li');
    assert.equal(await list.count(), 2);
    await page.getByRole('button', {name: 'Add item', exact: true}).click();
    assert.equal(await list.count(), 3);
    assert.equal(await page.evaluate(() => window.gramlot.src.source.getItem('main.main_content.work.items').getNodes().length), 3);
    await page.getByRole('button', {name: 'Remove last', exact: true}).click();
    assert.equal(await list.count(), 2);
    await page.getByRole('button', {name: 'Clear list', exact: true}).click();
    await page.getByRole('button', {name: 'Remove last', exact: true}).click();
    assert.equal(await list.count(), 0);
    await page.getByRole('button', {name: 'Add item', exact: true}).click();
    assert.equal(await list.count(), 1);
    await page.getByRole('button', {name: 'Change heading', exact: true}).click();
    assert.equal(await page.locator('h1').innerText(), 'Source is alive!');
    const initial = await page.locator('circle').getAttribute('cx');
    await page.waitForFunction(value => document.querySelector('circle').getAttribute('cx') !== value, initial);
    assert.equal(await page.evaluate(() => String(window.gramlot.src.source.getNode('main.main_content.motion.scene.ball').getAttr('cx'))
        === document.querySelector('circle').getAttribute('cx')), true);
    await page.getByRole('button', {name: 'Change ball color', exact: true}).click();
    assert.equal(await page.locator('circle').getAttribute('fill'), 'var(--gramlot-warning)');
    assert.equal(await page.evaluate(() => window.activeTimers.size), 1);
    await page.getByRole('button', {name: 'Remove animation', exact: true}).click();
    assert.equal(await page.locator('svg').count(), 0);
    assert.equal(await page.evaluate(() => window.activeTimers.size), 0);
    await page.reload();
    await started(page, errors);
    assert.equal(await page.evaluate(() => window.activeTimers.size), 1);
    await page.evaluate(() => window.gramlot.dispose());
    assert.equal(await page.evaluate(() => window.activeTimers.size), 0);
    assert.deepEqual(errors, []);
    await page.close();
}

const browser = await chromium.launch({headless: true});
try {
    for (const base of bases) {
        await cards(browser, base);
        console.log(`PASS ${base}/04-page_composition/01-cards_with_icons: Source removal, DOM cleanup, sibling identity, keyboard and reload`);
        await playground(browser, base);
        console.log(`PASS ${base}/05-live_source: insert, delete, clear, text, SVG, animation and timer cleanup`);
    }
} finally {
    await browser.close();
}
