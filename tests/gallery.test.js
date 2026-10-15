import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {GalleryPage} from '../src/gramlot_examples/gallery/gallery-page.js';
import {Page as NodeGalleryPage} from '../src/gramlot_examples/gallery/page.js';
import {Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {mountGallery} from '../src/gramlot_examples/gallery/browser/gallery.js';
import {logicSource} from '../src/gramlot_examples/gallery/browser/code-highlight.js';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mountFrameTheme} from '../src/gramlot_examples/gallery/browser/frame-theme.js';
import {THEME_READY, THEME_SET} from '../src/gramlot_examples/gallery/browser/theme-messages.js';

function fixture(logic = 'export class Logic { total(kwargs) { return "<b>"; } }', prepare = () => {}) {
    const document = new JSDOM('<main id="gramlot-root"></main>', {url: 'https://gallery.test/py/index'}).window.document;
    prepare(document.defaultView);
    class Page extends GalleryPage {
        static logoUrl = '/logo.svg';
        static families = [{key: 'html_svg', title: 'HTML / SVG', readme: '# HTML / SVG',
            examples: ['e01', 'e02'].map(key => ({key, title: key, frameUrl: key,
                readme: '# Example\n\n**Description** <script>bad()</script><img onerror="bad()"> [bad](javascript:alert(3))',
                source: 'def hello():\n    return "<script>bad()</script>"', logic: null}))},
        {key: 'controllers', title: 'Controllers', readme: '# Controllers',
            examples: [{key: 'c01', title: 'c01', frameUrl: 'c01', readme: '# Named', source: 'x = 1',
                logic}]}];
    }
    const builder = new GramlotBuilder();
    new Page().main(builder.root);
    const app = new Gramlot({document, transport: false}).src.startSource(builder.source);
    const renderer = app.src.renderer;
    const root = renderer.elements.get(document.getElementById('gallery')).node;
    const selections = [];
    const behavior = mountGallery(renderer, root, (entries, active) => selections.push({entries, active}));
    const get = id => document.getElementById(id);
    const source = id => renderer.elements.get(get(id)).node;
    return {app, renderer, document, get, source, root, behavior, selections};
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
    assert.equal(f.document.querySelector('[data-gramlot-tabs], [data-index-tabs]'), null);
    f.app.dispose();
});

test('each family has its own category panel; a companion module is shown beside the page code', () => {
    const f = fixture();
    assert.deepEqual([...f.document.querySelectorAll('.index-family')].map(link => link.id), ['open-html_svg', 'open-controllers']);
    f.get('open-controllers').click();
    assert.equal(f.get('panel-controllers').hidden, false);
    assert.equal(f.get('panel-html_svg').hidden, true);
    assert.equal(f.get('panel-controllers').querySelector('iframe'), null);
    assert.equal(f.get('readme-controllers').querySelector('h1').textContent, 'Controllers');
    assert.equal(f.get('logic-e01'), null);
    assert.match(f.get('logic-c01').textContent, /return "<b>";/);
    assert.equal(f.get('logic-c01').querySelector('b'), null);
    assert.ok(f.get('logic-c01').classList.contains('hljs'));
    f.get('open-c01').click();
    assert.equal(f.get('frame-c01').getAttribute('src'), 'c01');
    f.app.dispose();
});

test('each family is a native details; the first starts open and selecting an example opens its family', async () => {
    const f = fixture();
    const families = [...f.document.querySelectorAll('.index-sidebar nav > .index-list > li > details')];
    const open = details => f.renderer.elements.get(details).node.getAttr('open');
    const toggled = details => new Promise(resolve => details.addEventListener('toggle', resolve, {once: true}));
    assert.deepEqual(families.map(details => details.querySelector(':scope > summary > .index-family').id),
        ['open-html_svg', 'open-controllers']);
    assert.deepEqual(families.map(details => details.querySelectorAll(':scope > .index-list > li > a').length), [2, 1]);
    assert.deepEqual(families.map(details => details.open), [true, false]);
    const opening = toggled(families[1]);
    f.get('open-controllers').click();
    await opening;
    assert.equal(f.get('panel-controllers').hidden, false);
    assert.equal(families[1].open, true, 'the family link opens its family');
    const closingLinked = toggled(families[1]);
    families[1].querySelector('summary').click();
    await closingLinked;
    assert.equal(families[1].open, false);
    const closing = toggled(families[0]);
    families[0].querySelector('summary').click();
    await closing;
    assert.equal(families[0].open, false);
    assert.equal(open(families[0]), false);
    f.get('open-c01').click();
    assert.equal(families[1].open, true);
    assert.equal(open(families[1]), true);
    assert.equal(families[0].open, false, 'other families keep their state');
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
    assert.deepEqual([...f.document.querySelectorAll('.index-sidebar summary')].map(summary => summary.tabIndex), [-1, -1], 'the family link is the only tab stop of a family');
    key(f, 'tab-e02', 'Home');
    assert.equal(f.document.activeElement, f.get('tab-intro'));
    key(f, 'tab-intro', 'ArrowLeft');
    assert.equal(f.document.activeElement, f.get('tab-e02'));
    f.get('keyboard-navigation').click();
    assert.equal(f.get('open-e01').tabIndex, -1);
    assert.deepEqual([...f.document.querySelectorAll('.index-sidebar summary')].map(summary => summary.tabIndex), [-1, -1]);
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

test('gallery themes reach owned frames only; disposal restores the document theme', () => {
    const f = fixture();
    const messages = [];
    f.get('frame-e01').contentWindow.postMessage = (data, origin) => messages.push({data, origin});
    change(f, 'index-theme', 'dark');
    assert.equal(f.document.documentElement.getAttribute('data-theme'), 'dark');
    assert.equal(f.source('index-theme').getAttr('value'), 'dark');
    assert.deepEqual(messages.at(-1), {data: {type: THEME_SET, theme: 'dark', appearance: 'compact'}, origin: '*'});
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

test('a rebuilt gallery can reattach page behavior without resetting Source state', () => {
    const f = fixture();
    f.get('open-e01').click(); change(f, 'index-theme', 'dark');
    change(f, 'index-appearance', 'base');
    key(f, 'index-sidebar-divider', 'ArrowRight');
    key(f, 'divider-e01', 'ArrowLeft');
    f.renderer.freeze(f.root); f.renderer.unfreeze(f.root);
    // In a browser the shell's script is reinserted and runs this same attachment.
    mountGallery(f.renderer, f.root, () => {});
    assert.equal(f.get('panel-e01').hidden, false);
    assert.equal(f.get('index-theme').value, 'dark');
    assert.equal(f.get('index-appearance').value, 'base');
    assert.equal(f.get('index-sidebar-divider').getAttribute('aria-valuenow'), '250');
    assert.equal(f.get('divider-e01').getAttribute('aria-valuenow'), '60');
    f.get('open-e02').click(); f.get('tab-e01').click();
    assert.equal(f.get('panel-e01').hidden, false);
    f.app.dispose();
});

test('frame theme bridge is gallery-owned and removed with its Source script', () => {
    const parent = new JSDOM('<iframe></iframe>').window;
    const child = parent.document.querySelector('iframe').contentWindow;
    child.document.body.innerHTML = '<main id="gramlot-root"></main>';
    const builder = new GramlotBuilder();
    builder.root.script({id: 'gallery-frame-theme'});
    const app = new Gramlot({document: child.document, transport: false}).src.startSource(builder.source);
    const node = app.src.renderer.elements.get(child.document.querySelector('script')).node;
    const ready = [];
    parent.postMessage = (data, target) => ready.push({data, target});
    mountFrameTheme(app.src.renderer, node);
    const style = child.document.querySelector('style');
    assert.ok(style.textContent.includes('font-size: 13px'));
    assert.ok(app.src.renderer.elements.get(style), 'preview CSS belongs to Source');
    assert.deepEqual(ready, [{data: {type: THEME_READY}, target: '*'}]);
    const message = (source, theme, appearance = 'compact') => child.dispatchEvent(new child.MessageEvent('message',
        {source, data: {type: THEME_SET, theme, appearance}}));
    message(new JSDOM('').window, 'dark'); message(parent, 'system');
    assert.equal(child.document.documentElement.hasAttribute('data-theme'), false);
    message(parent, 'dark');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    message(parent, 'dark', 'base');
    assert.equal(style.media, 'not all');
    message(parent, 'light', 'invalid');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    message(parent, 'dark', 'compact');
    assert.equal(style.media, 'all');
    node.parentBag.popNode(node.label);
    assert.equal(child.document.querySelector('style'), null);
    message(parent, 'light');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    app.dispose();
});

test('families read through a getter: the first family starts open', () => {
    const document = new JSDOM('<main id="gramlot-root"></main>', {url: 'https://gallery.test/js/index'}).window.document;
    class Page extends GalleryPage {
        static logoUrl = '/logo.svg';
        // A new array at every access, as gallery/page.js builds them from buildGallery.
        static get families() {
            return ['html_svg', 'binding'].map(key => ({key, title: key, readme: `# ${key}`,
                examples: [{key: `${key}-01`, title: 'x', frameUrl: `${key}-01`, readme: '# x', source: 'x', logic: null}]}));
        }
    }
    const builder = new GramlotBuilder();
    new Page().main(builder.root);
    const app = new Gramlot({document, transport: false}).src.startSource(builder.source);
    const families = [...document.querySelectorAll('.index-sidebar nav > .index-list > li > details')];
    assert.deepEqual(families.map(details => details.open), [true, false]);
    app.dispose();
});

/** Build `main` as the server does and return the `src` of each Source node by tag. */
function sources(PageClass) {
    const builder = new PageClass.sourceBuilder();
    new PageClass().main(builder.root);
    const walk = function* (bag) {
        for (const node of bag.getNodes()) {
            yield node;
            if (node.value?.getNodes) yield* walk(node.value);
        }
    };
    return Object.fromEntries([...walk(builder.source)].filter(node => node.attr.src).map(node => [node.nodeTag, node.attr.src]));
}

test('gallery page: default URLs of the logo and of the gallery script', () => {
    assert.deepEqual(sources(NodeGalleryPage), {img: '/assets/branding/gramlot-logo-dark.svg', script: '/gallery/dist/gallery.js'});
});

test('gallery page: a subclass sets the URLs of the logo and of the gallery script', () => {
    class MountedPage extends NodeGalleryPage {
        static logoUrl = '/js/assets/branding/gramlot-logo-dark.svg';
        static galleryScript = '/js/gallery/dist/gallery.js';
    }
    assert.deepEqual(sources(MountedPage), {img: '/js/assets/branding/gramlot-logo-dark.svg', script: '/js/gallery/dist/gallery.js'});
});


test('source tabs select one file, retain the preview and support keyboard navigation and cleanup', () => {
    const f = fixture();
    f.get('open-c01').click();
    const frame = f.get('frame-c01');
    assert.equal(f.get('code-panel-c01').hidden, false);
    assert.equal(f.get('logic-panel-c01').hidden, true);
    f.get('logic-tab-c01').click();
    assert.equal(f.source('code-panel-c01').getAttr('hidden'), true);
    assert.equal(f.get('logic-panel-c01').hidden, false);
    assert.equal(f.get('logic-tab-c01').getAttribute('aria-selected'), 'true');
    assert.equal(f.get('code-tab-c01').tabIndex, -1);
    f.get('open-e01').click();
    f.get('tab-c01').click();
    assert.equal(f.get('frame-c01'), frame);
    assert.equal(f.get('logic-panel-c01').hidden, false);
    key(f, 'logic-tab-c01', 'Home');
    assert.equal(f.document.activeElement, f.get('code-tab-c01'));
    assert.equal(f.get('logic-panel-c01').hidden, true);
    key(f, 'code-tab-c01', 'ArrowRight');
    assert.equal(f.document.activeElement, f.get('logic-tab-c01'));
    key(f, 'logic-tab-c01', 'ArrowRight');
    assert.equal(f.document.activeElement, f.get('code-tab-c01'));
    f.behavior.dispose();
    f.get('logic-tab-c01').click();
    assert.equal(f.get('logic-panel-c01').hidden, true, 'disposal releases source-tab listeners');
    f.app.dispose();
});


test('every shared example displays exactly its exported Logic class, never the alternative Page', async () => {
    const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url)));
    const urls = families.flatMap(family => family.examples.map(example =>
        new URL(`../src/gramlot_examples/pages/${family.key}/${example.folder}.js`, import.meta.url).href));
    // Node preserves the authored class source; Bun rewrites imported modules before execution.
    // Node is already required for the gallery build in both CI runtime jobs.
    const originals = JSON.parse(execFileSync('node', ['--input-type=module', '-e',
        "const result = {}; for (const url of JSON.parse(process.argv[1])) { const {Logic} = await import(url); result[url] = Function.prototype.toString.call(Logic); } console.log(JSON.stringify(result));",
        JSON.stringify(urls)], {encoding: 'utf8'}));
    let shown = 0;
    for (const family of families) for (const example of family.examples) {
        const url = new URL(`../src/gramlot_examples/pages/${family.key}/${example.folder}.js`, import.meta.url);
        const {Logic} = await import(url);
        const excerpt = logicSource(readFileSync(url, 'utf8'));
        const hasMethods = Reflect.ownKeys(Logic.prototype).some(name => name !== 'constructor');
        if (hasMethods) {
            assert.equal(excerpt, `export ${originals[url.href]}`, example.key);
            shown++;
        } else assert.equal(excerpt, null, example.key);
    }
    assert.equal(shown, 11);
});

test('source excerpt keeps method bodies intact and suppresses an empty Logic tab', () => {
    const body = 'export class Logic { run() { return `brace } ${JSON.stringify({x: 1})}`; } }';
    assert.equal(logicSource('export class Page {}\n' + body), body);
    const f = fixture('export class Page {}\nexport class Logic {}');
    assert.equal(f.get('logic-tab-c01').textContent, 'logic.js');
    f.behavior.dispose();
    const behavior = mountGallery(f.renderer, f.root, () => {});
    assert.equal(f.get('logic-tab-c01').hidden, true);
    f.get('open-c01').click();
    key(f, 'code-tab-c01', 'ArrowRight');
    assert.equal(f.document.activeElement, f.get('code-tab-c01'));
    behavior.dispose();
    f.app.dispose();
});


test('appearance and color are independent and update the existing frame without navigating', () => {
    const f = fixture();
    f.get('open-e01').click();
    const frame = f.get('frame-e01');
    const messages = [];
    frame.contentWindow.postMessage = data => messages.push(data);
    change(f, 'index-theme', 'dark');
    change(f, 'index-appearance', 'base');
    assert.equal(f.source('index-appearance').getAttr('value'), 'base');
    assert.equal(f.document.querySelector('style').media, 'not all');
    assert.deepEqual(messages.at(-1), {type: THEME_SET, theme: 'dark', appearance: 'base'});
    assert.equal(f.get('frame-e01'), frame);
    assert.equal(frame.getAttribute('src'), 'e01');
    change(f, 'index-appearance', 'compact');
    assert.equal(f.document.querySelector('style').media, 'all');
    assert.equal(f.document.documentElement.getAttribute('data-theme'), 'dark');
    f.app.dispose();
    assert.equal(f.document.querySelector('style'), null);
});

test('sidebar separator uses Source, clamps keyboard changes and releases a removed drag', () => {
    const f = fixture();
    const handle = f.get('index-sidebar-divider');
    key(f, handle.id, 'ArrowRight');
    assert.equal(f.source('gallery').getAttr('style'), '--sidebar-width: 250px');
    key(f, handle.id, 'Home'); key(f, handle.id, 'ArrowLeft');
    assert.equal(handle.getAttribute('aria-valuenow'), '120');
    key(f, handle.id, 'End'); key(f, handle.id, 'ArrowRight');
    assert.equal(handle.getAttribute('aria-valuenow'), '460');
    let captured = false;
    handle.setPointerCapture = () => { captured = true; };
    handle.hasPointerCapture = () => captured;
    handle.releasePointerCapture = () => { captured = false; };
    const pointer = (type, x) => new f.document.defaultView.MouseEvent(type, {button: 0, clientX: x, bubbles: true});
    handle.dispatchEvent(pointer('pointerdown', 460));
    f.document.dispatchEvent(pointer('pointermove', 320));
    assert.equal(handle.getAttribute('aria-valuenow'), '320');
    assert.equal(f.root.getAttr('data_resizing'), 'true');
    f.root.parentBag.popNode(f.root.label);
    assert.equal(captured, false);
    f.document.dispatchEvent(pointer('pointermove', 200));
    assert.equal(f.root.getAttr('style'), '--sidebar-width: 320px');
    f.app.dispose();
});


test('theme, color and sidebar preference survive a fresh gallery and reach new frames', () => {
    const storageKey = 'gramlot.gallery.preferences:/py/index';
    const f = fixture();
    change(f, 'index-appearance', 'base');
    change(f, 'index-theme', 'dark');
    key(f, 'index-sidebar-divider', 'End');
    const saved = f.document.defaultView.localStorage.getItem(storageKey);
    assert.deepEqual(JSON.parse(saved), {theme: 'dark', appearance: 'base', sidebarWidth: 460});
    f.app.dispose();
    const restored = fixture(undefined, window => window.localStorage.setItem(storageKey, saved));
    assert.equal(restored.get('index-appearance').value, 'base');
    assert.equal(restored.get('index-theme').value, 'dark');
    assert.equal(restored.get('index-sidebar-divider').getAttribute('aria-valuenow'), '460');
    assert.equal(restored.document.querySelector('style').media, 'not all');
    const messages = [];
    restored.get('open-e01').click();
    restored.get('frame-e01').contentWindow.postMessage = data => messages.push(data);
    restored.get('frame-e01').dispatchEvent(new restored.document.defaultView.Event('load'));
    assert.deepEqual(messages.at(-1), {type: THEME_SET, theme: 'dark', appearance: 'base'});
    // A temporary narrow viewport must not overwrite the desktop preference.
    Object.defineProperty(restored.document.defaultView, 'innerWidth', {value: 500, configurable: true});
    restored.document.defaultView.dispatchEvent(new restored.document.defaultView.Event('resize'));
    assert.equal(restored.get('index-sidebar-divider').getAttribute('aria-valuenow'), '300');
    change(restored, 'index-theme', 'light');
    assert.equal(JSON.parse(restored.document.defaultView.localStorage.getItem(storageKey)).sidebarWidth, 460);
    Object.defineProperty(restored.document.defaultView, 'innerWidth', {value: 1280, configurable: true});
    restored.document.defaultView.dispatchEvent(new restored.document.defaultView.Event('resize'));
    assert.equal(restored.get('index-sidebar-divider').getAttribute('aria-valuenow'), '460');
    restored.app.dispose();
});

test('invalid stored preferences do not replace valid defaults or coerce widths', () => {
    for (const value of ['{', 'null', '[]', '{"appearance":"unknown","theme":"system","sidebarWidth":"320"}',
        '{"sidebarWidth":99999}', '{"sidebarWidth":-1}']) {
        const f = fixture(undefined, window => window.localStorage.setItem('gramlot.gallery.preferences:/py/index', value));
        assert.equal(f.get('index-appearance').value, 'compact');
        assert.equal(f.get('index-theme').value, 'light');
        assert.equal(f.get('index-sidebar-divider').getAttribute('aria-valuenow'), '240');
        f.app.dispose();
    }
});

test('browser storage denial or exhausted quota does not break gallery controls', () => {
    for (const name of ['SecurityError', 'QuotaExceededError']) {
        const f = fixture(undefined, window => {
            Object.defineProperty(window, 'localStorage', {value: {
                getItem() { if (name === 'SecurityError') throw new window.DOMException('Denied', name); return null; },
                setItem() { throw new window.DOMException('Unavailable', name); },
            }});
        });
        change(f, 'index-appearance', 'base');
        change(f, 'index-theme', 'dark');
        key(f, 'index-sidebar-divider', 'End');
        assert.equal(f.get('index-theme').value, 'dark');
        assert.equal(f.get('index-sidebar-divider').getAttribute('aria-valuenow'), '460');
        f.get('open-e01').click();
        assert.equal(f.get('panel-e01').hidden, false);
        f.app.dispose();
    }
});

test('gallery selection reports the visible example without selecting a page on inspector behalf', () => {
    const f = fixture();
    assert.equal(f.selections.at(-1).active, 'intro');
    f.get('open-e01').click();
    assert.equal(f.selections.at(-1).active, 'e01');
    assert.equal(f.selections.at(-1).entries.get('e01').frame, f.get('frame-e01'));
    f.get('tab-intro').click();
    assert.equal(f.selections.at(-1).active, 'intro');
    f.app.dispose();
});

test('built frame inspector uses the example runtime classes without another core', async () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false});
    window.gramlot = app;
    app.data.setItem('name', 'Ada');
    try {
        const bundle = readFileSync(new URL('../src/gramlot_examples/gallery/dist/frame.js', import.meta.url), 'utf8');
        new Function('window', 'document', 'HTMLElement', 'customElements', bundle)(
            window, window.document, window.HTMLElement, window.customElements);
        const inspector = window.document.createElement('gramlot-tools-inspector');
        inspector.gramlot = app;
        window.document.body.append(inspector);
        const tree = inspector.shadowRoot.querySelector('gramlot-poc-tree[data-root=data]');
        tree.shadowRoot.querySelector('[data-node-path=name]').click();
        assert.equal(inspector.shadowRoot.querySelector('[aria-label=Value]').value, 'Ada');
        app.data.setItem('name', 'Grace');
        await new Promise(resolve => queueMicrotask(resolve));
        assert.equal(inspector.shadowRoot.querySelector('[aria-label=Value]').value, 'Grace');
        let closed = false;
        inspector.addEventListener('close', () => { closed = true; });
        inspector.shadowRoot.querySelector('gramlot-poc-palette').shadowRoot.querySelector('[aria-label="Close inspector"]').click();
        assert.equal(closed, true);
        assert.equal(inspector.isConnected, false);
    } finally { app.dispose(); window.close(); }
});
