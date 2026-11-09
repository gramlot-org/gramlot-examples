import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {availableFilters, buildGallery, filterMatches, mergeFilters, navigationDirectory, readFilters} from '../src/gramlot_examples/index.js';

const root = join(process.cwd(), 'src/gramlot_examples');
const ENDPOINT_USE = /@endpoint|registerEndpoint|@upload|registerUpload|@source|registerSource|dataRpc\(|dataRemote\(|\.remote\(/;
const environments = [
    ...['catalog', 'asqueel-catalog', 'cached-trial-catalog', 'selection-trial-catalog', 'chart-reports-catalog', 'system-monitor-catalog']
        .map(name => [join(root, `base/${name}.json`), join(root, 'base/pages')]),
    ...['page_store', 'chat_base', 'kajenn_db', 'ai', 'terminal'].map(name => [join(root, `trials/${name}/catalog.json`), join(root, `trials/${name}/pages`)]),
];

// The environment catalogues of this package hold Python pages only, so they are read, not built.
const environmentFamilies = () => environments.flatMap(([catalog, pages]) => JSON.parse(readFileSync(catalog, 'utf8')).families
    .map(family => ({...family, path: join(pages, family.folder)})));
const allFamilies = () => [...buildGallery().families, ...environmentFamilies()];

test('a lesson that uses an endpoint, dataRpc, remote or dataRemote requires "endpoint"', () => {
    const families = allFamilies();
    let used = 0;
    for (const family of families) for (const example of family.examples) {
        const sources = ['py', 'js'].map(extension => join(family.path, `${example.folder}.${extension}`)).filter(existsSync);
        if (!sources.some(path => ENDPOINT_USE.test(readFileSync(path, 'utf8')))) continue;
        used++;
        assert.ok((example.requires ?? []).includes('endpoint'), `${example.key} uses an endpoint without requires "endpoint"`);
    }
    assert.ok(used > 0);
});

test('filters.json beside the common catalogue is valid and every filter matches a lesson', () => {
    const {filters} = buildGallery();
    assert.deepEqual(filters.map(rule => rule.label), ['All', 'Plain', 'Server', 'Python server', 'DB', 'Kajenn/Asqueel']);
    assert.deepEqual(availableFilters({families: allFamilies(), filters}).map(rule => rule.label), filters.map(rule => rule.label));
    assert.deepEqual(availableFilters(buildGallery()).map(rule => rule.label), ['All', 'Plain', 'Server']);
});

test('filter semantics: no rule matches all, requires [] matches no requirement, any matches an intersection', () => {
    assert.equal(filterMatches({label: 'All'}, ['db']), true);
    assert.equal(filterMatches({label: 'Plain', requires: []}, undefined), true);
    assert.equal(filterMatches({label: 'Plain', requires: []}, []), true);
    assert.equal(filterMatches({label: 'Plain', requires: []}, ['endpoint']), false);
    assert.equal(filterMatches({label: 'DB', any: ['db']}, ['endpoint', 'db']), true);
    assert.equal(filterMatches({label: 'DB', any: ['db']}, ['endpoint']), false);
    assert.equal(filterMatches({label: 'DB', any: ['db']}, undefined), false);
});

test('filters.json shape errors and environment filters', t => {
    const base = mkdtempSync(join(tmpdir(), 'gallery-filters-'));
    t.after(() => rmSync(base, {recursive: true, force: true}));
    const catalog = join(base, 'catalog.json');
    const declare = value => writeFileSync(join(base, 'filters.json'), JSON.stringify(value));
    assert.deepEqual(readFilters(catalog), []);
    for (const bad of [{}, [{}], [{label: ''}], [{label: 'A', any: []}], [{label: 'A', any: [1]}], [{label: 'A', requires: ['db']}],
        [{label: 'A', requires: [], any: ['db']}], [{label: 'A', extra: true}], [{label: 'A'}, {label: 'A'}]]) {
        declare(bad);
        assert.throws(() => readFilters(catalog), Error, JSON.stringify(bad));
    }
    declare([{label: 'Django', any: ['django']}]);
    assert.deepEqual(mergeFilters([join(root, 'catalog.json'), catalog]).map(rule => rule.label),
        ['All', 'Plain', 'Server', 'Python server', 'DB', 'Kajenn/Asqueel', 'Django']);
    declare([{label: 'Server', any: ['other']}]);
    assert.throws(() => mergeFilters([join(root, 'catalog.json'), catalog]), /Conflicting definitions/);
});

test('a lesson with a malformed requires is rejected', t => {
    const base = mkdtempSync(join(tmpdir(), 'gallery-requires-'));
    t.after(() => rmSync(base, {recursive: true, force: true}));
    const catalog = join(base, 'catalog.json');
    writeFileSync(catalog, JSON.stringify({environment: 'test', families: [{key: 'test_family', folder: 'f', title: 'T', examples: [
        {key: 'test-01', title: 'T', folder: '01_demo', description: 'd', tags: ['t'], requires: 'db'}]}]}));
    assert.throws(() => buildGallery({catalogs: [[catalog, base]]}), /requires must be a list/);
});

test('navigation lists only the lessons of the selected filter and drops empty directories', () => {
    const labels = bag => bag.getNodes().map(node => node.label);
    assert.deepEqual(labels(navigationDirectory('04-rpc/01-server_calls', [], 'Server')), ['c09', 'c10', 'c11']);
    assert.ok(!labels(navigationDirectory('04-rpc/01-server_calls', [], 'Plain')).includes('c09'));
    assert.deepEqual(labels(navigationDirectory('04-rpc/01-server_calls', [], 'DB')), []);
    assert.ok(!labels(navigationDirectory('data-logic-rpc', [], 'Server')).includes('binding'));
    assert.ok(labels(navigationDirectory('data-logic-rpc', [], 'Plain')).includes('binding'));
    assert.deepEqual(labels(navigationDirectory('', [], 'All')), labels(navigationDirectory('')));
    assert.deepEqual(navigationDirectory('04-rpc/01-server_calls').getNode('c09').attr.requires, ['endpoint']);
    assert.throws(() => navigationDirectory('', [], 'Missing'), /Unknown filter/);
    const {families, filters} = buildGallery();
    const keys = rule => families.flatMap(family => family.examples).filter(example => filterMatches(rule, example.requires)).map(example => example.key);
    const listed = label => {
        const found = [];
        const visit = directory => {
            for (const node of navigationDirectory(directory, [], label).getNodes()) {
                if (node.attr.directory !== undefined) visit(node.attr.directory); else found.push(node.label);
            }
        };
        visit('');
        return found.filter(key => key !== 'features');
    };
    for (const rule of filters.slice(1)) {
        const found = listed(rule.label);
        assert.deepEqual(found.filter(key => keys(rule).includes(key)).sort(), keys(rule).sort(), rule.label);
    }
});

test('the ai catalogue declares the AI (LLM) filter and its lessons need Python and an LLM', () => {
    const catalog = join(root, 'trials/ai/catalog.json');
    assert.deepEqual(readFilters(catalog), [{label: 'AI (LLM)', any: ['llm']}]);
    const filters = mergeFilters([join(root, 'catalog.json'), ...environments.map(([path]) => path)]);
    assert.equal(filters.at(-1).label, 'AI (LLM)');
    assert.deepEqual(availableFilters({families: allFamilies(), filters}).map(rule => rule.label), filters.map(rule => rule.label));
    const lessons = JSON.parse(readFileSync(catalog, 'utf8')).families.flatMap(family => family.examples);
    assert.deepEqual(lessons.map(example => example.key), ['ai-01', 'ai-02']);
    for (const example of lessons) assert.deepEqual(example.requires, ['endpoint', 'python', 'llm']);
    const listed = allFamilies().flatMap(family => family.examples).filter(example => filterMatches(filters.at(-1), example.requires));
    assert.deepEqual(listed.map(example => example.key), ['ai-01', 'ai-02']);
    // The JavaScript and serverless galleries read only the common catalogue: no AI lesson, no AI filter.
    const common = buildGallery();
    assert.ok(!common.families.some(family => family.examples.some(example => (example.requires ?? []).includes('llm'))));
    assert.ok(!availableFilters(common).some(rule => rule.label === 'AI (LLM)'));
});
