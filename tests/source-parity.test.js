/** Compare the actual Source authored in Python and JavaScript for every example, including bindings and controllers. */
import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {GramlotBuilder} from '@gramlot/gramlot';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import catalog from '../src/gramlot_examples/catalog.json' with {type: 'json'};
import {guidedDemo} from '../src/gramlot_examples/gallery/guided-demo.js';
const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const root = fileURLToPath(new URL('../', import.meta.url));
// Random ids (authored references) differ at every run: only their shape is compared.
const REFERENCE = /^[0-9a-f]{32}$/;
function normalize(value) {
    if (value == null) return null;
    if (typeof value === 'string') return REFERENCE.test(value) ? '<reference>' : value;
    // A civil time is a Date on 1970-01-01 UTC (TYTX H); a civil date is a Date at UTC midnight (TYTX D).
    if (value instanceof Date) return value.toISOString().startsWith('1970-01-01T') ? value.toISOString().slice(11, 19) : value.toISOString().slice(0, 10);
    if (typeof value.getNodes === 'function') return source(value);
    if (Array.isArray(value)) return value.map(normalize);
    if (typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k, v]) => k !== '_meta' && v !== undefined).map(([k,v]) => [k, normalize(v)]));
    return value;
}
// A Source node has a tag; a node of a Data Bag (a dataSetter dictionary) is told by its label.
function source(bag) {
    return bag.getNodes().map(node => ({tag: node.nodeTag ? node.nodeTag.toLowerCase() : node.label, attrs: normalize(node.getAttr()),
        value: node.getValue() instanceof bag.constructor ? source(node.getValue()) : normalize(node.getValue())}));
}
const script = `
import importlib.util, json, re, sys
from datetime import date, time
from gramlot import GramlotBuilder
from gramlot_examples.gallery.collections import collections
from gramlot_examples.gallery.guided_demo import guided_demo

def normalize(v):
    if isinstance(v, str): return '<reference>' if re.fullmatch(r'[0-9a-f]{32}', v) else v
    if isinstance(v, (date, time)): return v.isoformat()
    if hasattr(v, 'nodes'): return source(v)
    if isinstance(v, (tuple, list)): return [normalize(x) for x in v]
    if isinstance(v, dict): return {(k[:-1] if k.endswith('_') else k):normalize(x) for k,x in v.items() if k != '_meta'}
    return v

def source(bag):
    return [dict(tag=n.node_tag.lower() if n.node_tag else n.label, attrs=normalize(n.attr),
                 value=source(n.value) if hasattr(n.value, 'nodes') else normalize(n.value)) for n in bag.nodes]

b=GramlotBuilder(collections=[c['grammar'] for c in collections()])
options = None
if sys.argv[1] == 'guide': guided_demo(b.root)
else:
    spec=importlib.util.spec_from_file_location('example', sys.argv[1]); mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    mod.Page().main(b.root)
    page = mod.Page
    options = dict(title=page.title, devices=list(page.devices), locale=page.locale, timeZone=page.time_zone, css=list(page.css))
print(json.dumps(dict(source=source(b.source), options=options)))
`;
for (const example of [...catalog.families.flatMap(family => family.examples.map(item => ({...item, family: family.key}))), {key: 'guide'}]) {
    test(`${example.key}: Python and JavaScript author equivalent Source and page options`, async () => {
        const b = new GramlotBuilder(null, {collections: [inputs.toDocument(), layout.toDocument()]});
        const path = example.key === 'guide' ? 'guide' : `src/gramlot_examples/pages/${example.family}/${example.folder}.py`;
        let options = null;
        if (path === 'guide') guidedDemo(b.root);
        else {
            const {Page} = await import(new URL(`../src/gramlot_examples/pages/${example.family}/${example.folder}.js`, import.meta.url));
            // The Python main is synchronous; so is the JavaScript main (no dynamic import of a library inside it).
            assert.equal(Page.prototype.main.constructor.name, 'Function', 'main is not async');
            new Page().main(b.root);
            options = {title: Page.title, devices: [...Page.devices], locale: Page.locale, timeZone: Page.timeZone, css: [...Page.css]};
        }
        const expected = JSON.parse(execFileSync(python, ['-c', script, path], {cwd: root, encoding: 'utf8'}));
        assert.deepEqual(source(b.source), expected.source);
        assert.deepEqual(options, expected.options, 'the page options of the two twins');
    });
}
