/**
 * The Python and JavaScript twins of a page answer the same request envelope with the same result: the same
 * value or the same error (code, class name, message) from an endpoint, the same Source from a fragment.
 * The Python side runs in one subprocess; the JavaScript side answers through the core GramlotFileServer.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
const {fromTytx, toTytx} = await import(createRequire(import.meta.resolve('@gramlot/gramlot')).resolve('@genrojs/tytx'));
import {buildGallery} from '../src/gramlot_examples/index.js';

const fromExamples = createRequire(new URL('../package.json', import.meta.url));
const {GramlotFileServer} = await import(pathToFileURL(fromExamples.resolve('@gramlot/gramlot/server')).href);
const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const root = fileURLToPath(new URL('../', import.meta.url));
const {families} = JSON.parse(readFileSync(new URL('../src/gramlot_examples/catalog.json', import.meta.url), 'utf8'));

// The parameters are the ones the dataRpc or remote of each page sends; edge values come first-hand from the lessons.
const CASES = [
    ['g06', 'source', 'guided_cards', {revision:1}],
    ['g06', 'source', 'guided_cards', {revision:2}],
    ['g06', 'source', 'guided_delivery', {}],
    ['g06', 'source', 'guided_address', {}],
    ['g05', 'source', 'shipping_card', {revision: 1}],
    ['g05', 'source', 'shipping_card', {revision: 2}],
    ['g05', 'source', 'shipping_address', {}],
    ['g01', 'source', 'customer_fields', {kind: 'person'}],
    ['g01', 'source', 'customer_fields', {kind: 'company'}],
    ['g02', 'source', 'address_fields', {slot: 'billing', title: 'Billing address'}],
    ['g02', 'source', 'address_fields', {slot: 'shipping', title: 'Delivery address'}],
    ['g03', 'source', 'site_profile', {revision: 1}],
    ['g03', 'source', 'site_profile', {revision: 2}],
    ['g03', 'source', 'contact_fields', {}],
    ['g03', 'source', 'address_fields', {}],
    ['g04', 'source', 'order_cards', {revision: 1}],
    ['g04', 'source', 'order_cards', {revision: 2}],
    ['g04', 'source', 'order_address_fields', {slot: 'billing'}],
    ['g04', 'source', 'order_address_fields', {slot: 'shipping'}],
    ['g04', 'source', 'order_delivery_fields', {}],
    ['c08', 'data', 'quote', {quantity: 2, large: false, gift: false}],
    ['c08', 'data', 'quote', {quantity: 2, large: true, gift: true}],
    ['c08', 'data', 'quote', {quantity: 0, large: true, gift: true}],
    ['c08', 'data', 'quote', {quantity: null, large: false, gift: false}],
    ['c09', 'data', 'with_vat', {price: 12.5, rate: 22}],
    ['c09', 'data', 'with_vat', {price: 20, rate: 22}],
    ['c09', 'data', 'with_vat', {price: 0.5, rate: 1}],
    ['c09', 'data', 'with_vat', {price: 0.01, rate: 50}],
    ['c09', 'data', 'with_vat', {price: 1.005, rate: 0}],
    ['c10', 'data', 'quote', {quantity: 1}],
    ['c10', 'data', 'quote', {quantity: 9}],
    ['c10', 'data', 'quote', {quantity: 10}],
    ['c10', 'data', 'quote', {quantity: 12}],
    ['c10', 'data', 'quote', {quantity: null}],
    ['c11', 'data', 'reserve', {item: 'Lamp'}],
    ['c11', 'data', 'cancel', {item: 'Lamp'}],
    ['c12', 'source', 'details', {record_id: 'lamp'}],
    ['c12', 'source', 'details', {record_id: 'desk'}],
    ['c12', 'source', 'details', {record_id: 'chair'}],
    ['c13', 'source', 'rules', {category: 'lighting'}],
    ['c13', 'source', 'rules', {category: 'seating'}],
    ['c14', 'data', 'load_menu', {table: 'dishes'}],
    ['c14', 'data', 'load_menu', {table: 'drinks'}],
    ['w25', 'data', 'check_name', {value: 'newname'}],
    ['w25', 'data', 'check_name', {value: 'taken'}],
];

function normalize(value) {
    if (value == null) return null;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (Array.isArray(value)) return value.map(normalize);
    if (typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => key !== '_meta')
        .map(([key, item]) => [key, normalize(item)]));
    return value;
}

function source(bag) {
    return bag.getNodes().map(node => ({tag: node.nodeTag.toLowerCase(), attrs: normalize(node.getAttr()),
        value: node.getValue() instanceof bag.constructor ? source(node.getValue()) : normalize(node.getValue())}));
}

function located(key) {
    for (const family of families) {
        const example = family.examples.find(item => item.key === key);
        if (example) return {family, example};
    }
    throw new Error(`no example ${key}`);
}

async function answerInJavaScript() {
    const answers = [];
    for (const [key, contentType, name, params] of CASES) {
        const {family, example} = located(key);
        const server = new GramlotFileServer(fileURLToPath(new URL(`../src/gramlot_examples/pages/${family.folder}/`, import.meta.url)),
            {collections: buildGallery().collections});
        const {pageId} = await server.registerPage(`/${example.folder}`);
        const text = toTytx({id: '1', pageId, contentType, name, params});
        const response = fromTytx(await server.call(text));
        server.closePage(pageId);
        answers.push(response.error
            ? {error: {code: response.error.code, name: response.error.name, message: response.error.message}}
            : {value: contentType === 'source' ? source(response.value) : normalize(response.value)});
    }
    return answers;
}

const script = `
import asyncio, json, sys
from datetime import date
from genro_tytx import from_tytx, to_tytx
from gramlot.server import GramlotFileServer
from gramlot_examples import build_gallery

class CollectionServer(GramlotFileServer):
    def collection_url(self, collection, path):
        return f"/gramlot/collections/{collection.name}/{collection.build_id[7:]}/{path}"

def normalize(v):
    if isinstance(v, date): return v.isoformat()
    if isinstance(v, (tuple, list)): return [normalize(x) for x in v]
    if isinstance(v, dict): return {(k[:-1] if k.endswith('_') else k): normalize(x) for k, x in v.items() if k != '_meta'}
    return v

def source(bag):
    return [dict(tag=n.node_tag.lower(), attrs=normalize(n.attr),
                 value=source(n.value) if hasattr(n.value, 'nodes') else normalize(n.value)) for n in bag.nodes]

async def main(cases):
    gallery = build_gallery()
    answers = []
    for key, content_type, name, params in cases:
        page = gallery['routes'][key]['page']
        server = CollectionServer(str(page.parent), collections=gallery['collections'])
        opened = await server.open_page(f'/{page.stem}')
        text = to_tytx({'id': '1', 'pageId': opened.page_id, 'contentType': content_type, 'name': name, 'params': params})
        response = from_tytx(await server.call(text))
        server.close_page(opened.page_id)
        if 'error' in response:
            answers.append({'error': {k: response['error'][k] for k in ('code', 'name', 'message')}})
        else:
            answers.append({'value': source(response['value']) if content_type == 'source' else normalize(response['value'])})
    return answers

print(json.dumps(asyncio.run(main(json.loads(sys.stdin.read())))))
`;

// This full-catalogue test starts Python and verifies all prepared collections.
// Include the remote Grouplet cases in its bounded integration-test budget.
test('every endpoint and fragment answers the same in Python and JavaScript', {timeout:120000}, async () => {
    const expected = JSON.parse(execFileSync(python, ['-c', script], {cwd: root, encoding: 'utf8', input: JSON.stringify(CASES)}));
    const actual = await answerInJavaScript();
    assert.equal(actual.length, CASES.length);
    CASES.forEach(([key, , name, params], index) => {
        assert.deepEqual(actual[index], expected[index], `${key} ${name} ${JSON.stringify(params)}`);
    });
});
