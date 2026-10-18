import assert from 'node:assert/strict';
import test from 'node:test';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {JSDOM} from 'jsdom';
import {buildGallery} from '../src/gramlot_examples/index.js';
import {pathToFileURL} from 'node:url';
import {GalleryPage} from '../src/gramlot_examples/gallery/gallery-page.js';
import {Page as NodeGalleryPage} from '../src/gramlot_examples/gallery/page.js';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import {Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {mountGallery} from '../src/gramlot_examples/gallery/browser/gallery.js';
import {logicSource} from '../src/gramlot_examples/gallery/browser/code-highlight.js';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mountFrameSettings, SETTINGS_SET} from '../src/gramlot_examples/gallery/browser/gallery-settings.js';
import {mountFrameTheme} from '../src/gramlot_examples/gallery/browser/frame-theme.js';
import {THEME_READY, THEME_SET} from '../src/gramlot_examples/gallery/browser/theme-messages.js';

function fixture(logic = 'export class Logic { total(kwargs) { return "<b>"; } }', prepare = () => {}) {
    const document = new JSDOM('<main id="gramlot-root"></main>', {url: 'https://gallery.test/py/index', pretendToBeVisual: true}).window.document;
    const media = new document.defaultView.EventTarget();
    media.matches = false;
    document.defaultView.matchMedia = () => media;
    document.defaultView.HTMLElement.prototype.scrollIntoView = function () {};
    document.defaultView.ResizeObserver = class { observe() {} disconnect() {} unobserve() {} };
    const observers = new Set();
    document.defaultView.IntersectionObserver = class {
        targets = new Set();
        constructor(callback) { this.callback = callback; observers.add(this); }
        observe(element) { this.targets.add(element); }
        unobserve(element) { this.targets.delete(element); }
        disconnect() { this.targets.clear(); observers.delete(this); }
    };
    const visible = (id, shown = true) => {
        const target = document.getElementById(id);
        for (const observer of observers) if (observer.targets.has(target)) observer.callback([
            {target, isIntersecting: shown, intersectionRect: {width: shown ? 100 : 0, height: shown ? 100 : 0}},
        ]);
    };
    Object.defineProperty(document, 'fonts', {value: new document.defaultView.EventTarget()});
    const computed = document.defaultView.getComputedStyle.bind(document.defaultView);
    document.defaultView.getComputedStyle = element => {
        const style = computed(element);
        if (element.id === 'gallery') style.setProperty('--gallery-narrow', media.matches ? '1' : '0');
        return style;
    };
    media.addEventListener('change', () => document.defaultView.dispatchEvent(new document.defaultView.Event('resize')));
    prepare(document.defaultView);
    class Page extends GalleryPage {
        static logoUrl = '/logo.svg';
        static families = [{key: 'html_svg', title: 'HTML / SVG', readme: '# HTML / SVG',
            examples: ['e01', 'e02'].map(key => ({key, title: key, description: "A working example", frameUrl: key,
                readme: '# Example\n\n**Description** <script>bad()</script><img onerror="bad()"> [bad](javascript:alert(3))',
                source: 'def hello():\n    return "<script>bad()</script>"', logic: null}))},
        {key: 'controllers', title: 'Controllers', readme: '# Controllers',
            examples: [{key: 'c01', title: 'c01', description: 'Named logic', frameUrl: 'c01', readme: '# Named', source: 'x = 1',
                logic}]}];
    }
    const builder = new GramlotBuilder(null, {collections: [inputs.toDocument(), layout.toDocument()]});
    new Page().main(builder.root);
    const calls = [];
    const transport = {async call(text) {
        const {id, contentType, name, params} = fromTytx(text);
        calls.push({name, ...params});
        const fragment = new GramlotBuilder(null, {collections: [inputs.toDocument(), layout.toDocument()]});
        new Page()[name](fragment.root, params);
        return toTytx({id, contentType, value: fragment.toTytx()});
    }};
    const app = new Gramlot({document, pageId: 'gallery', transport, collections: [inputs, layout]}).src.startSource(builder.source);
    const renderer = app.src.renderer;
    const root = renderer.elements.get(document.getElementById('gallery')).node;
    const selections = [];
    const presentations = [];
    const behavior = mountGallery(renderer, root, {
        update: (entries, active) => selections.push({entries, active}),
        setPresentation: (docked, visible) => presentations.push({docked, visible}),
    });
    const get = id => document.getElementById(id);
    const source = id => renderer.elements.get(get(id)).node;
    const tab = (host, name) => [...get(host).shadowRoot.querySelectorAll('[role="tab"]')].find(el => el.textContent.trim() === name);
    const state = app.data.getItem('galleryIndex');
    return {app, renderer, document, get, source, root, behavior, selections, media, presentations, tab, state, calls, transport, visible};
}
const change = (f, id, value) => {
    f.get(id).value = value;
    f.get(id).dispatchEvent(new f.document.defaultView.Event('change', {bubbles: true}));
};
const key = (f, id, value) => f.get(id).dispatchEvent(new f.document.defaultView.KeyboardEvent('keydown', {key: value, bubbles: true}));

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
    assert.deepEqual(ready, [{data: {type: THEME_READY, devices: []}, target: '*'}]);
    const message = (source, theme, appearance = 'compact') => child.dispatchEvent(new child.MessageEvent('message',
        {source, data: {type: THEME_SET, theme, appearance}}));
    message(new JSDOM('').window, 'dark'); message(parent, 'system');
    assert.equal(child.document.documentElement.hasAttribute('data-theme'), false);
    message(parent, 'dark');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    message(parent, 'dark', 'base');
    assert.equal(style.textContent, '');
    message(parent, 'light', 'invalid');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    message(parent, 'dark', 'compact');
    assert.match(style.textContent, /font-size: 13px/);
    message(parent, 'light', 'mimi');
    assert.match(style.textContent, /--gramlot-field-height: 18px/);
    message(parent, 'dark', 'joanna');
    assert.match(style.textContent, /--gramlot-field-height: 20px/);
    assert.doesNotMatch(style.textContent, /--gramlot-field-height: 18px/);
    node.parentBag.popNode(node.label);
    assert.equal(child.document.querySelector('style'), null);
    message(parent, 'light');
    assert.equal(child.document.documentElement.getAttribute('data-theme'), 'dark');
    app.dispose();
});

test('every shared example displays exactly its exported Logic class, never the alternative Page', async () => {
    const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url)));
    const routes = buildGallery().routes;
    const urls = families.flatMap(family => family.examples.map(example => pathToFileURL(routes[example.key].logic).href));
    // Node preserves the authored class source; Bun rewrites imported modules before execution.
    // Node is already required for the gallery build in both CI runtime jobs.
    const originals = JSON.parse(execFileSync('node', ['--input-type=module', '-e',
        "const result = {}; for (const url of JSON.parse(process.argv[1])) { const {Logic} = await import(url); result[url] = Function.prototype.toString.call(Logic); } console.log(JSON.stringify(result));",
        JSON.stringify(urls)], {encoding: 'utf8'}));
    let shown = 0;
    for (const family of families) for (const example of family.examples) {
        const url = pathToFileURL(routes[example.key].logic);
        const {Logic} = await import(url);
        const excerpt = logicSource(readFileSync(url, 'utf8'));
        const hasMethods = Reflect.ownKeys(Logic.prototype).some(name => name !== 'constructor');
        if (hasMethods) {
            assert.equal(excerpt, `export ${originals[url.href]}`, example.key);
            shown++;
        } else assert.equal(excerpt, null, example.key);
    }
    assert.equal(shown, 13);
});

test('built frame inspector uses the example runtime classes without another core', async () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLDialogElement.prototype.close = function () { this.open = false; };
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
    await settle();
        assert.equal(inspector.shadowRoot.querySelector('[aria-label=Value]').value, 'Ada');
        app.data.setItem('name', 'Grace');
        await new Promise(resolve => queueMicrotask(resolve));
        assert.equal(inspector.shadowRoot.querySelector('[aria-label=Value]').value, 'Grace');
        let closed = false;
        inspector.addEventListener('close', () => { closed = true; });
        inspector.shadowRoot.querySelector('gramlot-poc-palette').shadowRoot.querySelector('[aria-label="Close inspector"]').click();
    await settle();
        assert.equal(closed, true);
        assert.equal(inspector.isConnected, false);
    } finally { app.dispose(); window.close(); }
});


test('frame settings override Source label positions and restore authored pointers', () => {
    const parent = new JSDOM('<iframe></iframe>').window;
    const child = parent.document.querySelector('iframe').contentWindow;
    child.document.body.innerHTML = '<main id="gramlot-root"></main>';
    const builder = new GramlotBuilder();
    builder.root.div({id: 'labelled', lbl: 'Example', lbl_position: '^position', lbl_width: '^labelWidth', box_padding: '8px', box_c_width: '^fieldWidth'});
    builder.root.script({id: 'settings-owner'});
    builder.data.setItem('position', 'TL');
    const app = new Gramlot({document: child.document, transport: false}).src.startSource(builder.source);
    const renderer = app.src.renderer;
    const owner = renderer.elements.get(child.document.getElementById('settings-owner')).node;
    const node = renderer.elements.get(child.document.getElementById('labelled')).node;
    mountFrameSettings(renderer, owner);
    const message = (source, labelPosition) => child.dispatchEvent(new child.MessageEvent('message', {source, data: {type: SETTINGS_SET, labelPosition}}));
    message(new JSDOM('').window, 'R'); message(parent, 'bad');
    assert.equal(node.getAttr('lbl_position'), '^position');
    message(parent, 'R'); assert.equal(node.getAttr('lbl_position'), 'R');
    message(parent, 'L');
    assert.equal(node.getAttr('box_l_text_align'), null);
    assert.equal(node.getAttr('lbl_width'), '^labelWidth');
    assert.equal(node.getAttr('box_grid_template_columns'), null);
    assert.equal(node.getAttr('box_padding'), '8px');
    assert.equal(node.getAttr('box_c_width'), '^fieldWidth');
    message(parent, 'L'); // Repeated settings must not replace the authored snapshot.
    message(parent, 'BC');
    assert.equal(node.getAttr('box_padding'), '8px');
    assert.equal(node.getAttr('box_c_width'), '^fieldWidth');
    assert.equal(node.getAttr('box_grid_template_columns'), null);
    assert.equal(node.getAttr('lbl_width'), '^labelWidth');
    assert.equal(node.getAttr('width'), null);
    message(parent, 'L'); message(parent, 'example');
    assert.equal(node.getAttr('box_padding'), '8px');
    assert.equal(node.getAttr('box_c_width'), '^fieldWidth');
    assert.equal(node.getAttr('lbl_position'), '^position');
    message(parent, 'BC'); owner.parentBag.popNode(owner.label);
    assert.equal(node.getAttr('lbl_position'), '^position');
    message(parent, 'R'); assert.equal(node.getAttr('lbl_position'), '^position');
    app.dispose();
});


test('the gallery footer omits the ZIP link even when a deployment URL is supplied', () => {
    for (const url of [null, '/downloads/gallery.zip']) {
        class HostedPage extends GalleryPage { static serverlessDownloadUrl = url; }
        const builder = new GramlotBuilder();
        new HostedPage().footer(builder.root);
        const links = builder.source.getNodes().filter(node => node.nodeTag === 'a');
        assert.equal(links.length, 0);
    }
});


const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const setup = async (t, ...args) => {
    const f = fixture(...args);
    t.after(() => { f.app.dispose();  });
    await settle();
    return f;
};
const pressTab = (f, host, name, key) => f.tab(host, name).dispatchEvent(
    new f.document.defaultView.KeyboardEvent('keydown', {key, bubbles: true}));

test('shared containers own page selection and lazy frames retain identity', async t => {
    const f = await setup(t);
    assert.equal(f.document.querySelectorAll('iframe').length, 0);
    assert.equal(f.get('index-pages').children.length, 1);
    assert.equal(f.calls.length, 0);
    assert.equal(f.get('index-pages').localName, 'gramlot-tab-container');
    f.get('open-e01').click();
    await settle();
    const frame = f.get('frame-e01');
    assert.equal(f.state.getItem('active'), 'e01');
    assert.equal(f.source('frame-e01').getAttr('src'), 'e01');
    f.get('open-e02').click(); f.tab('index-pages', 'e01').click();
    await settle();
    assert.equal(f.get('frame-e01'), frame);
    assert.equal(f.state.getItem('active'), 'e01');
    assert.equal(f.selections.at(-1).active, 'e01');
    assert.equal(f.tab('index-pages', 'e02').getAttribute('aria-selected'), 'false');
});

test('rebuilt gallery reattaches behavior and retains selection and opened Source panels', async t => {
    const f = await setup(t);
    f.get('open-e01').click();
    f.get('open-e02').click();
    await settle();
    f.renderer.freeze(f.root);
    f.renderer.unfreeze(f.root);
    await settle();
    mountGallery(f.renderer, f.root, {update() {}, setPresentation() {}});
    await settle();
    assert.equal(f.state.getItem('active'), 'e02');
    assert.equal(f.state.getItem('opened.e01'), true);
    assert.equal(f.tab('index-pages', 'e02').getAttribute('aria-selected'), 'true');
    assert.equal(f.source('frame-e01').getAttr('src'), 'e01');
    f.tab('index-pages', 'e01').click();
    await settle();
    assert.equal(f.state.getItem('active'), 'e01');
    assert.equal(f.tab('index-pages', 'e01').getAttribute('aria-selected'), 'true');
});

test('families expand independently; small-screen navigation stays open until an example is selected', async t => {
    const f = await setup(t);
    const families = [...f.document.querySelectorAll('.index-sidebar nav > ul > li > details')];
    assert.deepEqual(families.map(el => el.open), [true, false]);
    f.media.matches = true; f.media.dispatchEvent(new f.document.defaultView.Event('change'));
    f.get('gallery-mobile-menu').click();
    await settle();
    f.get('open-controllers').click();
    await settle();
    assert.equal(families[1].open, true);
    assert.equal(f.get('gallery-mobile-menu').getAttribute('aria-expanded'), 'true');
    families[1].querySelector('summary').click();
    await settle();
    assert.equal(families[1].open, false);
    assert.equal(f.get('index-sidebar').hidden, false);
    f.get('open-c01').click();
    await settle();
    assert.equal(f.get('index-sidebar').hidden, true);
    assert.equal(f.document.activeElement, f.get('index-pages'));
});

test('Explanation and source tabs preserve frames, sanitize prose and retain literal code', async t => {
    const f = await setup(t);
    f.get('open-e01').click();
    await settle();
    const frame = f.get('frame-e01');
    f.tab('preview-e01', 'Explanation').click();
    f.visible('description-e01'); f.visible('codepane-e01');
    await settle();
    assert.equal(f.tab('preview-e01', 'Example').getAttribute('aria-selected'), 'false');
    assert.equal(f.get('readme-e01').querySelector('script, [onerror], [href^="javascript:"]'), null);
    assert.equal(f.get('readme-e01').querySelector('h1').textContent, 'Example');
    assert.match(f.get('code-e01').textContent, /<script>bad\(\)<\/script>/);
    assert.equal(f.get('code-e01').querySelector('script'), null);
    f.tab('preview-e01', 'Example').click();
    await settle();
    assert.equal(f.get('frame-e01'), frame);
    f.get('open-c01').click();
    await settle();
    f.visible('codepane-c01'); await settle();
    f.tab('code-tabs-c01', 'logic.js').click();
    await settle();
    assert.equal(f.tab('code-tabs-c01', 'JavaScript').getAttribute('aria-selected'), 'false');
    assert.equal(f.get('logic-panel-c01').hidden, false);
    f.get('open-e01').click(); f.tab('index-pages', 'c01').click();
    await settle();
    assert.equal(f.get('logic-panel-c01').hidden, false);
    pressTab(f, 'code-tabs-c01', 'logic.js', 'Home');
    await settle();
    assert.equal(f.tab('code-tabs-c01', 'logic.js').getAttribute('aria-selected'), 'false');
});

test('tab keyboard navigation is built in; navigation links remain opt-in', async t => {
    const f = await setup(t);
    f.get('open-e01').click(); f.get('open-e02').click();
    await settle();
    pressTab(f, 'index-pages', 'e02', 'Home');
    await settle();
    assert.equal(f.state.getItem('active'), 'intro');
    assert.equal(f.get('open-e01').tabIndex, -1);
    f.get('keyboard-navigation').click();
    await settle();
    assert.equal(f.get('open-e01').tabIndex, 0);
    pressTab(f, 'index-pages', 'Introduction', 'End');
    await settle();
    assert.equal(f.state.getItem('active'), 'e02');
});

test('drawer visibility and file selection survive switching pages and preferences restore', async t => {
    const f = await setup(t);
    f.get('open-c01').click();
    await settle();
    const frame = f.get('frame-c01');
    f.visible('codepane-c01'); await settle();
    f.tab('code-tabs-c01', 'logic.js').click();
    await settle();
    f.get('index-code-toggle').click(); f.get('index-navigation-toggle').click();
    await settle();
    assert.equal(f.source('index-code').getAttr('drawer'), 'close');
    assert.equal(f.source('index-sidebar').getAttr('drawer'), 'close');
    const saved = f.document.defaultView.localStorage.getItem('gramlot.gallery.preferences:/py/index');
    f.get('index-code-toggle').click();
    await settle();
    assert.equal(f.get('logic-panel-c01').hidden, false);
    assert.equal(f.get('frame-c01'), frame);
    const g = await setup(t, undefined, w => w.localStorage.setItem('gramlot.gallery.preferences:/py/index', saved));
    g.get('open-e01').click();
    await settle();
    assert.equal(g.source('index-code').getAttr('drawer'), 'close');
    assert.equal(g.source('index-sidebar').getAttr('drawer'), 'close');
});

test('theme, color and label settings persist and reject foreign frame messages', async t => {
    const f = await setup(t);
    f.get('open-e01').click();
    await settle();
    const messages = [];
    const frame = f.get('frame-e01');
    frame.contentWindow.postMessage = (data, origin) => messages.push({data, origin});
    change(f, 'index-theme', 'dark'); change(f, 'index-appearance', 'mimi');
    change(f, 'gallery-label-position', 'L');
    assert.equal(f.document.documentElement.getAttribute('data-theme'), 'dark');
    assert.equal(f.state.getItem('labelPosition'), 'L');
    assert.equal(frame.getAttribute('src'), 'e01');
    const before = messages.length;
    f.document.defaultView.dispatchEvent(new f.document.defaultView.MessageEvent('message', {data: {type: THEME_READY}, source: f.document.defaultView}));
    assert.equal(messages.length, before);
    f.document.defaultView.dispatchEvent(new f.document.defaultView.MessageEvent('message', {data: {type: THEME_READY}, source: frame.contentWindow}));
    assert.ok(messages.length > before);
    const saved = f.document.defaultView.localStorage.getItem('gramlot.gallery.preferences:/py/index');
    const g = await setup(t, undefined, w => w.localStorage.setItem('gramlot.gallery.preferences:/py/index', saved));
    assert.equal(g.get('index-appearance').value, 'mimi');
    assert.equal(g.get('index-theme').value, 'dark');
});

test('invalid or unavailable browser storage leaves valid defaults and usable controls', async t => {
    for (const saved of ['{', 'null', '[]', '{"appearance":"unknown","theme":"system","sidebarWidth":"320"}']) {
        const f = await setup(t, undefined, w => w.localStorage.setItem('gramlot.gallery.preferences:/py/index', saved));
        assert.equal(f.get('index-appearance').value, 'compact');
        assert.equal(f.get('index-theme').value, 'light');
        assert.equal(f.source('index-sidebar').getAttr('width'), '240px');
    }
    for (const name of ['SecurityError', 'QuotaExceededError']) {
        const f = await setup(t, undefined, w => Object.defineProperty(w, 'localStorage', {value: {
            getItem() { if (name === 'SecurityError') throw new w.DOMException('Unavailable', name); return null; },
            setItem() { throw new w.DOMException('Unavailable', name); },
        }}));
        change(f, 'index-theme', 'dark'); f.get('open-e01').click();
    await settle();
        assert.equal(f.get('panel-e01').hidden, false);
    }
});

test('phone views preserve the same frame, Data and Source and restore desktop drawers', async t => {
    const f = await setup(t, null, w => { w.matchMedia().matches = true; });
    f.get('gallery-mobile-menu').click(); f.get('open-e01').click();
    await settle();
    const frame = f.get('frame-e01'), source = f.source('frame-e01'), win = frame.contentWindow;
    win.retainedDraft = 'Unsaved';
    for (const view of ['code', 'inspector', 'example']) {
        f.get(`gallery-view-${view}`).click();
    await settle();
        assert.equal(f.get('gallery').getAttribute('data-mobile-view'), view);
        assert.equal(f.get('frame-e01'), frame); assert.equal(f.source('frame-e01'), source);
        assert.equal(frame.contentWindow, win); assert.equal(win.retainedDraft, 'Unsaved');
    }
    f.get('gallery-mobile-menu').click(); key(f, 'gallery-mobile-menu', 'Escape');
    await settle();
    assert.equal(f.get('index-sidebar').hidden, true);
    f.media.matches = false; f.media.dispatchEvent(new f.document.defaultView.Event('change'));
    assert.equal(f.get('gallery').hasAttribute('data-mobile-view'), false);
    assert.equal(f.source('index-sidebar').getAttr('drawer'), true);
    f.behavior.dispose();
    f.media.matches = true; f.media.dispatchEvent(new f.document.defaultView.Event('change'));
    assert.equal(f.get('gallery').hasAttribute('data-mobile-view'), false);
});

test('empty Logic is hidden and closing gallery behavior detaches navigation', async t => {
    const f = await setup(t, 'export class Logic {}');
    assert.equal(f.get('logic-panel-c01'), null);
    f.get('open-c01').click();
    await settle();
    f.visible('codepane-c01'); await settle();
    assert.equal(f.source('logic-panel-c01').getAttr('hidden'), true);
    f.get('open-e01').click();
    await settle();
    f.behavior.dispose();
    f.get('open-e02').click();
    await settle();
    assert.equal(f.get('frame-e02'), null);
});


test('repeated clicks create one Source panel and request each view once', async t => {
    const f = await setup(t);
    f.get('open-e01').click(); f.get('open-e01').click(); f.get('open-e01').click();
    await settle();
    const frame = f.get('frame-e01');
    frame.contentWindow.draft = 'Retain me';
    f.get('open-e02').click(); await settle();
    f.get('open-e01').click(); await settle();
    assert.equal(f.get('frame-e01'), frame);
    assert.equal(frame.contentWindow.draft, 'Retain me');
    assert.equal(f.calls.filter(call => call.key === 'e01').length, 1);
    assert.equal(f.document.querySelectorAll('#panel-e01').length, 1);
    assert.equal(f.get('index-pages').children.length, 3);
});

test('out-of-order lesson replies do not override the latest selection', async t => {
    const f = await setup(t);
    const call = f.transport.call;
    let release;
    const held = new Promise(resolve => { release = resolve; });
    f.transport.call = async text => {
        if (fromTytx(text).params.key === 'e01') await held;
        return call(text);
    };
    f.get('open-e01').click(); f.get('open-e02').click();
    await settle();
    assert.equal(f.state.getItem('active'), 'e02');
    release(); await settle();
    assert.equal(f.state.getItem('active'), 'e02');
    f.get('open-e01').click(); await settle();
    assert.equal(f.state.getItem('active'), 'e01');
    assert.equal(f.calls.filter(call => call.key === 'e01').length, 1);
});

test('failed lesson removes incomplete Source and can be retried', async t => {
    const f = await setup(t);
    const call = f.transport.call;
    f.transport.call = async () => { throw new Error('Connection interrupted'); };
    f.get('open-e01').click(); await settle();
    assert.equal(f.get('panel-e01'), null);
    assert.equal(f.get('codepane-e01'), null);
    assert.equal(f.state.getItem('active'), 'intro');
    assert.match(f.get('gallery-load-status').textContent, /retry/);
    f.transport.call = call;
    f.get('open-e01').click(); await settle();
    assert.equal(f.state.getItem('active'), 'e01');
    assert.equal(f.get('gallery-load-status').textContent, '');
});

test('hidden teaching content makes no requests; visible content never delays the frame and loads once', async t => {
    const f = await setup(t);
    f.get('open-e01').click(); await settle();
    const frame = f.get('frame-e01');
    assert.equal(frame.getAttribute('src'), 'e01');
    assert.equal(f.get('readme-e01'), null);
    assert.equal(f.get('code-e01'), null);
    assert.deepEqual(f.calls.map(c => c.view ?? 'example'), ['example']);
    f.visible('codepane-e01', false); f.visible('description-e01', false); await settle();
    assert.equal(f.calls.length, 1);
    const call = f.transport.call;
    let release;
    const held = new Promise(resolve => { release = resolve; });
    f.transport.call = async text => { if (fromTytx(text).params.view === 'code') await held; return call(text); };
    f.visible('codepane-e01'); f.visible('codepane-e01', false); f.visible('codepane-e01');
    await settle();
    assert.equal(f.get('frame-e01'), frame);
    assert.equal(f.state.getItem('active'), 'e01');
    f.visible('description-e01'); await settle();
    assert.ok(f.get('readme-e01').querySelector('h1'));
    release(); await settle();
    assert.ok(f.get('code-e01').querySelector('.code-line'));
    for (let i = 0; i < 3; i++) for (const id of ['codepane-e01', 'description-e01']) {
        f.visible(id, false); f.visible(id);
    }
    await settle();
    assert.deepEqual(f.calls.map(c => c.view ?? 'example'), ['example', 'description', 'code']);
});

test('secondary content failure retains the running example and retries on reopening', async t => {
    const f = await setup(t);
    f.get('open-e01').click(); await settle();
    const frame = f.get('frame-e01'); frame.contentWindow.draft = 'Keep me';
    const call = f.transport.call;
    f.transport.call = async text => {
        if (fromTytx(text).params.view === 'description') throw new Error('Offline');
        return call(text);
    };
    f.visible('description-e01'); await settle();
    assert.match(f.get('description-e01').textContent, /retry/);
    assert.equal(f.get('frame-e01'), frame);
    f.transport.call = call;
    f.visible('description-e01', false); f.visible('description-e01'); await settle();
    assert.ok(f.get('readme-e01').querySelector('h1'));
    assert.equal(frame.contentWindow.draft, 'Keep me');
});

test('remount while loading reuses the pending Source request and formats its result', async t => {
    const f = await setup(t);
    f.get('open-e01').click(); await settle();
    const call = f.transport.call;
    let release, requested = 0;
    const held = new Promise(resolve => { release = resolve; });
    f.transport.call = async text => { requested++; await held; return call(text); };
    f.visible('codepane-e01'); await settle();
    f.behavior.dispose();
    const behavior = mountGallery(f.renderer, f.root, {update() {}, setPresentation() {}});
    t.after(() => behavior.dispose());
    f.visible('codepane-e01'); await settle();
    assert.equal(requested, 1);
    release(); await settle();
    assert.ok(f.get('code-e01').querySelector('.code-line'));
});
