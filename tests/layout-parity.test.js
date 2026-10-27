/** Compare the actual Source authored in Python and JavaScript, including bindings and controllers. */
import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {GramlotBuilder} from '@gramlot/gramlot';
import {Bag} from '@genrojs/bag';
import editors from '@gramlot/gramlot/components/editors';
import typst from '@gramlot/gramlot/components/typst';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import tree from '@gramlot/gramlot/components/tree';
import catalog from '../src/gramlot_examples/catalog.json' with {type: 'json'};
import {guidedDemo} from '../src/gramlot_examples/gallery/guided-demo.js';
const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const root = fileURLToPath(new URL('../', import.meta.url));
function normalize(value) {
    if (value == null) return null;
    if (value instanceof Bag) return source(value);
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (Array.isArray(value)) return value.map(normalize);
    if (typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k, v]) => k !== '_meta' && v !== undefined).map(([k,v]) => [k, normalize(v)]));
    return value;
}
// Object-reference IDs are generated independently in each language. Preserve
// their connectivity while comparing the same structural references by order.
function references(value, ids = new Map()) {
    if (Array.isArray(value)) return value.map(item => references(item, ids));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => {
        if (key === '__ref' || key === '$gramlotRef') {
            if (!ids.has(item)) ids.set(item, ids.size);
            return [key, ids.get(item)];
        }
        return [key, references(item, ids)];
    }));
    return value;
}
function source(bag) {
    return bag.getNodes().map(node => ({tag: node.nodeTag ? node.nodeTag.toLowerCase() : node.label, attrs: normalize(node.getAttr()),
        value: node.getValue() instanceof bag.constructor ? source(node.getValue()) : normalize(node.getValue())}));
}
const script = `
import importlib.util, json, sys
from datetime import date
from gramlot import GramlotBuilder
from genro_bag import Bag
from gramlot_examples.gallery.collections import collections
from gramlot_examples.gallery.guided_demo import guided_demo

def normalize(v):
    if isinstance(v, Bag): return source(v)
    if isinstance(v, date): return v.isoformat()
    if isinstance(v, (tuple, list)): return [normalize(x) for x in v]
    if isinstance(v, dict): return {({'class_': 'class', 'for_': 'for', 'default_class_': 'default_class'}.get(k, k)):normalize(x) for k,x in v.items() if k != '_meta'}
    return v

def source(bag):
    return [dict(tag=n.node_tag.lower() if n.node_tag else n.label, attrs=normalize(n.attr), value=source(n.value) if hasattr(n.value, 'nodes') else normalize(n.value)) for n in bag.nodes]

b=GramlotBuilder(collections=[json.loads(c.verify()[c.grammar]) for c in collections()])
if sys.argv[1] == 'guide': guided_demo(b.root)
else:
    spec=importlib.util.spec_from_file_location('example', sys.argv[1]); mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    mod.Page().main(b.root)
print(json.dumps(source(b.source)))
`;
const overviews = catalog.families.flatMap(family => [...new Set(family.examples.filter(e => e.folder.includes('/')).map(e => e.folder.slice(0, e.folder.lastIndexOf('/'))))].map(folder => ({key: `${family.key}/${folder} overview`, family: family.folder, folder: `${folder}/00-index`})));
for (const example of overviews) {
    test(`${example.key}: Python and JavaScript author equivalent Source`, async () => {
        const b = new GramlotBuilder(null, {collections: [inputs.toDocument(), layout.toDocument(), tree.toDocument(), editors.toDocument(), typst.toDocument()]});
        const path = example.key === 'guide' ? 'guide' : `src/gramlot_examples/pages/${example.family}/${example.folder}.py`;
        if (path === 'guide') guidedDemo(b.root);
        else {
            const {Page} = await import(new URL(`../src/gramlot_examples/pages/${example.family}/${example.folder}.js`, import.meta.url));
            new Page().main(b.root);
        }
        const expected = JSON.parse(execFileSync(python, ['-c', script, path], {cwd: root, encoding: 'utf8'}));
        assert.deepEqual(references(source(b.source)), references(expected));
    });
}
