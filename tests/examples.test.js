import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import tree from '@gramlot/gramlot/components/tree';
import editors from '@gramlot/gramlot/components/editors';
import typst from '@gramlot/gramlot/components/typst';
import {buildGallery} from '../src/gramlot_examples/index.js';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import test from 'node:test';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {JSDOM, VirtualConsole} from 'jsdom';

// The core as the example pages resolve it (`node_modules/@gramlot/gramlot`, installed from npm).
const fromExamples = createRequire(new URL('../package.json', import.meta.url));
const {Gramlot} = await import(pathToFileURL(fromExamples.resolve('@gramlot/gramlot')).href);
const {GramlotFileServer} = await import(pathToFileURL(fromExamples.resolve('@gramlot/gramlot/server')).href);

const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url), 'utf8'));
const folder = key => new URL(`../src/gramlot_examples/pages/${families.find(f => f.key === key).folder}/`, import.meta.url);

/**
 * Mount one JavaScript example as its server would: the core GramlotFileServer of the family folder answers
 * the request envelopes (`main` and the endpoints), the module's Logic, when it has one, is registered as the root group.
 */
async function mount(family, example, {hold = null} = {}) {
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(error));
    const dom = new JSDOM('<main id="gramlot-root"></main>', {url: `https://gallery.test/js/${example.key}`,
        virtualConsole, pretendToBeVisual:true});
    // Geometry is qualified in real browsers; JSDOM needs these layout surfaces.
    dom.window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    Object.defineProperty(dom.window.document, 'fonts', {value:new dom.window.EventTarget()});
    // jsdom has no native popover API; real positioning is covered in browser checks.
    dom.window.HTMLElement.prototype.showPopover = function () {};
    dom.window.HTMLElement.prototype.hidePopover = function () {};

    // A page module that names no client method exports no Logic.
    const {Logic} = await import(pathToFileURL(buildGallery().routes[example.key].logic));
    const server = new GramlotFileServer(fileURLToPath(folder(family.key)));
    const {pageId} = await server.registerPage(`/${example.folder}`);
    const calls = [];
    // `hold(request)` true keeps the answer of that request until `release()`, to observe a request in flight.
    const held = [];
    const transport = {call(text) {
        const request = JSON.parse(text);
        calls.push(request);
        if (!hold?.(request)) return server.call(text);
        return new Promise(resolve => held.push(() => resolve(server.call(text))));
    }, close() {}, dispose() {}};
    const app = new Gramlot({document: dom.window.document, pageId, transport, collections:[inputs,layout,tree,editors,typst]});
    if (Logic) app.src.logicRegistry.register(Logic, {group: null, resource: `/${example.key}.js`});
    await app.start();
    const byId = id => dom.window.document.getElementById(id);
    const data = path => app.data.getItem(path);
    const edit = (id, value, type = 'change') => {
        byId(id).value = value;
        byId(id).dispatchEvent(new dom.window.Event(type, {bubbles: true}));
    };
    const click = (id, options = {}) => byId(id).dispatchEvent(new dom.window.MouseEvent('click',
        {bubbles: true, cancelable: true, ...options}));
    const release = () => held.splice(0).forEach(answer => answer());
    return {app, dom, window: dom.window, byId, data, edit, click, calls, errors, release};
}

const tick = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// One behaviour of each page, checked on the JavaScript twin; the Python twin has the same Source.
const CHECKS = {
    async b12({byId, data, app, edit, click}) {
        assert.equal(byId('customer-name').value, 'Ada Lovelace');
        assert.equal(byId('draft-name').value, '');
        assert.equal(byId('draft-city').value, '');
        edit('draft-name', 'Manual draft', 'input');
        assert.equal(byId('draft-preview').textContent, 'Manual draft');
        assert.equal(data('customer.name'), 'Ada Lovelace');
        click('fill-sample');
        assert.equal(byId('draft-name').value, 'Ada Lovelace');
        assert.equal(byId('draft-city').value, '', 'the second field waits');
        await tick(350);
        assert.equal(byId('draft-city').value, 'London');
        assert.notEqual(data('draft'), data('customer'));
        assert.equal(data('draft.credit').toString(), '1250.5');
        assert.equal(app.data.getNode('draft.name').getAttr('caption'), 'Customer name');
        edit('draft-name', 'Grace', 'input');
        assert.equal(data('customer.name'), 'Ada Lovelace');
        click('clear-draft');
        assert.equal(byId('draft-name').value, '');
        assert.equal(byId('draft-city').value, '');
        click('fill-sample');
        assert.equal(byId('draft-preview').textContent, 'Ada Lovelace');
        click('clear-draft');
        await tick(350);
        assert.equal(byId('draft-city').value, '', 'Clear cancels the pending field');
        click('fill-sample');
        await tick(100);
        app.data.setItem('customer.city', 'Paris');
        click('fill-sample');
        await tick(220);
        assert.equal(byId('draft-city').value, '', 'a new Play restarts the pause');
        app.data.setItem('customer.city', 'Rome');
        await tick(130);
        assert.equal(byId('draft-city').value, 'Paris', 'Play uses its own snapshot');
        assert.equal(data('ui.playSample'), null);
    },
    async w29({byId, data, window}) {
        const row = (id, path) => byId(id).shadowRoot.querySelector(`[data-path="${path}"] > .row`);
        const values = new Map();
        const transfer = {dropEffect: 'none', effectAllowed: 'all', clearData: () => values.clear(),
            setData: (type, value) => values.set(type, value), setDragImage() {}};
        const send = (type, id, path) => {
            const event = new window.Event(type, {bubbles: true, composed: true, cancelable: true});
            Object.defineProperty(event, 'dataTransfer', {value: transfer});
            row(id, path).dispatchEvent(event);
        };
        send('dragstart', 'drag-documents', 'brief');
        assert.ok(values.has('app/document'));
        send('dragover', 'drop-folders', 'inbox');
        assert.equal(transfer.dropEffect, 'copy');
        assert.ok(row('drop-folders', 'inbox').classList.contains('canBeDropped'));
        send('drop', 'drop-folders', 'inbox'); await tick();
        send('dragend', 'drag-documents', 'brief'); await tick();
        assert.equal(data('treeDrag.folders.inbox.brief'), 'Project brief');
        assert.equal(data('treeDrag.documents.brief'), 'Project brief');
        assert.equal(byId('last-drop').textContent, 'Copied Project brief to Inbox');
        assert.equal(byId('last-drag-end').textContent, 'Browser gesture: copy');
        row('drop-folders', 'inbox').querySelector('button').click(); await tick();
        assert.equal(row('drop-folders', 'inbox.brief').querySelector('.caption').textContent, 'Project brief');
        send('dragstart', 'drag-documents', 'notes');
        send('dragover', 'drop-folders', 'archive');
        assert.equal(transfer.dropEffect, 'none');
        assert.ok(row('drop-folders', 'archive').classList.contains('cannotBeDropped'));
        send('drop', 'drop-folders', 'archive');
        send('dragend', 'drag-documents', 'notes'); await tick();
        assert.equal(data('treeDrag.folders.archive').getNodes().length, 0);
        assert.equal(byId('last-drag-end').textContent, 'Browser gesture: none');
        assert.equal(byId('drop-folders').shadowRoot.querySelector('.cannotBeDropped'), null);
    },
    async w27({byId, data}) {
        const row = path => byId('styled-tree').shadowRoot.querySelector(`[data-path="${path}"]`);
        row('documents').querySelector('button').click();
        assert.ok(row('documents').querySelector('.caption').classList.contains('caption-open'));
        row('documents.notes').querySelector('.row').click(); await tick();
        assert.equal(data('treeStyle.selection'), 'documents.notes');
        assert.ok(row('documents.notes').classList.contains('attention-node'));
        assert.ok(row('documents.notes').querySelector('.caption').classList.contains('caption-selected'));
        byId('styled-rename').click(); await tick();
        assert.equal(row('documents.notes').querySelector('.caption').textContent, 'Updated notes');
    },
    async w28({byId, data}) {
        const row = path => byId('rich-callback-tree').shadowRoot.querySelector(`[data-path="${path}"]`);
        assert.equal(row('documents').querySelector('.caption strong').textContent, 'Documents');
        assert.ok(row('starred').querySelector('.icon').classList.contains('favorite-icon'));
        row('documents').querySelector('button').click();
        assert.match(row('documents').querySelector('.caption').textContent, /open/);
        row('documents.notes').querySelector('.row').click(); await tick();
        assert.equal(data('treeLabels.selection'), 'documents.notes');
        byId('toggle-rich').click(); await tick();
        assert.equal(row('documents').querySelector('.caption strong'), null);
        assert.equal(row('documents').querySelector('.caption').textContent, 'Documents');
    },
    async w26({app, byId, data, calls}) {
        const host = byId('example-tree');
        const row = path => host.shadowRoot.querySelector(`[data-path="${path}"]`);
        assert.equal(app.data.getNode('treeDemo.nodes.catalog').staticValue, null);
        assert.equal(calls.filter(call => call.name === 'catalog_children').length, 0);
        byId('tree-select-notes').click(); await tick();
        assert.equal(data('treeDemo.selection'), 'documents.notes');
        assert.equal(row('documents').getAttribute('aria-expanded'), 'true');
        byId('tree-rename').click(); await tick();
        assert.equal(row('documents.notes').querySelector('.caption').textContent, 'Meeting notes');
        row('catalog').querySelector('button').click(); await tick(); await tick();
        assert.ok(row('catalog.books'));
        assert.equal(calls.filter(call => call.name === 'catalog_children').length, 1);
        row('catalog').querySelector('button').click();
        row('catalog').querySelector('button').click(); await tick();
        assert.equal(calls.filter(call => call.name === 'catalog_children').length, 1);
    },
    async w25({byId, data: pageData, window}) {
        const data = path => pageData('profile.' + path);
        const edit = (id, value) => {
            const input = byId(id).control; input.value = value;
            for (const type of ['input', 'change']) input.dispatchEvent(new window.Event(type, {bubbles:true}));
        };
        edit('code','abc'); assert.equal(data('code'),'ABC');
        edit('code','123'); assert.equal(data('code'),'ABC');
        edit('email','invalid'); assert.equal(data('email'),'invalid');
        edit('nickname','admin'); assert.equal(data('nickname'),'Ada');
        edit('nickname','Eve'); assert.equal(data('validation_status'),'Accepted: Eve');
        edit('remote-name','taken'); await tick(30); assert.equal(data('remote_name'),'AVAILABLE');
        edit('remote-name','new'); await tick(30); assert.equal(data('remote_name'),'NEW');
    },
    w18({byId, data, window}) {
        const name=byId('name'), input=name.control;
        input.value='A'; input.dispatchEvent(new window.Event('change',{bubbles:true}));
        assert.equal(data('name'),'Ada'); assert.equal(name.message.hidden,false);
        input.value='Grace'; input.dispatchEvent(new window.Event('change',{bubbles:true}));
        assert.equal(data('name'),'Grace'); assert.equal(name.message.hidden,true);
    },
    w16({byId, data}) {
        const box=(id,code)=>byId(id).control.querySelector(`input[value="${code}"]`);
        assert.equal(data('channels'),'email,push');
        box('channels','sms').click(); assert.equal(data('channels'),'email,push,sms');
        assert.equal(box('channels-copy','sms').checked,true);
        for(const code of ['email','push','sms']) box('channels-copy',code).click();
        assert.equal(data('channels'),null);
        assert.equal([...byId('channels').control.querySelectorAll('input')].some(box=>box.checked),false);
    },
    async w15({byId, data, app}) {
        await tick();
        assert.equal(byId('choice').control.value, 'Rome');
        // No popup API exists in jsdom; browser tests cover the actual query gesture.
        app.data.setItem('choice', 'New city');
        assert.equal(data('choice'), 'New city');
        assert.equal(byId('choice-copy').control.value, 'New city');
    },
    async w13({byId, data, app}) {
        await tick();
        assert.equal(byId('choice').control.value, 'Express');
        assert.equal(data('choice'), 'express');
        app.data.setItem('choice', 'pickup'); await tick();
        assert.equal(byId('choice-copy').control.value, 'Pick up');
    },
    async w14({byId, data, app}) {
        await tick();
        const samples = data('samples');
        assert.equal(samples.getNodes().length, 100);
        const first = samples.getItem('item_001.name');
        assert.match(first, /^Sample 001 — value \d+$/);
        assert.equal(byId('choice').control.value, first);
        // The callback uses ordinary Data access; repeated searches preserve the dataset.
        const reader = {GET: path => app.data.getItem(path)};
        const one = app.logic.searchChoices(reader, {_querystring: 'Sample 02'});
        const two = app.logic.searchChoices(reader, {_querystring: 'Sample 02'});
        assert.equal(one.rows.length, 10); assert.deepEqual(one, two);
        app.data.setItem('choice', 'item_025'); await tick();
        assert.equal(byId('choice-copy').control.value, samples.getItem('item_025.name'));
        assert.equal(samples.getItem('item_001.name'), first);
    },
    c22({app, byId, edit, click, data}) {
        assert.equal(byId('width-preview').style.width, '38px');
        edit('width-input', '80', 'input');
        assert.equal(byId('width-preview').style.width, '80px');
        assert.equal(data('transforms.width'), 80);
        edit('width-input', '', 'input');
        assert.equal(byId('width-preview').style.width, '');
        assert.equal(byId('name-input').readOnly, true);
        click('draft-input');
        assert.equal(byId('name-input').readOnly, false);
        edit('amount-input', '45.5', 'input');
        assert.equal(byId('amount-display').textContent, app.format(45.5, {pattern: '0.00', mask: 'Total: {} €'}));
        assert.equal(byId('amount-title').title, app.format(45.5, {pattern: '0.00', mask: '{} €'}));
        assert.equal(data('transforms.amount'), 45.5);
    },

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
        assert.deepEqual(data('form.topics'), ['html']);
        assert.deepEqual([...byId('topics').selectedOptions].map(option => option.value), ['html']);
        edit('topics', 'svg');
        assert.deepEqual(data('form.topics'), ['svg']);
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
    async c08({app, byId, edit, click, data, calls}) {
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
        // 6. freeze, Data change, removal, one thaw
        click('freeze');
        click('removeNote');
        edit('quantity', '1');
        assert.equal(byId('notes').children.length, 2);
        click('thaw');
        assert.equal(byId('notes').children.length, 1);
        assert.equal(byId('total').textContent, '3');
        // 7. later 0.2.14 stage: only explicit requests update the server quote.
        const requests = () => calls.filter(({contentType, name}) => contentType === 'data' && name === 'quote');
        assert.equal(requests().length, 0, 'the complete local trial needed no endpoint call');
        assert.equal(byId('quote').textContent, '');
        click('small'); edit('quantity', '2');
        click('request-quote'); await tick(0);
        assert.equal(data('story.quote'), 2);
        click('large'); click('gift');
        assert.equal(byId('total').textContent, '11');
        assert.equal(byId('quote').textContent, '2');
        assert.equal(requests().length, 1, 'editing does not trigger the click-only RPC');
        click('request-quote'); await tick(0);
        assert.equal(data('story.quote'), 11, 'the = arguments are read afresh on click');
        edit('quantity', '0'); click('request-quote'); await tick(0);
        assert.equal(byId('quote-error').textContent, 'application_error: Choose at least one item');
        assert.equal(data('story.quote'), 11, 'failure preserves the last successful quote');
        edit('quantity', ''); click('request-quote'); await tick(0);
        assert.equal(byId('quote-error').textContent, 'application_error: Choose at least one item');
        assert.equal(data('story.quote'), 11);
        edit('quantity', '3'); click('request-quote'); await tick(0);
        assert.equal(data('story.quote'), 14);
        assert.equal(byId('quote-error').textContent, '', 'success clears the previous error');
        assert.equal(requests().length, 5);
        // 8. close
        app.dispose();
        assert.equal(app.state, 'disposed');
    },
    async c09({byId, data}) {
        await tick(0);
        assert.equal(byId('price').textContent, '12.5');
        assert.equal(byId('rate').textContent, '22');
        assert.equal(data('invoice.gross'), 15.25, 'the endpoint answered the _init call');
        assert.equal(byId('gross').textContent, '15.25');
    },
    async c10({byId, edit}) {
        await tick(550);
        assert.equal(byId('total').textContent, '10');
        assert.equal(byId('status').textContent, 'Answered 10 for 1');
        edit('quantity', '1', 'input');
        edit('quantity', '12', 'input');
        await tick(0);
        assert.equal(byId('total').textContent, '10', '_delay waits for a pause');
        await tick(550);
        assert.equal(byId('total').textContent, '96');
        assert.equal(byId('status').textContent, 'Answered 96 for 12');
    },
    async c11({byId, click, data}) {
        click('reserve');
        await tick(0);
        assert.equal(byId('error').textContent, 'application_error: Lamp is out of stock');
        assert.equal(data('stock.reserved'), null, 'a failed call writes nothing');
        click('cancel');
        await tick(0);
        assert.equal(byId('error').textContent, 'not_authenticated: Access refused: cancel');
        assert.equal(data('stock.reserved'), null, 'the protected method did not run');
    },
    async c12({byId, edit}) {
        await tick(0);
        assert.equal(byId('name').textContent, 'Lamp', 'the fragment requested at start');
        assert.equal(byId('stock').textContent, '3 in stock');
        edit('record', 'chair');
        await tick(0);
        assert.equal(byId('name').textContent, 'Chair', 'a ^ parameter change requests again');
        assert.equal(byId('stock').textContent, '12 in stock');
    },
    async c13({byId, edit, calls}) {
        const requests = () => calls.filter(({contentType, name}) => contentType === 'source' && name === 'rules').length;
        await tick(0);
        assert.equal(byId('rule').textContent, 'Ships in two days, bulbs not included.');
        assert.equal(byId('mounts').textContent, '1');
        assert.equal(byId('status').textContent, 'Mounted the lighting rules');
        assert.equal(requests(), 1);
        edit('product', 'products.spot');
        await tick(0);
        assert.equal(byId('name').textContent, 'Spotlight');
        assert.equal(byId('mounts').textContent, '1', 'the existing fragment stays mounted');
        assert.equal(requests(), 1, 'observe the transport independently: same category skips a call');
        edit('product', 'products.chair');
        await tick(0);
        assert.equal(byId('rule').textContent, 'Ships in a week, assembly required.');
        assert.equal(byId('mounts').textContent, '2');
        assert.equal(requests(), 2);
        assert.equal(byId('status').textContent, 'Mounted the seating rules');
        edit('product', 'products.lamp');
        await tick(0);
        assert.equal(requests(), 3, 'only the last mounted result is cached');
        assert.equal(byId('mounts').textContent, '3');
    },
    async c14({byId, edit, click, calls, app}) {
        const requests = () => calls.filter(({contentType, name}) => contentType === 'data' && name === 'load_menu').length;
        await tick(0);
        assert.equal(byId('menu').textContent, 'Soup, Risotto, Fish', 'the first bound read starts loading');
        assert.equal(app.data.getResolver('kitchen.menu').cacheTime, 5);
        assert.equal(byId('read-value').textContent, '', 'a snapshot needs an explicit read');
        click('read-menu');
        assert.equal(byId('read-value').textContent, 'Soup, Risotto, Fish');
        assert.equal(requests(), 1, 'reading a fresh cache sends nothing');
        edit('table', 'drinks');
        await tick(0);
        assert.equal(byId('menu').textContent, 'Water, Lemonade, Coffee');
        assert.equal(byId('read-value').textContent, 'Soup, Risotto, Fish', 'the copied snapshot does not subscribe to menu');
        assert.equal(requests(), 2);
        await tick(5100);
        assert.equal(requests(), 2, 'expiry alone is not a refresh timer');
        click('read-menu');
        click('read-menu');
        assert.equal(requests(), 3, 'explicit expired read starts one call; concurrent read coalesces');
        assert.equal(byId('read-value').textContent, 'Water, Lemonade, Coffee');
        await tick(0);
        click('read-menu');
        assert.equal(requests(), 3, 'response renews the cache window');
    },
};

const b01Basic = CHECKS.b01;
CHECKS.b01 = async ctx => {
    await b01Basic(ctx);
    assert.equal(ctx.byId('local-name').textContent, 'Inner');
    assert.equal(ctx.byId('anchor-name').textContent, 'Outer');
    assert.equal(ctx.byId('parent-name').textContent, 'Outer');
    ctx.app.data.setItem('contexts.name', 'Outside');
    assert.equal(ctx.byId('anchor-name').textContent, 'Outside');
    assert.equal(ctx.byId('local-name').textContent, 'Inner');
};
const c02Basic = CHECKS.c02;
CHECKS.c02 = async ctx => {
    await c02Basic(ctx);
    const count = key => ctx.data(`demo.${key}`);
    ctx.edit('tracked-name', 'Mira');
    assert.equal(count('name_exact'), 1); assert.equal(count('name_all'), 1);
    ctx.click('setName');
    assert.equal(count('name_exact'), 2); assert.equal(count('name_all'), 2);
    ctx.click('replaceFilter');
    assert.equal(count('name_exact'), 2); assert.equal(count('name_all'), 3);
    assert.equal(count('address_exact'), 0); assert.equal(count('address_all'), 1);
    ctx.click('changeCity');
    assert.equal(count('address_exact'), 0); assert.equal(count('address_all'), 2);
};
const c11Basic = CHECKS.c11;
CHECKS.c11 = async ctx => {
    await c11Basic(ctx);
    assert.equal(ctx.byId('protected-source'), null);
    assert.equal(ctx.app.src.source.getNodeByAttr('id', 'protected-source'), null);
    assert.equal(ctx.byId('hidden-source').hidden, true);
    assert.ok(ctx.app.src.source.getNodeByAttr('id', 'hidden-source'));
};
CHECKS.c15 = async ({byId, click, data}) => {
    assert.equal(byId('trace').textContent, 'init → built → start');
    assert.equal(data('lifecycle.ticks'), 1);
    click('inspect'); assert.equal(byId('lookup').textContent, 'Source → DOM → same Source');
    click('freeze'); const visible = byId('branch-ticks').textContent;
    await tick(1100); assert.ok(data('lifecycle.ticks') > Number(visible));
    assert.equal(byId('branch-ticks').textContent, String(data('lifecycle.ticks')));
    click('thaw'); assert.equal(byId('branch-ticks').textContent, String(data('lifecycle.ticks')));
    assert.equal(byId('trace').textContent, 'init → built → start');
    click('remove'); const stopped = data('lifecycle.ticks');
    await tick(1100); assert.equal(data('lifecycle.ticks'), stopped);
    assert.equal(byId('observed'), null);
    assert.equal(byId('trace').textContent, 'init → built → start');
    click('inspect'); assert.equal(byId('lookup').textContent, 'Source branch absent');
};
CHECKS.c16 = async ({byId, edit}) => {
    assert.equal(byId('greeting').textContent, 'Hello, Ada');
    assert.equal(byId('card').title, 'Customer: Ada');
    assert.equal(byId('card').getAttribute('customer'), 'Ada');
    edit('name', 'Grace', 'input');
    assert.equal(byId('greeting').textContent, 'Hello, Grace');
    assert.equal(byId('card').title, 'Customer: Grace');
    assert.equal(byId('card').getAttribute('customer'), 'Grace');
    edit('name', '', 'input'); assert.equal(byId('greeting').textContent, '');
    assert.equal(byId('preview').getAttribute('sandbox'), '');
    edit('html', '<h2>Preview two</h2>', 'input');
    assert.equal(byId('preview').srcdoc, '<h2>Preview two</h2>');
};
CHECKS.c17 = async ({window, app, byId, edit, click, data}) => {
    const blobs = new Map(), links = [];
    window.URL.createObjectURL = blob => { const url = `blob:${blobs.size}`; blobs.set(url, blob); return url; };
    window.URL.revokeObjectURL = () => {};
    window.HTMLAnchorElement.prototype.click = function () { links.push({href: this.href, name: this.download}); };
    const read = index => new Promise(resolve => { const reader = new window.FileReader();
        reader.onload = () => resolve(reader.result); reader.readAsText(blobs.get(links[index].href)); });
    click('inspect'); assert.match(byId('types').textContent, /note: null/);
    edit('name', 'Grace'); edit('seats', '3'); click('save');
    assert.equal(links[0].name, 'registration.tytx.json');
    const saved = await read(0); edit('name', 'Changed');
    let chosen = saved;
    window.HTMLInputElement.prototype.click = function () {
        Object.defineProperty(this, 'files', {value: [new File([chosen], 'chosen.json')]});
        this.dispatchEvent(new window.Event('change'));
    };
    click('restore'); await tick(20);
    assert.equal(data('exchange.record.name'), 'Grace');
    assert.equal(data('exchange.record.seats'), 3);
    assert.equal(data('exchange.record.confirmed'), true);
    assert.equal(data('exchange.record.note'), null);
    assert.equal(data('exchange.record.address.city'), 'Rome');
    click('exportJson'); const exported = await read(1);
    assert.equal(JSON.parse(exported).find(item => item.label === 'name').value, 'Grace');
    click('exportXml'); assert.match(await read(2), /<record>/);
    chosen = exported; click('restore'); await tick(20);
    assert.match(byId('status').textContent, /not a saved Gramlot branch/);
    assert.equal(data('exchange.record.name'), 'Grace');
    click('previewMail'); assert.match(byId('mail').textContent, /address.city: Rome/);
    assert.equal(links.length, 3, 'preview sends no mail');
};

test('c13: a request in flight is never cancelled, and the change made during the flight waits and is sent at the answer', async () => {
    const family = families.find(({key}) => key === 'rpc');
    const example = family.examples.find(({key}) => key === 'c13');
    const page = await mount(family, example, {hold: ({contentType, name, params}) => contentType === 'source' && name === 'rules' && params.category === 'seating'});
    try {
        const {byId, edit, release, calls} = page;
        const rules = () => calls.filter(({contentType, name}) => contentType === 'source' && name === 'rules').map(({params}) => params.category);
        await tick(0);
        assert.deepEqual(rules(), ['lighting']);
        assert.equal(byId('mounts').textContent, '1');
        edit('product', 'products.chair');                    // B: sent, answer held
        await tick(0);
        assert.deepEqual(rules(), ['lighting', 'seating']);
        edit('product', 'products.lamp');                     // back to A during the flight: waits, sends nothing
        await tick(0);
        assert.deepEqual(rules(), ['lighting', 'seating']);
        assert.equal(byId('mounts').textContent, '1');
        release();                                            // B answers: its fragment is mounted, then A is sent
        await tick(0);
        assert.deepEqual(rules(), ['lighting', 'seating', 'lighting']);
        assert.equal(byId('mounts').textContent, '3');
        assert.equal(byId('rule').textContent, 'Ships in two days, bulbs not included.');
        assert.equal(byId('status').textContent, 'Mounted the lighting rules');
        assert.deepEqual(page.errors, []);
    } finally {
        page.app.dispose();
    }
});

test('every family folder has a README and every example its Python, JavaScript and README files', () => {
    assert.deepEqual(families.map(({key}) => key), ['components', 'binding', 'controllers', 'rpc', 'layout', 'editors', 'html_svg']);
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

test('every page module exports Page, and Logic only with methods; no page has a logic companion', async () => {
    for (const family of families) {
        assert.deepEqual(readdirSync(folder(family.key)).filter(name => name.endsWith('_aux.js')), [], family.key);
        for (const example of family.examples) {
            const module = await import(new URL(`${example.folder}.js`, folder(family.key)));
            assert.equal(typeof module.Page, 'function', `${example.key} Page`);
            if ('Logic' in module) {
                assert.equal(typeof module.Logic, 'function', `${example.key} Logic`);
                assert.ok(Reflect.ownKeys(module.Logic.prototype).some(name => name !== 'constructor'), `${example.key} exports an empty Logic`);
            }
        }
    }
});

test('the pages follow the naming and theme conventions (GC-225)', () => {
    for (const family of families) for (const example of family.examples) for (const suffix of ['.py', '.js']) {
        const text = readFileSync(new URL(`${example.folder}${suffix}`, folder(family.key)), 'utf8');
        const name = `${family.key}/${example.folder}${suffix}`;
        assert.doesNotMatch(text, /\bpage\s*=/, `${name}: never page for an element`);
        assert.doesNotMatch(text, /\bpane\s*=\s*root\.main\(/, `${name}: html_main is held in main_content`);
        assert.doesNotMatch(text, /themes\/gramlot-base/, `${name}: the server links the base theme`);
    }
});

for (const family of families.filter(({key}) => key !== 'html_svg')) {
    for (const example of family.examples) {
        // c14 observes expiry of a five-second cache; Bun defaults to five seconds per test.
        test(`${family.key}/${example.folder}: mounts without errors and behaves as its README says`, {timeout: 10000, skip: example.folder.startsWith('10-code_editors/') ? 'Qualified by the every-page Chromium suite: editor CSS and WASM require a browser' : false}, async () => {
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
