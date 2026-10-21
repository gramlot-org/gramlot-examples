import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationDirectory, buildGallery, pageTitle} from '../src/gramlot_examples/index.js';

test('filesystem navigation is one level per request, with independent directory index URLs', () => {
    const root = navigationDirectory();
    const html = root.getNode('html_svg');
    assert.equal(html.staticValue, null);
    assert.equal(html.attr.directory, '01-html_elements');
    assert.equal(html.attr.url, 'pages/01-html_elements/00-index');
    const children = navigationDirectory('01-html_elements');
    assert.equal(children.getNode('06-nested').staticValue, null);
    assert.equal(children.getNode('06-nested').attr.url, 'pages/01-html_elements/06-nested/00-index');
    assert.equal(children.getNode('01-html_basics').attr.directory, '01-html_elements/01-html_basics');
    assert.equal(navigationDirectory('01-html_elements/01-html_basics').getNode('e01').attr.url, 'pages/01-html_elements/01-html_basics/01-hello_world');
    assert.equal(children.getNode('00-index'), null);
    const nested = navigationDirectory('01-html_elements/06-nested');
    assert.deepEqual(nested.getNodes().map(node=>node.label), ['01-child']);
    assert.equal(nested.getNode('01-child').attr.url, 'pages/01-html_elements/06-nested/01-child');
    const routes = buildGallery().routes;
    for (const url of ['pages/00-index','pages/01-html_elements/00-index','pages/01-html_elements/06-nested/00-index','pages/01-html_elements/06-nested/01-child']) assert.ok(routes[url]);
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
        assert.equal(node.attr.title,pageTitle(gallery.routes[example.key].page));
        assert.equal(node.attr.url,`pages/${family.folder}/${example.folder}`);
        assert.equal(seen.has(node.label),false); seen.add(node.label);
        if (parts.length > 1) {
            const parent = navigationDirectory(family.folder).getNode(parts[0]);
            assert.equal(parent.staticValue,null); assert.ok(gallery.routes[parent.attr.url]);
        }
        for (const suffix of ['.py','.js','.md']) assert.ok(gallery.assets[`/pages/${family.folder}/${example.folder}${suffix}`]);
    }
    assert.equal(seen.size,gallery.families.reduce((n,f)=>n+f.examples.length,0));
});


test('numbered siblings mix directories and pages, hide indexes and use Markdown headings', () => {
    assert.deepEqual(navigationDirectory().getNodes().map(n => n.label), ['html_svg', 'binding', 'controllers', 'components', 'layout']);
    const branch = navigationDirectory('01-html_elements');
    assert.deepEqual(branch.getNodes().map(n => n.label), ['01-html_basics', '02-native_controls', '03-svg', '04-page_composition', 'e13', '06-nested', '07-markdown_index']);
    const md = branch.getNode('07-markdown_index');
    assert.equal(md.attr.title, 'Descriptive directory index');
    assert.equal(md.attr.url, 'pages/01-html_elements/07-markdown_index/00-index');
    assert.ok(md.attr.markdown.startsWith('# Descriptive directory index'));
    assert.equal(navigationDirectory(md.attr.directory).length, 0);
});
