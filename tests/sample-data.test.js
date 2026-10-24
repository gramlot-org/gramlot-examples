import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Bag} from '@genrojs/bag';
import {fromTytx} from '@genrojs/tytx';
import {buildGallery} from '../src/gramlot_examples/index.js';

const gallery = buildGallery();
const read = key => fromTytx(readFileSync(gallery.routes[key].data, 'utf8'));

test('every advertised sample companion decodes as a Data Bag in JavaScript', () => {
    const companions = Object.values(gallery.routes).filter(route => route.data);
    assert.ok(companions.length > 50, 'the convention covers the gallery, not just the pilot');
    for (const {data} of companions) {
        assert.ok(fromTytx(readFileSync(data, 'utf8')) instanceof Bag, data);
    }
});

test('sample records retain nested paths, types and attributes; UI preferences stay with controls', () => {
    const customer = read('b12');
    assert.equal(customer.getItem('customer.credit').toString(), '1250.5');
    assert.equal(customer.getItem('customer.active'), true);
    assert.equal(customer.getNode('customer.name').getAttr('caption'), 'Customer name');
    assert.equal(customer.getNode('ui.accent'), null);
    const pointers = read('b01');
    assert.equal(pointers.getItem('contexts.child.name'), 'Inner');
    assert.equal(pointers.getNode('person.name').getAttr('role'), 'Mathematician');
    const textbox = read('w01');
    assert.equal(textbox.getItem('customer'), 'Ada');
    for (const path of ['position', 'live', 'readonly']) assert.equal(textbox.getNode(path), null);
});

test('explicit setters in lessons are confined to setter teaching and host-generated carousel metadata', () => {
    for (const [key, route] of Object.entries(gallery.routes)) {
        if (!route.page.includes('/pages/') || ['b03', 'l08'].includes(key)) continue;
        const text = readFileSync(route.page, 'utf8');
        assert.doesNotMatch(text, /\.dataSetter\s*\(/, key);
    }
});
