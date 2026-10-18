import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

const [entry, ...bases] = process.argv.slice(2);
const {chromium, webkit} = await import(pathToFileURL(entry));
const sides = ['top', 'left', 'right', 'bottom'];
const settle = page => page.waitForTimeout(250); // Longer than the default 160ms transition.

async function appearance(handle) {
    return handle.evaluate(element => {
        const style = getComputedStyle(element);
        const content = element.querySelector('.drawer-content');
        const viewport = element.querySelector('.drawer-viewport');
        return {
            width: element.offsetWidth, height: element.offsetHeight,
            contentWidth: content.offsetWidth, contentHeight: content.offsetHeight,
            viewportWidth: viewport.clientWidth, viewportHeight: viewport.clientHeight,
            opacity: getComputedStyle(content).opacity,
            transform: style.transform, duration: style.transitionDuration,
            background: style.backgroundColor, color: style.color,
            border: style.borderTopWidth, shadow: style.boxShadow,
        };
    });
}

function assertFits(metrics) {
    assert(metrics.viewportWidth >= metrics.contentWidth, JSON.stringify(metrics));
    assert(metrics.viewportHeight >= metrics.contentHeight, JSON.stringify(metrics));
}

async function writeRegion(page, side, attrs) {
    await page.evaluate(({side, attrs}) => {
        const child = document.querySelector(`#handles-demo > [slot="${side}"]`);
        gramlot.src.renderer.elements.get(child).node.setAttr(attrs);
    }, {side, attrs});
}

for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
        for (const base of bases) {
            const url = new URL('l04', base).href;
            const page = await browser.newPage({viewport: {width: 1100, height: 850}});
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(url);
            await page.waitForFunction(() => window.gramlot?.state === 'started');
            const border = page.locator('#handles-demo');
            const handle = side => border.locator(`.separator[data-side="${side}"] > .drawer`);
            const input = page.locator('#handles-note input');
            await input.fill('Retained through presentation changes');
            await input.press('Tab');
            const field = await input.boundingBox();

            assert.equal(await handle('top').locator('.drawer-icon').textContent(), '⌕');
            assert.equal(await handle('left').locator('.drawer-label').evaluate(e => getComputedStyle(e).writingMode), 'vertical-rl');
            for (const side of sides) {
                await input.focus();
                await page.mouse.move(0, 0);
                await settle(page);
                const grip = handle(side);
                const rest = await appearance(grip);
                assert.equal(rest.opacity, '0', `${side}: icon and caption minimize together`);
                assert.equal(['left', 'right'].includes(side) ? rest.width : rest.height, 4);
                await grip.hover();
                await settle(page);
                const expanded = await appearance(grip);
                assert.equal(expanded.opacity, '1');
                assertFits(expanded);
                assert.equal(expanded.border, '0px');
                assert.equal(expanded.shadow, 'none');
                assert.deepEqual(await input.boundingBox(), field, 'Hover leaves content geometry unchanged');
            }

            // Real Source projection, both orientations, and a larger font/padding.
            await border.evaluate(e => {
                e.style.setProperty('--gramlot-drawer-font-size', '18px');
                e.style.setProperty('--gramlot-drawer-padding', '6px 10px');
            });
            for (const side of ['left', 'top']) {
                const grip = handle(side);
                for (const [background, expected] of [['#eeeeee', '0.2 0.2 0.2'], ['#333333', '1 1 1']]) {
                    await writeRegion(page, side, {drawer_background: background});
                    await grip.hover();
                    await settle(page);
                    const metrics = await appearance(grip);
                    assertFits(metrics);
                    assert(metrics.color.includes(expected), `Automatic contrast: ${JSON.stringify(metrics)}`);
                }
                await writeRegion(page, side, {drawer_color: '#ff0000'});
                assert.equal((await appearance(grip)).color, 'rgb(255, 0, 0)', 'Explicit foreground wins');
            }
            await page.screenshot({path: `/tmp/drawer-intrinsic-${name}.png`});
            await writeRegion(page, 'left', {drawer_minimize: false});
            await input.focus();
            await page.mouse.move(0, 0);
            await settle(page);
            assert.equal((await appearance(handle('left'))).opacity, '1', 'Explicit non-minimized caption');
            assertFits(await appearance(handle('left')));

            // Dragging a closed drawer opens it without replacing the field or its Data.
            const right = handle('right');
            await right.hover();
            const box = await right.boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2 - 110, box.y + box.height / 2, {steps: 5});
            await page.mouse.up();
            assert.equal(await right.getAttribute('aria-expanded'), 'true');
            assert.equal(await input.inputValue(), 'Retained through presentation changes');
            assert.deepEqual(errors, []);
            await page.close();

            const phone = await browser.newPage({viewport: {width: 390, height: 850}, hasTouch: true, isMobile: true});
            await phone.goto(url);
            await phone.waitForFunction(() => window.gramlot?.state === 'started');
            await settle(phone);
            const grip = phone.locator('#handles-demo .separator[data-side="right"] > .drawer');
            await grip.scrollIntoViewIfNeeded();
            const rest = await appearance(grip);
            assert.equal(rest.opacity, '1', 'Touch keeps the content readable');
            assertFits(rest);
            assert.equal(rest.width, rest.contentWidth, 'Touch uses intrinsic compact thickness');
            assert(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(rest.transform));
            assert(rest.duration.split(',').some(value => parseFloat(value) > 0));
            const touchBox = await grip.boundingBox();
            if (name === 'chromium') {
                const session = await phone.context().newCDPSession(phone);
                await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: touchBox.x + touchBox.width / 2, y: touchBox.y + touchBox.height / 2}]});
                await settle(phone);
                assert((await grip.boundingBox()).width > touchBox.width, 'Touch press retains zoom');
                await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
                await session.detach();
            } else {
                await phone.mouse.move(touchBox.x + touchBox.width / 2, touchBox.y + touchBox.height / 2);
                await phone.mouse.down();
                await settle(phone);
                assert((await grip.boundingBox()).width > touchBox.width, 'Press retains zoom');
                await phone.mouse.up();
            }
            await settle(phone);
            await phone.waitForFunction(() => ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(document.querySelector('#handles-demo').shadowRoot.querySelector('.separator[data-side=right] > .drawer')).transform), null, {timeout: 2000});
            await phone.close();
            console.log(`${name}: minimized icon/caption, automatic contrast, intrinsic sizing, Source updates, retained Data, closed dragging and compact touch/press passed`);
        }
    } finally {
        await browser.close();
    }
}
