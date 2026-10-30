import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {Bag, NavigationResolver} from '@gramlot/gramlot';
import features from '../src/gramlot_examples/gallery/features.json' with {type:'json'};
import catalog from '../src/gramlot_examples/catalog.json' with {type:'json'};
import {mountFeatureProgress, markFeatureExampleSeen, openFeatureExample} from '../src/gramlot_examples/gallery/browser/gallery-features.js';

const optionalCatalogs = ['asqueel', 'selection-trial', 'cached-trial'].map(name =>
    JSON.parse(readFileSync(new URL(`../src/gramlot_examples/base/${name}-catalog.json`, import.meta.url))));
const entries = features.flatMap(group => group.features);
function fixture(window = new JSDOM('', {url:'https://gallery.test/'}).window, catalogs = [catalog]) {
    const state = new Bag();
    const links = new Bag();
    for (const source of catalogs) for (const family of source.families) for (const item of family.examples) {
        links.setItem(item.key, null, {family:family.key, url:`pages/${family.folder}/${item.folder}`});
    }
    state.setItem('featureExamples', links);
    const progress = new Bag();
    for (const feature of entries) if (feature.examples.some(key => links.getNode(key) !== null)) progress.setItem(feature.id, 'new');
    state.setItem('featureProgress', progress);
    const data = new Bag(); data.setItem('galleryIndex', state);
    const root = {builder:{data}, indexContext:{disposed:false}};
    const renderer = {destination:window.document.body, onDispose(){}};
    const mounted = mountFeatureProgress(renderer, root, state);
    return {window, state, progress, root, mounted};
}

test('feature inventory references catalogue keys and keeps quarantined selectors out of the lesson path', () => {
    const keys = new Set([catalog, ...optionalCatalogs].flatMap(source => source.families.flatMap(group => group.examples.map(item => item.key))));
    assert.equal(new Set(entries.map(item => item.id)).size, entries.length);
    for (const feature of entries) for (const key of feature.examples) assert.ok(keys.has(key), key);
    for (const name of ['dbSelect', 'dbComboBox']) {
        const feature = entries.find(item => item.title === name);
        assert.equal(feature.status, 'Quarantine');
        assert.deepEqual(feature.examples, []);
    }
});

test('one lesson marks all linked features seen, preserves tried, and restores the session on reload', () => {
    const {window, state, progress, mounted} = fixture();
    const linked = entries.filter(item => item.examples.includes('menu-03'));
    assert.ok(linked.length > 1);
    progress.setItem(linked[0].id, 'tried');
    markFeatureExampleSeen(state, 'menu-03');
    assert.equal(progress.getItem(linked[0].id), 'tried');
    for (const feature of linked.slice(1)) assert.equal(progress.getItem(feature.id), 'seen');
    const untouched = entries.find(item => item.examples.includes('e01'));
    assert.equal(progress.getItem(untouched.id), 'new');
    mounted.dispose();
    const reloaded = fixture(window);
    assert.equal(reloaded.progress.getItem(linked[0].id), 'tried');
    assert.equal(reloaded.progress.getItem(linked[1].id), 'seen');
    const separateSession = fixture();
    assert.equal(separateSession.progress.getItem(linked[0].id), 'new');
    const saved = window.sessionStorage.getItem('gramlot.gallery.features:/');
    progress.setItem(linked[0].id, 'new');
    assert.equal(window.sessionStorage.getItem('gramlot.gallery.features:/'), saved, 'disposed owner no longer persists');
    reloaded.mounted.dispose(); separateSession.mounted.dispose();
});

test('malformed progress or blocked storage stays explicit and does not claim restored progress', () => {
    const window = new JSDOM('', {url:'https://gallery.test/'}).window;
    window.sessionStorage.setItem('gramlot.gallery.features:/', '{broken');
    let result = fixture(window);
    assert.match(result.state.getItem('featureStorageNotice'), /could not be restored/);
    result.mounted.dispose();
    Object.defineProperty(window, 'sessionStorage', {get(){throw new window.DOMException('blocked', 'SecurityError');}});
    result = fixture(window);
    markFeatureExampleSeen(result.state, 'menu-03');
    assert.match(result.state.getItem('featureStorageNotice'), /cannot save/);
    result.mounted.dispose();
});

test('feature links resolve the existing navigation Bag and select through IndexPage Data', async () => {
    const {root, state, mounted} = fixture();
    const navigation = new Bag();
    const family = catalog.families.find(group => group.examples.some(item => item.key === 'menu-03'));
    const lessons = new Bag(); lessons.setItem('menu-03', null, {key:'menu-03', category:false, url:'pages/05-menus/02_toolbar'});
    navigation.setItem(family.key, lessons, {category:true});
    state.setItem('navigation', navigation);
    state.setItem('featuresOpen', true);
    await openFeatureExample(root, 'menu-03');
    assert.equal(state.getItem('navigationSelection'), `${family.key}.menu-03`);
    assert.equal(state.getItem('featuresOpen'), false);
    mounted.dispose();
});


test('feature links wait for lazy NavigationResolvers before selecting nested lessons', async () => {
    const {root, state, mounted} = fixture();
    const navigation = new Bag();
    const calls = [];
    const gramlot = {rpc:{async call(kind, method, params) {
        calls.push(params.directory);
        const bag = new Bag();
        if (params.directory === '00-html_svg') {
            bag.setItem('unrelated', null, {category:true, directory:'00-html_svg/unrelated'});
            bag.setItem('01-html_basics', null, {category:true, directory:'00-html_svg/01-html_basics'});
        } else bag.setItem('e01', null, {category:false, key:'e01', url:'pages/hello'});
        return bag;
    }}};
    navigation.setItem('html_svg', null, {category:true, directory:'00-html_svg'});
    navigation.setResolver('html_svg', new NavigationResolver({gramlot, method:'navigation_section',
        directory:'00-html_svg', onError:error=>{throw error;}}));
    state.setItem('navigation', navigation);
    await openFeatureExample(root, 'e01');
    assert.equal(state.getItem('navigationSelection'), 'html_svg.01-html_basics.e01');
    assert.deepEqual(calls, ['00-html_svg', '00-html_svg/01-html_basics']);
    await openFeatureExample(root, 'e01');
    assert.equal(calls.length, 2, 'cached branches do not request again');
    navigation.getNode('html_svg').resolver.abort();
    mounted.dispose();
});

test('leaving the index while a branch loads cancels its pending navigation intent', async () => {
    const {root, state, mounted} = fixture();
    const navigation = new Bag();
    let complete;
    const gramlot = {rpc:{call:() => new Promise(resolve => {complete = resolve;})}};
    navigation.setItem('html_svg', null, {category:true});
    navigation.setResolver('html_svg', new NavigationResolver({gramlot, method:'navigation_section',
        directory:'00-html_svg', onError:error=>{throw error;}}));
    state.setItem('navigation', navigation);
    const pending = openFeatureExample(root, 'e01');
    state.setItem('featureRequest', null);
    const children = new Bag(); children.setItem('e01', null, {key:'e01', category:false});
    complete(children);
    await pending;
    assert.equal(state.getItem('navigationSelection'), null);
    mounted.dispose();
});

test('public coverage checklist and feature navigation agree on titles, lesson links and quarantine', async () => {
    const {readFile} = await import('node:fs/promises');
    const markdown = await readFile(new URL('../docs/035-feature-coverage.md', import.meta.url), 'utf8');
    const inventory = markdown.split('## 010 ·')[1].split('## 020 ·')[0];
    const rows = inventory.split('\n').filter(line => line.startsWith('| '));
    for (const feature of entries) {
        const row = rows.find(line => line.split('|')[1].trim().replaceAll('`','') === feature.title);
        assert.ok(row, feature.title);
        const keys = [...row.matchAll(/\[([\w-]+) ·/g)].map(match => match[1]);
        assert.deepEqual(keys, feature.examples, feature.title);
        if (feature.status === 'Quarantine') assert.ok(row.includes('**Quarantine**'));
    }
});

test('feature tree follows capabilities and updates leaf and completed branch colors from Data', () => {
    const {state, progress, mounted} = fixture();
    const group = features.find(group => group.id === 'menus');
    const tree = state.getItem('featureTree');
    assert.equal(tree.getNode('menus').attr.labelClass, 'feature-new');
    const feature = group.features.find(item => item.id === 'component_menu');
    state.setItem('featureSelection', `menus.${feature.id}`);
    assert.equal(state.getItem('featureSelected'), feature.id);
    progress.setItem(feature.id, 'seen');
    assert.equal(tree.getNode(`menus.${feature.id}`).attr.labelClass, 'feature-seen');
    assert.equal(tree.getNode('menus').attr.labelClass, 'feature-new');
    for (const item of group.features) if (item.examples.length) progress.setItem(item.id, 'tried');
    assert.equal(tree.getNode('menus').attr.labelClass, 'feature-seen');
    assert.match(tree.getNode(`menus.${feature.id}`).attr.caption, /✓$/);
    state.setItem('featureSelection', 'menus');
    assert.equal(state.getItem('featureSelected'), 'welcome');
    assert.ok(features.find(group => group.id === 'windows').features.some(item => item.id === 'behavior_window_move_resize_collapse_maximize_and_restore'));
    assert.ok(features.find(group => group.id === 'trees').features.some(item => item.id === 'behavior_tree_searchtext_and_restoration_of_unloaded_branches'));
    for (const item of entries) assert.ok(item.label.length <= 30, item.label);
    mounted.dispose();
});


test('hosted JavaScript navigation ends with Features while keeping directory branches lazy', async () => {
    const {Page} = await import('../src/gramlot_examples/gallery/page.js');
    const nodes = Page.navigation.getNodes();
    assert.equal(nodes.at(-1).label, 'features');
    assert.equal(nodes.at(-1).attr.title, 'Features');
    assert.equal(nodes.at(-1).attr.category, false);
    assert.equal(nodes.at(-1).attr.key, 'features');
    const directory = nodes.find(node => node.attr.category);
    assert.ok(directory.attr.directory);
    const children = new Page().navigation_section({directory: directory.attr.directory});
    assert.ok(children.getNodes().length);
    assert.equal(children.getNode('features'), null, 'Features is only a root entry');
});


test('every common Grid lesson has feature evidence, with explicit optional loading and Asqueel scopes', () => {
    const commonGrid = catalog.families.find(group => group.key === 'grid');
    for (const lesson of commonGrid.examples) {
        assert.ok(entries.some(feature => feature.examples.includes(lesson.key)), lesson.key);
    }
    const generic = features.find(group => group.id === 'grid');
    assert.equal(generic.title, 'Grid · Generic');
    assert.ok(generic.features.every(feature => feature.examples.every(key => key.startsWith('grid-'))));
    const asqueel = features.find(group => group.id === 'grid_asqueel');
    assert.equal(asqueel.title, 'Grid · Asqueel only');
    assert.ok(asqueel.features.every(feature => feature.status === 'Review' && feature.examples.includes('asqueel-only-01')));
    const jsonl = entries.find(feature => feature.id === 'behavior_grid_jsonl');
    assert.equal(jsonl.status, 'Review');
    assert.match(jsonl.description, /not a general dataRpc/);
});

test('optional examples open from the host catalogue and unavailable progress is not restored', async () => {
    const window = new JSDOM('', {url:'https://gallery.test/'}).window;
    const available = fixture(window, [catalog, ...optionalCatalogs]);
    const navigation = new Bag();
    const children = new Bag();
    children.setItem('01-invoice_rows', null, {key:'asqueel-only-01', category:false});
    navigation.setItem('asqueel-cached', children, {category:true});
    available.state.setItem('navigation', navigation);
    await openFeatureExample(available.root, 'asqueel-only-01');
    assert.equal(available.state.getItem('navigationSelection'), 'asqueel-cached.01-invoice_rows');
    markFeatureExampleSeen(available.state, 'asqueel-only-01');
    assert.equal(available.progress.getItem('behavior_grid_cached_fetch'), 'seen');
    available.progress.setItem('behavior_grid_cached_fetch', 'tried');
    available.mounted.dispose();
    const common = fixture(window);
    assert.equal(common.progress.getItem('behavior_grid_cached_fetch'), null);
    assert.equal(common.state.getItem('featureTree').getNode('grid_asqueel').attr.caption, 'Grid · Asqueel only');
    await assert.rejects(openFeatureExample(common.root, 'asqueel-only-01'), /not available in this gallery/);
    assert.equal(common.state.getItem('navigationSelection'), null);
    common.mounted.dispose();
});
