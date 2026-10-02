import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import test from 'node:test';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {JSDOM, VirtualConsole} from 'jsdom';

// The core as the example pages resolve it (`node_modules/@gramlot/gramlot`, installed from npm): one
// module instance, so the `@source` markers of the pages are the ones `sourceMethod` reads.
const fromExamples = createRequire(new URL('../package.json', import.meta.url));
const {Gramlot} = await import(pathToFileURL(fromExamples.resolve('@gramlot/gramlot')).href);
const {sourceMethod} = await import(pathToFileURL(fromExamples.resolve('@gramlot/gramlot/page')).href);

const families = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url), 'utf8'));
const folder = key => new URL(`../src/gramlot_examples/pages/${key}/`, import.meta.url);

/**
 * Mount one JavaScript example as its host would: Source from `main`, companion Logic registered
 * as the root group, `remoteSource` answered by the Page's declared Source methods.
 */
async function mount(family, example) {
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(error));
    const dom = new JSDOM('<main id="gramlot-root"></main>', {url: `https://gallery.test/js/${example.key}`,
        virtualConsole});
    const {Page} = await import(new URL(`${example.folder}.js`, folder(family.key)));
    const wire = async (method, params) => {
        const page = new Page();
        const builder = new Page.sourceBuilder();
        if (method === 'main') await page.main(builder.root);
        else await sourceMethod(page, method).call(page, builder.root, params);
        return builder.toTytx();
    };
    const transport = {main: () => wire('main'), source: (_pageId, method, params) => wire(method, params)};
    const app = new Gramlot({document: dom.window.document, pageId: example.key, transport});
    const companion = new URL(`${example.folder}_aux.js`, folder(family.key));
    if (existsSync(companion)) {
        const {Logic} = await import(companion);
        app.logicRegistry.register(Logic, {group: null, resource: `/${example.key}_aux.js`});
    }
    await app.start();
    const byId = id => dom.window.document.getElementById(id);
    const data = path => app.data.getItem(path);
    const edit = (id, value, type = 'change') => {
        byId(id).value = value;
        byId(id).dispatchEvent(new dom.window.Event(type, {bubbles: true}));
    };
    const click = (id, options = {}) => byId(id).dispatchEvent(new dom.window.MouseEvent('click',
        {bubbles: true, cancelable: true, ...options}));
    return {app, dom, window: dom.window, byId, data, edit, click, errors};
}

const tick = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// One behaviour of each page, checked on the JavaScript twin; the Python twin has the same Source.
const CHECKS = {
    b01({byId, edit}) {
        assert.equal(byId('caption').textContent, 'Pointers');
        assert.equal(byId('form-name').textContent, 'Ada Lovelace');
        edit('caption-field', 'New caption');
        assert.equal(byId('caption').textContent, 'New caption');
        assert.equal(byId('symbolic').textContent, 'New caption');
        assert.equal(byId('first-caption').textContent, 'Pointers');
        assert.equal(byId('role').textContent, 'Mathematician');
        edit('role-field', 'Writer');
        assert.equal(byId('role').textContent, 'Writer');
    },
    b02({byId, edit, data}) {
        assert.equal(byId('name').textContent, 'Ada Lovelace');
        edit('record', 'people.alan');
        assert.equal(byId('field').textContent, 'Computer science');
        edit('name-field', 'A. M. Turing');
        edit('record', 'people.grace');
        assert.equal(byId('name').textContent, 'Grace Hopper');
        assert.equal(data('people.alan.name'), 'A. M. Turing');
    },
    b03({byId}) {
        assert.equal(byId('customer').value, 'Grace Hopper');
        assert.equal(byId('quantity').value, '1');
        assert.equal(byId('out-note').textContent, 'No note');
        assert.equal(byId('out-price').textContent, '12.5');
        assert.equal(byId('out-currency').textContent, 'EUR');
        assert.equal(byId('out-city').textContent, 'London');
    },
    b04({byId, edit, click, data, window}) {
        assert.equal(byId('text').value, 'Edit me');
        assert.equal(byId('color').value, '#456bc4');
        assert.deepEqual([...byId('topics').selectedOptions].map(option => option.value), ['html', 'data']);
        edit('text', 'typed', 'input');
        assert.equal(data('edit.text'), 'Edit me', 'not live: input does not write');
        byId('text').dispatchEvent(new window.Event('change', {bubbles: true}));
        assert.equal(byId('out-text').textContent, 'typed');
        click('live');
        assert.equal(data('edit.live'), true);
        edit('number', '7', 'input');
        assert.equal(data('edit.number'), 7);
        assert.equal(byId('out-number').textContent, '7');
        edit('size', 'L');
        assert.equal(data('edit.size'), 'L');
    },
    b05({byId, click, data}) {
        assert.equal(byId('newsletter').checked, true);
        assert.equal(byId('plus').checked, true);
        click('invoice');
        assert.equal(data('choice.invoice'), true);
        click('team');
        assert.deepEqual(['basic', 'plus', 'team'].map(key => data(`choice.plan.${key}`)), [null, false, true]);
        click('basic');
        assert.deepEqual(['basic', 'plus', 'team'].map(key => data(`choice.plan.${key}`)), [true, false, false]);
        assert.equal(byId('out-plan-plus').textContent, 'false');
    },
    b06({byId, click, edit}) {
        const box = byId('box');
        assert.equal(box.className, 'card');
        assert.equal(box.style.fontSize, '1.5rem');
        assert.equal(box.style.borderTopLeftRadius, '8px');
        assert.equal(box.style.borderStyle, 'dashed');
        edit('style', 'color: red');
        assert.equal(box.style.color, 'rgb(255, 255, 255)', 'the shortcut wins over style');
        click('show');
        assert.equal(box.style.visibility, 'hidden');
        click('hide');
        assert.equal(box.hidden, true);
        edit('tone', 'card status status--warning');
        assert.equal(box.className, 'card status status--warning');
    },
    b07({byId, edit}) {
        assert.equal(byId('circle').getAttribute('r'), '40');
        assert.equal(byId('circle').namespaceURI, 'http://www.w3.org/2000/svg');
        edit('radius', '65', 'input');
        assert.equal(byId('circle').getAttribute('r'), '65');
        assert.equal(byId('radius-label').textContent, '65');
        edit('bar', '#23745b');
        assert.equal(byId('bar-shape').getAttribute('fill'), '#23745b');
    },
    b08({byId, click}) {
        const items = () => byId('items').querySelectorAll('li').length;
        click('freeze');
        assert.equal(byId('frozen').textContent, 'true');
        click('add');
        assert.equal(byId('count').textContent, '1', 'built elements follow the Data under freeze');
        click('removeLast');
        click('removeLast');
        assert.equal(items(), 3, 'the removal waits for the thaw');
        click('thaw');
        assert.equal(items(), 1);
        assert.equal(byId('count').textContent, '1');
        assert.equal(byId('frozen').textContent, 'false');
    },
    b09({byId, edit, click, data}) {
        assert.equal(byId('name').value, 'Ada Lovelace');
        assert.equal(byId('weekly').checked, true);
        assert.equal(byId('region').value, 'south');
        edit('name', 'Grace Hopper');
        assert.equal(byId('out-name').textContent, 'Grace Hopper');
        edit('intensity', '85', 'input');
        assert.equal(data('form.intensity'), 85);
        click('daily');
        assert.equal(data('form.frequency.weekly'), false);
        assert.equal(data('form.frequency.daily'), true);
    },
    b10({byId, edit}) {
        assert.equal(byId('rect').getAttribute('width'), '95');
        edit('stroke', '12', 'input');
        assert.equal(byId('polyline').getAttribute('stroke-width'), '12');
        edit('label', 'Shapes', 'input');
        assert.equal(byId('caption').textContent, 'Shapes');
        edit('triangle', '#b13d48');
        assert.equal(byId('polygon').getAttribute('fill'), '#b13d48');
    },
    b11({byId, edit, click, dom}) {
        assert.equal(byId('title').textContent, 'A day of small interfaces');
        assert.equal(dom.window.document.querySelector('main').tagName, 'MAIN');
        edit('title-field', 'Small interfaces', 'input');
        assert.equal(byId('title').textContent, 'Small interfaces');
        click('show-theo');
        assert.equal(byId('session-1').style.visibility, 'hidden');
        assert.equal(byId('session-2').style.visibility, '');
        assert.equal(byId('ring-studio').style.visibility, '');
        assert.equal(byId('ring-entrance').style.visibility, 'hidden');
        click('stop-hall');
        assert.equal(byId('ring-studio').style.visibility, 'hidden');
        assert.equal(byId('ring-hall').style.visibility, '');
        click('faq-open');
        assert.ok([...dom.window.document.querySelectorAll('details')].every(details => details.open));
    },
    c01({byId, edit}) {
        assert.equal(byId('total').textContent, '50');
        assert.equal(byId('gross').textContent, '60');
        assert.equal(byId('size').textContent, 'small order');
        edit('vat', '0.1', 'input');
        assert.equal(byId('gross').textContent, '60', 'a = parameter does not trigger');
        edit('quantity', '10', 'input');
        assert.equal(byId('total').textContent, '125');
        assert.equal(byId('gross').textContent, '137.5');
        assert.equal(byId('size').textContent, 'large order');
    },
    async c02({byId, edit, click}) {
        assert.equal(byId('warning').style.visibility, 'hidden');
        edit('name', '  ', 'input');
        assert.equal(byId('warning').style.visibility, '');
        click('request');
        click('request');
        assert.equal(byId('requests').textContent, '2');
        edit('query', 'svg', 'input');
        assert.equal(byId('searched').textContent, '');
        await tick(450);
        assert.equal(byId('searched').textContent, 'Searching for svg');
        await tick(0);
        assert.ok(Number(byId('ticks').textContent) >= 1, '_onStart ran');
        edit('interval', '0');
    },
    c03({byId, edit}) {
        assert.equal(byId('final').textContent, '80');
        edit('price', '120', 'input');
        assert.equal(byId('final').textContent, '108');
        assert.equal(byId('changes').textContent, '1');
        assert.match(byId('reason').textContent, /: price 120$/);
    },
    c04({byId, edit, click, data}) {
        assert.equal(byId('full-name').textContent, 'Ada Lovelace');
        assert.equal(byId('verdict').textContent, 'Not yet');
        assert.equal(byId('bar').getAttribute('width'), '120');
        assert.equal(byId('start').disabled, true);
        edit('score', '70', 'input');
        assert.equal(byId('verdict').className, 'status status--success');
        assert.equal(byId('verdict').title, 'Score 70 of 100');
        edit('last', 'Byron', 'input');
        assert.equal(byId('full-name').textContent, 'Ada Byron');
        click('accepted');
        assert.equal(byId('start').disabled, false);
        click('start');
        assert.equal(data('player.started'), true);
    },
    async c05({byId, click}) {
        click('set');
        assert.equal(byId('value').textContent, '1');
        assert.equal(byId('notified').textContent, '1');
        click('put');
        assert.equal(byId('value').textContent, '1', 'PUT is silent');
        assert.equal(byId('notified').textContent, '1');
        click('get');
        assert.equal(byId('read').textContent, '11');
        click('fire');
        click('fire');
        assert.equal(byId('pings').textContent, '2', 'FIRE is delivered also with an equal value');
        assert.equal(byId('last').textContent, 'now');
        click('fire-after');
        assert.equal(byId('pings').textContent, '2');
        await tick(1050);
        assert.equal(byId('pings').textContent, '3');
        assert.equal(byId('last').textContent, 'later');
    },
    c06({byId, click}) {
        click('press');
        click('press', {shiftKey: true});
        assert.equal(byId('clicks').textContent, '2');
        assert.equal(byId('keys').textContent, 'Shift');
        click('save');
        assert.equal(byId('saved-with').textContent, 'fired with true');
        click('save', {altKey: true});
        assert.equal(byId('saved-with').textContent, 'fired with Alt');
        click('save-close');
        assert.equal(byId('log').textContent, 'save, close');
    },
    c07({byId, click, edit, window}) {
        click('chip-green');
        assert.equal(byId('clicked').textContent, 'chip-green');
        edit('typing', 'abc', 'input');
        assert.equal(byId('length').textContent, '3');
        byId('typing').dispatchEvent(new window.KeyboardEvent('keydown', {key: 'x', bubbles: true}));
        assert.equal(byId('key').textContent, 'x');
        byId('hover-box').dispatchEvent(new window.MouseEvent('mouseover', {bubbles: true}));
        assert.equal(byId('hover-box').className, 'card status status--success');
        byId('hover-box').dispatchEvent(new window.MouseEvent('mouseout', {bubbles: true}));
        assert.equal(byId('hover-box').className, 'card');
    },
    async c08({byId, click, edit, data}) {
        assert.equal(byId('remote-title'), null);
        edit('topic', 'svg');
        click('load');
        await tick(10);
        assert.equal(byId('remote-title').textContent, 'SVG');
        assert.match(byId('remote-summary').textContent, /SVG attributes/);
        assert.equal(data('topics.svg.title'), 'SVG');
    },
    async c09({app, byId, edit, click, data}) {
        // 1. first render
        assert.equal(byId('caption').textContent, 'The story of a page');
        assert.equal(byId('quantity').value, '2');
        assert.equal(byId('total').textContent, '2');
        assert.equal(byId('circle').getAttribute('r'), '28');
        assert.equal(byId('circle').getAttribute('fill'), '#23745b');
        assert.equal(byId('small').checked, true);
        // 2. editing, live false then true
        edit('caption-field', 'Typed', 'input');
        assert.equal(byId('caption').textContent, 'The story of a page');
        click('live');
        edit('caption-field', 'Typed live', 'input');
        assert.equal(byId('caption').textContent, 'Typed live');
        // 3, 4. formula, controller, radio
        click('large');
        assert.deepEqual([data('story.size.small'), data('story.size.large')], [false, true]);
        assert.equal(byId('total').textContent, '6');
        edit('quantity', '4');
        assert.equal(byId('total').textContent, '12');
        assert.equal(byId('circle').getAttribute('fill'), '#b13d48');
        // 5. button
        click('press', {shiftKey: true});
        assert.equal(byId('presses').textContent, 'Pressed 1 times');
        assert.equal(byId('modifiers').textContent, 'with Shift');
        // 6. remote Source
        click('loadExtras');
        await tick(10);
        assert.equal(byId('extras-title').textContent, 'Extras from the server');
        // 7. freeze, Data change, removal, one thaw
        click('freeze');
        click('removeNote');
        edit('quantity', '1');
        assert.equal(byId('notes').children.length, 2);
        click('thaw');
        assert.equal(byId('notes').children.length, 1);
        assert.equal(byId('total').textContent, '3');
        // 8. close
        app.dispose();
        assert.equal(app.state, 'disposed');
    },
};

test('every family folder has a README and every example its Python, JavaScript and README files', () => {
    assert.deepEqual(families.map(({key}) => key), ['html_svg', 'binding', 'controllers']);
    const keys = new Set();
    for (const family of families) {
        assert.ok(existsSync(new URL('README.md', folder(family.key))), `${family.key}/README.md`);
        for (const example of family.examples) {
            assert.ok(!keys.has(example.key), `unique route ${example.key}`);
            keys.add(example.key);
            for (const suffix of ['.py', '.js', '.md']) {
                assert.ok(existsSync(new URL(`${example.folder}${suffix}`, folder(family.key))),
                    `${family.key}/${example.folder}${suffix}`);
            }
        }
    }
});

for (const family of families.filter(({key}) => key !== 'html_svg')) {
    for (const example of family.examples) {
        test(`${family.key}/${example.folder}: mounts without errors and behaves as its README says`, async () => {
            for (const suffix of ['.py', '.js']) {
                const text = readFileSync(new URL(`${example.folder}${suffix}`, folder(family.key)), 'utf8');
                assert.doesNotMatch(text, /\bpage\s*=/, 'never page for an element');
            }
            const page = await mount(family, example);
            try {
                assert.ok(page.byId('gramlot-root').childElementCount > 0);
                await CHECKS[example.key]?.(page);
                assert.deepEqual(page.errors, []);
            } finally {
                page.app.dispose();
            }
        });
    }
}
