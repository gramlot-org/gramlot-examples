/** Compare the actual Source authored in Python and JavaScript, including bindings and controllers. */
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
function normalize(value) {
    if (value == null) return null;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (Array.isArray(value)) return value.map(normalize);
    if (typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k]) => k !== '_meta').map(([k,v]) => [k, normalize(v)]));
    return value;
}
function source(bag) {
    return bag.getNodes().map(node => ({tag: node.nodeTag.toLowerCase(), attrs: normalize(node.getAttr()),
        value: node.getValue() instanceof bag.constructor ? source(node.getValue()) : normalize(node.getValue())}));
}
const script = `
import importlib.util, json, sys
from datetime import date
from gramlot import GramlotBuilder
from gramlot_examples.gallery.collections import collections
from gramlot_examples.gallery.guided_demo import guided_demo

def normalize(v):
    if isinstance(v, date): return v.isoformat()
    if isinstance(v, (tuple, list)): return [normalize(x) for x in v]
    if isinstance(v, dict): return {('class' if k == 'class_' else k):normalize(x) for k,x in v.items() if k != '_meta'}
    return v

def source(bag):
    return [dict(tag=n.node_tag.lower(), attrs=normalize(n.attr), value=source(n.value) if hasattr(n.value, 'nodes') else normalize(n.value)) for n in bag.nodes]

b=GramlotBuilder(collections=[c['grammar'] for c in collections()])
if sys.argv[1] == 'guide': guided_demo(b.root)
else:
    spec=importlib.util.spec_from_file_location('example', sys.argv[1]); mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    mod.Page().main(b.root)
print(json.dumps(source(b.source)))
`;
for (const example of [...catalog.families.find(f => f.key === 'layout').examples, {key: 'guide'}]) {
    test(`${example.key}: Python and JavaScript author equivalent Source`, async () => {
        const b = new GramlotBuilder(null, {collections: [inputs.toDocument(), layout.toDocument()]});
        const path = example.key === 'guide' ? 'guide' : `src/gramlot_examples/pages/layout/${example.folder}.py`;
        if (path === 'guide') guidedDemo(b.root);
        else {
            const {Page} = await import(new URL(`../src/gramlot_examples/pages/layout/${example.folder}.js`, import.meta.url));
            new Page().main(b.root);
        }
        const expected = JSON.parse(execFileSync(python, ['-c', script, path], {cwd: root, encoding: 'utf8'}));
        assert.deepEqual(source(b.source), expected);
    });
}
