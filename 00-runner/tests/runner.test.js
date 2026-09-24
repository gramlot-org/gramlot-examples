import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {RunnerPage} from '../runner-page.js';
import {GramlotBuilder} from '../../../js/src/builder/gramlot-builder.js';
import {Gramlot} from '../../../js/src/gramlot.js';
import {mountRunner} from '../browser/runner.js';
import {mountFrameTheme} from '../browser/frame-theme.js';
import {THEME_READY, THEME_SET} from '../browser/theme-messages.js';

function fixture() {
    const document = new JSDOM('<main id="gramlot-root"></main>', {url: 'https://runner.test/py/index'}).window.document;
    class Page extends RunnerPage {
        static logoUrl = '/logo.svg';
        static categoryReadme = '# HTML / SVG';
        static exampleContent = ['e01', 'e02'].map(key => ({key, title: key, frameUrl: key,
            readme: '# Example\n\n**Description** <script>bad()</script><img onerror="bad()"> [bad](javascript:alert(3))',
            source: 'def hello():\n    return "<script>bad()</script>"'}));
    }
    const builder = new GramlotBuilder();
    new Page().main(builder.root);
    const app = new Gramlot({document, transport: false}).startSource(builder.source);
    const renderer = app.renderer;
    const root = renderer.elements.get(document.getElementById('runner')).node;
    const behavior = mountRunner(renderer, root);
    const get = id => document.getElementById(id);
    const source = id => renderer.elements.get(get(id)).node;
    return {app, renderer, document, get, source, root, behavior};
}
const change = (f, id, value) => {
    f.get(id).value = value;
    f.get(id).dispatchEvent(new f.document.defaultView.Event('change', {bubbles: true}));
};
const key = (f, id, value) => f.get(id).dispatchEvent(new f.document.defaultView.KeyboardEvent('keydown', {key: value, bubbles: true}));

test('ordinary IDs connect local tab events; Source owns selection and lazy frame URLs', () => {
    const f = fixture();
    assert.equal(f.document.querySelectorAll('iframe[src]').length, 0);
    f.get('open-html_svg').click();
    assert.equal(f.get('panel-html_svg').hidden, false);
    assert.equal(f.get('panel-html_svg').querySelector('iframe'), null);
    f.get('open-e01').click();
    const frame = f.get('frame-e01');
    assert.equal(frame.getAttribute('src'), 'e01');
    assert.equal(f.source('frame-e01').getAttr('src'), 'e01');
    f.get('open-e02').click();
    f.get('tab-e01').click();
    assert.equal(f.get('frame-e01'), frame);
    assert.equal(f.get('panel-e01').hidden, false);
    assert.equal(f.get('panel-e02').hidden, true);
    assert.equal(f.get('tab-e02').hidden, false);
    assert.equal(f.document.querySelector('[data-gramlot-tabs], [data-runner-tabs]'), null);
    f.app.dispose();
});

test('local README and code views preserve literal code and sanitize Markdown', () => {
    const f = fixture();
    assert.equal(f.get('readme-e01').querySelector('h1').textContent, 'Example');
    assert.equal(f.get('readme-e01').querySelector('script, [onerror], [href^="javascript:"]'), null);
    assert.match(f.get('code-e01').textContent, /<script>bad\(\)<\/script>/);
    assert.equal(f.get('code-e01').querySelector('script'), null);
    assert.ok(f.get('code-e01').querySelector('.hljs-keyword'));
    f.app.dispose();
});

test('keyboard navigation is opt-in and cycles through opened tabs', () => {
    const f = fixture();
    f.get('open-e01').click(); f.get('open-e02').click();
    key(f, 'tab-e02', 'Home');
    assert.equal(f.get('panel-e02').hidden, false);
    f.get('keyboard-navigation').click();
    assert.equal(f.source('keyboard-navigation').getAttr('checked'), true);
    key(f, 'tab-e02', 'Home');
    assert.equal(f.document.activeElement, f.get('tab-intro'));
    key(f, 'tab-intro', 'ArrowLeft');
    assert.equal(f.document.activeElement, f.get('tab-e02'));
    f.get('keyboard-navigation').click();
    assert.equal(f.get('open-e01').tabIndex, -1);
    f.app.dispose();
});

test('split keyboard controls update native style and ARIA through Source', () => {
    const f = fixture();
    key(f, 'divider-e01', 'ArrowLeft');
    assert.equal(f.source('split-e01').getAttr('style'), '--split-position: 60%');
    key(f, 'divider-e01', 'End'); key(f, 'divider-e01', 'ArrowRight');
    assert.equal(f.get('divider-e01').getAttribute('aria-valuenow'), '80');
    key(f, 'divider-e01', 'Home'); key(f, 'divider-e01', 'ArrowLeft');
    assert.equal(f.get('divider-e01').getAttribute('aria-valuenow'), '20');
    f.app.dispose();
});

test('removal during pointer drag releases capture and all page listeners', () => {
    const f = fixture();
    const handle = f.get('divider-e01');
    const split = f.source('split-e01');
    let captured = false;
    handle.setPointerCapture = () => { captured = true; };
    handle.hasPointerCapture = () => captured;
    handle.releasePointerCapture = () => { captured = false; };
    f.get('split-e01').getBoundingClientRect = () => ({left: 0, width: 200});
    const pointer = (type, x) => new f.document.defaultView.MouseEvent(type, {button: 0, clientX: x, bubbles: true});
    handle.dispatchEvent(pointer('pointerdown', 100));
    f.document.dispatchEvent(pointer('pointermove', 140));
    assert.equal(split.getAttr('style'), '--split-position: 70%');
    const open = f.get('open-e02'), frame = f.source('frame-e02');
    f.root.parentBag.popNode(f.root.label);
    assert.equal(captured, false);
    f.document.dispatchEvent(pointer('pointermove', 40));
    open.dispatchEvent(new f.document.defaultView.Event('click', {bubbles: true}));
    assert.equal(split.getAttr('style'), '--split-position: 70%');
    assert.equal(frame.getAttr('src'), null);
    f.app.dispose();
});

test('runner themes reach owned frames only; disposal restores the document theme', () => {
    const f = fixture();
    const messages = [];
    f.get('frame-e01').contentWindow.postMessage = (data, origin) => messages.push({data, origin});
    change(f, 'runner-theme', 'dark');
    assert.equal(f.document.documentElement.getAttribute('data-theme'), 'dark');
    assert.equal(f.source('runner-theme').getAttr('value'), 'dark');
    assert.deepEqual(messages.at(-1), {data: {type: THEME_SET, theme: 'dark'}, origin: '*'});
    const before = messages.length;
    f.document.defaultView.dispatchEvent(new f.document.defaultView.MessageEvent('message',
        {data: {type: THEME_READY}, source: new JSDOM('').window}));
    assert.equal(messages.length, before);
    f.document.defaultView.dispatchEvent(new f.document.defaultView.MessageEvent('message',
        {data: {type: THEME_READY}, source: f.get('frame-e01').contentWindow}));
    assert.equal(messages.length, before + 1);
    f.app.dispose();
    assert.equal(f.document.documentElement.hasAttribute('data-theme'), false);
});

test('a rebuilt runner can reattach page behavior without resetting Source state', () => {
    const f = fixture();
    f.get('open-e01').click(); change(f, 'runner-theme', 'dark');
    key(f, 'divider-e01', 'ArrowLeft');
    f.renderer.freeze(f.root); f.renderer.unfreeze(f.root);
    // In a browser the shell's script is reinserted and runs this same attachment.
    mountRunner(f.renderer, f.root);
    assert.equal(f.get('panel-e01').hidden, false);
    assert.equal(f.get('runner-theme').value, 'dark');
    assert.equal(f.get('divider-e01').getAttribute('aria-valuenow'), '60');
    f.get('open-e02').click(); f.get('tab-e01').click();
    assert.equal(f.get('panel-e01').hidden, false);
    f.app.dispose();
});

test('frame theme bridge is runner-owned and removed with its Source script', () => {
    const parent = new JSDOM('<iframe></iframe>').window;
    const child = parent.document.querySelector('iframe').contentWindow;
    child.document.body.innerHTML = '<main id="gramlot-root"></main>';
    const builder = new GramlotBuilder();
    builder.root.script({id: 'runner-frame-theme'});
    const app = new Gramlot({document: child.document, transport: false}).startSource(builder.source);
    const node = app.renderer.elements.get(child.document.querySelector('script')).node;
    const ready = [];
    parent.postMessage = (data, target) => ready.push({data, target});
    mountFrameTheme(app.renderer, node);
    assert.deepEqual(ready, [{data: {type: THEME_READY}, target: '*'}]);
    const message = (source, theme) => child.dispatchEvent(new child.MessageEvent('message',
        {source, data: {type: THEME_SET, theme}}));
    message(new JSDOM('').window, 'dark'); message(parent, 'system');
    assert.equal(child.document.documentElement.hasAttribute('data-theme'), false);
    message(parent, 'dark');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    node.parentBag.popNode(node.label);
    message(parent, 'light');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    app.dispose();
});
