import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

test('documentation tools have no extra inspector and retain the full collection export', async t => {
    const scriptUrl = new URL('../scripts/build-docs-example.mjs', import.meta.url);
    const script = await readFile(scriptUrl, 'utf8');
    const moduleUrl = code => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
    const pageUrl = moduleUrl('export class Page { async main(root) { root.example(); } }');
    const temp = await mkdtemp(join(tmpdir(), 'gramlot-docs-tool-'));
    t.after(() => rm(temp, {recursive:true, force:true}));
    const logicUrl = join(temp, 'logic.mjs');
    await writeFile(logicUrl, 'export const fixture = true;');
    const capture = `export const writes=new Map(), exports=[];
        export const mkdir=async()=>{}, rm=async()=>{}, copyFile=async()=>{};
        export const writeFile=async(path,text)=>{writes.set(path,text);};
        export const buildDirectory=async(options)=>{exports.push(options);};`;
    const fixture = `export function buildGallery() {
        const entries=[{key:'text',title:'Text'},{key:'typst_editor',title:'Typst'},
            {key:'visual_source',title:'Visual editor',presentation:'tool'}];
        // The documentation gallery pages exported for the core manual.
        const documentation=['documentation-01-name','documentation-02-triangle','documentation-03-many'];
        return {families:[{examples:entries}],routes:Object.fromEntries([...entries.map(e=>e.key),...documentation].map(key=>[key,
            {page:${JSON.stringify(pageUrl)},logic:${JSON.stringify(logicUrl)}}])), assets:{},
            collections:['layout'].map(name=>({module:'/collections/'+name+'/index.js',grammar:{grammar:{name}}}))};
    }`;
    const bundled = await build({stdin:{contents:script+'\nexport {writes, exports} from "test:capture";',
        resolveDir:fileURLToPath(new URL('../scripts/', import.meta.url)),sourcefile:'docs-export-fixture.mjs'},
        bundle:true,write:false,platform:'node',format:'esm',
        define:{'import.meta.url':JSON.stringify(scriptUrl.href)},
        plugins:[{name:'export-boundary',setup(build){
            build.onResolve({filter:/^(node:fs\/promises|test:capture|@gramlot\/gramlot-serverless\/directory)$/},()=>({path:'capture',namespace:'fixture'}));
            build.onResolve({filter:/gramlot_examples\/index\.js$/},()=>({path:'gallery',namespace:'fixture'}));
            build.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='capture'?capture:fixture}));
        }}]});
    const result = await import(moduleUrl(bundled.outputFiles[0].text));
    const ordinary = result.exports.find(item => item.pages.text);
    const visual = result.exports.find(item => item.output.endsWith('/visual_source'));
    assert.ok(ordinary);
    assert.ok(visual, 'Visual editor has its own standard exporter invocation');
    assert.equal(ordinary.pages.visual_source, undefined);
    assert.deepEqual(ordinary.collections.map(item=>item.grammar.grammar.name),['layout']);
    assert.deepEqual(visual.collections.map(item=>item.grammar.grammar.name),['layout']);
    assert.deepEqual(Object.keys(visual.pages),['index']);
    for (const [pagePath, expected] of [[ordinary.pages.text,['inspector','example','script']],
                                      [visual.pages.index,['example']]]) {
        const {Page} = await import(moduleUrl(result.writes.get(pagePath)));
        const calls=[];
        await new Page().main({example(){calls.push('example');},script(){calls.push('script');},
            div(){calls.push('inspector');return {button(){return {span(){}};}};}});
        assert.deepEqual(calls,expected);
    }
});
