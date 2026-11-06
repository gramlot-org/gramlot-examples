import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationDirectory, buildGallery, pageTitle} from '../src/gramlot_examples/index.js';

test('filesystem navigation is one level per request, with independent directory index URLs', () => {
    const root = navigationDirectory();
    const html = root.getNode('html_svg');
    assert.equal(html.staticValue, null);
    assert.equal(html.attr.directory, '00-html_svg');
    assert.equal(html.attr.url, 'pages/00-html_svg/00-index');
    const children = navigationDirectory('00-html_svg');
    assert.equal(children.getNode('06-nested'), null);
    assert.equal(children.getNode('01-html_basics').attr.directory, '00-html_svg/01-html_basics');
    assert.equal(navigationDirectory('00-html_svg/01-html_basics').getNode('e01').attr.url, 'pages/00-html_svg/01-html_basics/01-hello_world');
    assert.equal(children.getNode('00-index'), null);
    assert.equal(navigationDirectory('00-html_svg/06-nested').getNode('01-child'), null);
    for (const ext of ['.json','.md']) assert.ok(buildGallery().assets[`/pages/00-html_svg/06-nested/01-child${ext}`]);
    const routes = buildGallery().routes;
    for (const url of ['pages/00-index','pages/00-html_svg/00-index','pages/00-html_svg/06-nested/00-index','pages/00-html_svg/06-nested/01-child']) assert.ok(routes[url]);
    for (const path of ['../', '/tmp', 'html_svg/../../', 'html_svg//nested']) assert.throws(()=>navigationDirectory(path), /Invalid navigation directory/);
});


test('border lessons retain their routes and teaching assets inside a lazy directory with its own page', () => {
    const containers = navigationDirectory('05-containers');
    const branch = containers.getNode('01-border');
    assert.equal(branch.staticValue, null);
    assert.equal(branch.attr.directory, '05-containers/01-border');
    assert.equal(branch.attr.url, 'pages/05-containers/01-border/00-index');
    assert.equal(containers.getNode('l01'), null);
    assert.equal(containers.getNode('l07').attr.url, buildGallery().routes.l07.url);
    const lessons = navigationDirectory('05-containers/01-border').getNodes();
    assert.deepEqual(lessons.map(node=>node.label), ['l01','l02','l03','l04','l05','l06']);
    const gallery = buildGallery();
    assert.ok(gallery.routes['pages/05-containers/01-border/00-index']);
    for (const node of lessons) {
        assert.equal(node.attr.url, gallery.routes[node.label].url);
        const route = gallery.routes[node.label];
        assert.match(route.page, /[/]01-border[/]/);
        const stem = route.page.split('/').at(-1).slice(0,-3);
        for (const suffix of ['.py','.js','.md']) assert.ok(gallery.assets[`/pages/05-containers/01-border/${stem}${suffix}`]);
    }
});


test('every catalogue lesson is reachable with its title, route and nested source assets', () => {
    const gallery = buildGallery(), seen = new Set();
    for (const family of gallery.families) for (const example of family.examples) {
        const parts = example.folder.split('/');
        const directory = [family.folder,...parts.slice(0,-1)].join('/');
        const node = navigationDirectory(directory).getNode(example.key);
        assert.equal(node.attr.title,example.title);
        assert.equal(node.attr.url,`pages/${family.folder}/${example.folder}`);
        assert.equal(seen.has(node.label),false); seen.add(node.label);
        if (parts.length > 1) {
            const level = navigationDirectory([family.folder, ...parts.slice(0, -2)].join('/'));
            const parent = level.getNode(parts.at(-2));
            if (parent === null) {  // A folder with one lesson shows the lesson in its place.
                assert.equal(navigationDirectory(directory).length, 1);
                assert.equal(level.getNode(example.key).attr.url, node.attr.url);
            } else { assert.equal(parent.staticValue,null); assert.ok(gallery.routes[parent.attr.url]); }
        }
        for (const suffix of ['.py','.js','.md']) assert.ok(gallery.assets[`/pages/${family.folder}/${example.folder}${suffix}`]);
    }
    assert.equal(seen.size,gallery.families.reduce((n,f)=>n+f.examples.length,0));
});


test('numbered siblings mix directories and pages, hide indexes and use Markdown headings', () => {
    assert.deepEqual(navigationDirectory().getNodes().map(n => n.label), ['html_svg', 'fields-inputs', 'data-logic-rpc', 'layout-menus', 'grid', 'charts', 'editors-tools', 'composition-reuse', 'realtime']);
    assert.deepEqual(navigationDirectory('data-logic-rpc').getNodes().map(n => n.label), ['binding', 'controllers', 'rpc']);
    const branch = navigationDirectory('00-html_svg');
    // 02-native_controls and 03-svg hold one lesson each: the tree shows the lesson, not a folder around it.
    assert.deepEqual(branch.getNodes().map(n => n.label), ['01-html_basics', 'e06', 'e08']);
    assert.equal(branch.getNode('07-markdown_index'), null);
});

test('host tools share one navigation category with the common playground', async t => {
    const {mkdtempSync, mkdirSync, writeFileSync, rmSync} = await import('node:fs');
    const {tmpdir} = await import('node:os');
    const {join} = await import('node:path');
    const root = mkdtempSync(join(tmpdir(), 'gallery-tools-'));
    t.after(() => rmSync(root, {recursive: true, force: true}));
    const folder = join(root, '07-tools');
    mkdirSync(folder);
    writeFileSync(join(folder, '00-index.md'), '# Tools and IDE\n');
    writeFileSync(join(folder, 'index.js'), 'export class Page { static title = "Sample IDE"; }');
    const catalog = join(root, 'catalog.json');
    writeFileSync(catalog, JSON.stringify({environment:'test', families:[{key:'host_tools', title:'Tools and IDE', folder:'07-tools', examples:[]}]}));
    const catalogs = [[catalog, root]];
    assert.equal(navigationDirectory('editors-tools', catalogs).getNodes().filter(n => n.attr.directory === '07-tools').length, 1);
    const tools = navigationDirectory('07-tools', catalogs);
    assert.equal(tools.getNode('e13').attr.url, 'pages/07-tools/01-live_source');
    assert.equal(tools.getNode('index').attr.title, 'Sample IDE');
    assert.equal(navigationDirectory('00-html_svg', catalogs).getNode('e13'), null);
});


test('environment overlay keeps common and host subdirectories inside their own roots', async t => {
    const {mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync} = await import('node:fs');
    const {tmpdir} = await import('node:os');
    const {join} = await import('node:path');
    const root = mkdtempSync(join(tmpdir(), 'gallery-overlay-'));
    t.after(() => rmSync(root, {recursive: true, force: true}));
    const folder = join(root, '01-inputs');
    const host = join(folder, '03-host');
    mkdirSync(host, {recursive: true});
    writeFileSync(join(folder, '00-index.md'), '# Inputs and host\n');
    writeFileSync(join(host, '00-index.md'), '# Host tools\n');
    writeFileSync(join(host, '01-sample.js'), 'export class Page { static title = "Host sample"; }');
    writeFileSync(join(host, '02-other.js'), 'export class Page { static title = "Other host sample"; }');
    const catalog = join(root, 'catalog.json');
    writeFileSync(catalog, JSON.stringify({environment:'test', families:[{key:'host_inputs', title:'Inputs and host', folder:'01-inputs', examples:[]}]}));
    const catalogs = [[catalog, root]];
    const tools = navigationDirectory('01-inputs', catalogs);
    assert.ok(tools.getNode('02-checks_and_switches'));
    assert.ok(tools.getNode('03-host'));
    assert.ok(navigationDirectory('01-inputs/02-checks_and_switches', catalogs).length > 0);
    assert.equal(navigationDirectory('01-inputs/03-host', catalogs).getNode('01-sample').attr.title, 'Host sample');
    const outside = join(root, 'outside');
    mkdirSync(outside);
    symlinkSync(outside, join(folder, 'escape'), 'dir');
    assert.equal(navigationDirectory('01-inputs', catalogs).getNode('escape'), null);
    assert.throws(() => navigationDirectory('01-inputs/escape', catalogs), /outside its pages root/);
    assert.throws(() => navigationDirectory('01-inputs/absent', catalogs), /does not exist/);
});

test('first lesson navigation and asset use its generated metadata', () => {
    const gallery = buildGallery();
    const example = gallery.families[0].examples.find(item => item.key === 'e01');
    assert.equal(navigationDirectory('00-html_svg/01-html_basics').getNode('e01').attr.title, example.title);
    assert.deepEqual(example.tags, ['html', 'heading', 'text', 'source']);
    assert.ok(gallery.assets['/pages/00-html_svg/01-html_basics/01-hello_world.json']);
});

test('lesson search metadata reaches navigation independently of the displayed title', () => {
    const lessons=navigationDirectory('01-inputs/02-checks_and_switches');
    const field=lessons.getNode('w16').attr, hierarchy=lessons.getNode('checkbox-tree').attr;
    assert.equal(field.title,'checkBoxText');assert.equal(field.component,'checkBoxText');
    assert.ok(field.tags.includes('descriptions'));assert.match(field.description,/stored codes/);
    assert.equal(hierarchy.title,'Hierarchical choices');assert.ok(hierarchy.tags.includes('checkbox'));
    assert.equal(hierarchy.component,'checkBoxText');
});

test("chart directory titles come from metadata", () => {
    assert.equal(navigationDirectory().getNode("charts").attr.title, "Charts");
    assert.equal(navigationDirectory("05-charts").getNode("chart-bars").attr.title, "Bars and live data");
});

test('no folder holds a single entry, at every level, after environment and filter', async t => {
    const {mkdtempSync, mkdirSync, writeFileSync, rmSync} = await import('node:fs');
    const {tmpdir} = await import('node:os');
    const {join} = await import('node:path');
    const root = mkdtempSync(join(tmpdir(), 'gallery-single-'));
    t.after(() => rmSync(root, {recursive: true, force: true}));
    const folder = join(root, '95-single');
    mkdirSync(join(folder, '01-topic'), {recursive: true});
    writeFileSync(join(folder, '00-index.md'), '# Single\n');
    writeFileSync(join(folder, '01-topic', '00-index.md'), '# Topic\n');
    writeFileSync(join(folder, '01-topic', '01-only.js'), 'export class Page { static title = "Only lesson"; }');
    const catalog = join(root, 'catalog.json');
    writeFileSync(catalog, JSON.stringify({environment:'single', families:[{key:'single_family', title:'Single', folder:'95-single',
        group:'database-demos', examples:[{key:'single-01', title:'Only lesson', folder:'01-topic/01-only', description:'d', tags:['t']}]}]}));
    const catalogs = [[catalog, root]];
    // Family -> topic folder -> one lesson: the lesson replaces both folders inside its group.
    const group = navigationDirectory('database-demos', catalogs);
    assert.deepEqual(group.getNodes().map(node => node.label), ['single-01']);
    assert.equal(group.getNode('single-01').attr.url, 'pages/95-single/01-topic/01-only');
    // The group itself holds one entry: the root shows the lesson in its place.
    const top = navigationDirectory('', catalogs);
    assert.equal(top.getNode('database-demos'), null);
    assert.equal(top.getNode('single-01').attr.title, 'Only lesson');
    // A filter keeps the rule.
    assert.ok(navigationDirectory('', catalogs, 'Plain').getNodes().some(node => node.label === 'single-01'));
});

