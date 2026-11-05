import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const root = 'src/gramlot_examples';
const targets = [
    ['catalog.json','pages'],
    ...['catalog.json','asqueel-catalog.json','cached-trial-catalog.json','selection-trial-catalog.json'].map(name=>[`base/${name}`,'base/pages']),
    ...['page_store','chat_base','kajenn_db'].map(name=>[`trials/${name}/catalog.json`,`trials/${name}/pages`]),
];
const read = path => JSON.parse(readFileSync(path,'utf8'));
test('every catalogued lesson has adjacent metadata and a Markdown lesson', () => {
    let count=0;
    for (const [catalog,pages] of targets) for (const family of read(join(root,catalog)).families) {
        const directory=join(root,pages,family.folder), descriptor=read(join(directory,'_family.json'));
        assert.equal(descriptor.key,family.key); assert.equal(descriptor.title,family.title);
        for (const example of family.examples) {
            const stem=join(directory,example.folder), metadata=read(`${stem}.json`);
            assert.equal(metadata.key,example.key); assert.equal(metadata.title,example.title);
            assert.equal(metadata.description,example.description); assert.deepEqual(metadata.tags,example.tags);
            assert.ok(metadata.tags.length>0,stem); assert.ok(existsSync(`${stem}.py`),stem); assert.ok(existsSync(`${stem}.md`),stem);
            assert.equal(Object.hasOwn(metadata,'explanation'),false);
            assert.equal(Object.hasOwn(example,'explanation'),false); count++;
        }
    }
    assert.ok(count > 0);
    assert.deepEqual(read(join(root, "catalog.json")).families[0].examples.map(e=>e.key), ["e01","fundamentals-bindings","e03","e06","e08"]);
});

test('catalogue generation uses lesson files, detects drift and requires a lesson', async t => {
    const {mkdtempSync,mkdirSync,writeFileSync,copyFileSync,rmSync} = await import('node:fs');
    const {tmpdir} = await import('node:os');
    const {spawnSync} = await import('node:child_process');
    const base=mkdtempSync(join(tmpdir(),'gallery-metadata-'));
    t.after(()=>rmSync(base,{recursive:true,force:true}));
    mkdirSync(join(base,'scripts'),{recursive:true});
    copyFileSync('scripts/generate-catalog.mjs',join(base,'scripts/generate-catalog.mjs'));
    const families=[['pages','catalog.json'],['base/pages','catalog.json'],['base/pages','asqueel-catalog.json'],['base/pages','cached-trial-catalog.json'],['base/pages','selection-trial-catalog.json'],['base/pages','chart-reports-catalog.json'],...['page_store','chat_base','kajenn_db'].map(n=>[`trials/${n}/pages`,'catalog.json'])];
    for(const [i,[pages,catalog]] of families.entries()) {
        const dir=join(base,'src/gramlot_examples',pages,`family-${i}`);mkdirSync(dir,{recursive:true});
        writeFileSync(join(dir,'_family.json'),JSON.stringify({key:`family-${i}`,title:'Family',order:i,catalog}));
        writeFileSync(join(dir,'01-example.json'),JSON.stringify({key:`example-${i}`,title:'Original',description:'Short description',tags:['example'],order:0}));
        writeFileSync(join(dir,'01-example.py'),'');writeFileSync(join(dir,'01-example.md'),'# Lesson');
    }
    const run=(...args)=>spawnSync(process.execPath,[join(base,'scripts/generate-catalog.mjs'),...args],{encoding:'utf8'});
    assert.equal(run().status,0);assert.equal(run('--check').status,0);
    const metadata=join(base,'src/gramlot_examples/pages/family-0/01-example.json');
    const changed=read(metadata);changed.title='Changed title';writeFileSync(metadata,JSON.stringify(changed));
    assert.notEqual(run('--check').status,0);assert.equal(run().status,0);
    assert.equal(read(join(base,'src/gramlot_examples/catalog.json')).families[0].examples[0].title,'Changed title');
    rmSync(join(base,'src/gramlot_examples/pages/family-0/01-example.md'));
    const missing=run('--check');assert.notEqual(missing.status,0);assert.match(missing.stderr,/Missing \.md/);
});
