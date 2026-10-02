import assert from 'node:assert/strict';
import {existsSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {buildGallery} from '../src/gramlot_examples/index.js';

const FIXTURE = fileURLToPath(new URL('./fixtures/environment/', import.meta.url));
const PAGES = join(FIXTURE, 'pages');

/** Write one catalogue in a temporary folder, removed after the test. */
function catalog(t, data) {
    const directory = mkdtempSync(join(tmpdir(), 'gramlot-gallery-'));
    t.after(() => rmSync(directory, {recursive: true, force: true}));
    const path = join(directory, 'catalog.json');
    writeFileSync(path, JSON.stringify(data));
    return path;
}
const environment = families => ({environment: 'test', families});

test('common gallery', () => {
    const gallery = buildGallery();
    assert.deepEqual(gallery.families.map(({key}) => key), ['html_svg', 'binding', 'controllers']);
    assert.equal(Object.keys(gallery.routes).length, 34);
    assert.match(gallery.routes.index.page, /\/page\.js$/);
    for (const [url, asset] of Object.entries(gallery.assets)) assert.ok(existsSync(asset.file), url);
});

test('media types', () => {
    const {assets} = buildGallery();
    assert.equal(assets['/gallery/dist/gallery.js'].type, 'application/javascript');
    assert.equal(assets['/pages/html_svg/01_hello_world.js'].type, 'text/plain');
    assert.equal(assets['/gallery/gallery.css'].type, 'text/css');
    assert.equal(assets['/gallery/dist/LICENSE'].type, 'text/plain');
});

test('environment catalogue', () => {
    const gallery = buildGallery({catalogs: [[join(FIXTURE, 'catalog.json'), PAGES]]});
    assert.equal(gallery.families.at(-1).key, 'test_family');
    assert.equal(gallery.families.at(-1).path, join(PAGES, 'test_family'));
    assert.deepEqual(gallery.routes['test-01'], {
        page: join(PAGES, 'test_family', '01_demo.js'),
        stylesheet: join(PAGES, 'test_family', '01_demo.css'),
        logic: join(PAGES, 'test_family', '01_demo_aux.js'),
    });
    const urls = Object.keys(gallery.assets).filter(url => url.startsWith('/pages/test_family/')).sort();
    assert.deepEqual(urls, ['.css', '.js', '.md', '.py', '_aux.js'].map(suffix => `/pages/test_family/01_demo${suffix}`));
});

test('catalogue without environment', t => {
    assert.throws(() => buildGallery({catalogs: [[catalog(t, {families: []}), PAGES]]}), /has no environment/);
});

test('key outside the environment', t => {
    const family = {key: 'test_family', title: 'X', examples: [{key: 'e99', title: 'X', folder: '01_demo'}]};
    assert.throws(() => buildGallery({catalogs: [[catalog(t, environment([family])), PAGES]]}), /does not match test-NN/);
});

test('duplicate family', t => {
    const family = {key: 'html_svg', title: 'X', examples: []};
    assert.throws(() => buildGallery({catalogs: [[catalog(t, environment([family])), PAGES]]}), /Duplicate gallery keys: html_svg/);
});

test('duplicate example across catalogues', t => {
    const family = {key: 'other_family', title: 'X', examples: [{key: 'test-01', title: 'X', folder: '01_demo'}]};
    assert.throws(() => buildGallery({catalogs: [[join(FIXTURE, 'catalog.json'), PAGES],
        [catalog(t, environment([family])), PAGES]]}), /Duplicate gallery keys: test-01/);
});

test('missing page', t => {
    const family = {key: 'test_family', title: 'X', examples: [{key: 'test-02', title: 'X', folder: '02_missing'}]};
    assert.throws(() => buildGallery({catalogs: [[catalog(t, environment([family])), PAGES]]}), /Missing page/);
});
