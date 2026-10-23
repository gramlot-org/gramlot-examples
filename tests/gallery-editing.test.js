import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {Gramlot} from '@gramlot/gramlot';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import editors from '@gramlot/gramlot/components/editors';

const source = execFileSync(process.env.GRAMLOT_TEST_PYTHON || 'python3', ['-c', `
import json
from gramlot import GramlotBuilder
from gramlot_examples.gallery.page import Page
from gramlot_examples.gallery.collections import collections
class Trial(Page):
    def source_document(self, key):
        return dict(content='value = 1\\n', revision='r1', writable=key != 'readonly')
b = GramlotBuilder(collections=[json.loads(entry.verify()[entry.grammar]) for entry in collections()])
for key in ['first', 'second', 'readonly']:
    b.root.iframe(id='frame-' + key, src='pages/' + key)
    Trial().code_panel(b.root.tabContainer(), dict(key=key, logic=None))
print(b.to_tytx())
`], {encoding:'utf8'}).trim();
const tick = () => new Promise(resolve => setTimeout(resolve, 20));
async function fixture(t) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {url:'http://localhost/py/', pretendToBeVisual:true});
    for (const name of ['window','document','MutationObserver','Window','HTMLElement','Node','getComputedStyle','customElements']) globalThis[name]=window[name];
    window.ResizeObserver=class {observe(){}unobserve(){}disconnect(){}};
    window.Range.prototype.getClientRects=()=>[];
    window.Range.prototype.getBoundingClientRect=()=>({left:0,right:0,top:0,bottom:0,width:0,height:0});
    window.confirm=()=>true;
    const {Logic} = await import('../src/gramlot_examples/gallery/browser/entry.js');
    const errors=[];window.addEventListener('error',e=>errors.push(e.error));
    const app=new Gramlot({document:window.document,transport:false,collections:[layout,inputs,editors]});
    app.src.logicRegistry.register(Logic,{resource:'test:gallery-editing'});
    app.src.startSource(source);
    await tick();
    for (const editor of window.document.querySelectorAll('gramlot-code-mirror')) await editor.ready;
    const doc=key=>app.data.getItem(`galleryIndex.sourceDocuments.s_${Buffer.from(key).toString('hex')}`);
    const frame=key=>window.document.getElementById('frame-'+key);
    const editor=key=>window.document.getElementById('code-'+key);
    t.after(()=>{app.dispose();window.close();assert.deepEqual(errors,[]);});
    return {app,window,doc,frame,editor};
}

test('Python-authored CodeMirror saves with Ctrl+S; only saved iframe reloads and concurrent draft survives',async t=>{
    const f=await fixture(t), calls=[];
    let finish;
    f.app.rpc.call=(type,name,args)=>{calls.push({type,name,args});return new Promise(resolve=>finish=resolve);};
    const otherWindow=f.frame('second').contentWindow;
    const edit=f.editor('first');
    edit.editor.view.dispatch({changes:{from:8,to:9,insert:'2'}});
    await tick();
    assert.equal(f.doc('first').getItem('saveDisabled'),false);
    edit.editor.view.contentDOM.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'s',code:'KeyS',ctrlKey:process.platform !== 'darwin',metaKey:process.platform === 'darwin',bubbles:true,cancelable:true}));
    await tick();
    assert.equal(calls.length,1);
    assert.deepEqual(calls[0],{type:'data',name:'gallery_source_save',args:{key:'first',content:'value = 2\n',revision:'r1'}});
    assert.equal(f.doc('first').getItem('busy'),true);
    await f.app.logic.galleryCodeSave(null,{key:'first'});
    assert.equal(calls.length,1,'pending save cannot be repeated');
    edit.editor.view.dispatch({changes:{from:8,to:9,insert:'3'}});
    finish({revision:'r2'});await tick();
    assert.equal(f.doc('first').getItem('content'),'value = 3\n');
    assert.equal(f.doc('first').getItem('saved'),'value = 2\n');
    assert.equal(f.doc('first').getItem('saveDisabled'),false);
    assert.match(f.frame('first').src,/\/py\/pages\/first\?gallery_revision=r2$/);
    assert.equal(f.frame('second').contentWindow,otherWindow);
    assert.equal(f.frame('second').getAttribute('src'),'pages/second');
    f.app.logic.galleryCodeRevert(null,{key:'first'});await tick();
    assert.equal(f.doc('first').getItem('content'),'value = 2\n');
    assert.equal(f.doc('first').getItem('saveDisabled'),true);
});

test('save errors preserve draft, baseline, revision and preview; readonly cannot save',async t=>{
    const f=await fixture(t);
    let calls=0;
    f.app.rpc.call=async()=>{calls++;throw new Error('Python syntax error at line 1');};
    const originalWindow=f.frame('first').contentWindow;
    f.doc('first').setItem('content','broken python');
    await f.app.logic.galleryCodeSave(null,{key:'first'});
    assert.equal(f.doc('first').getItem('content'),'broken python');
    assert.equal(f.doc('first').getItem('saved'),'value = 1\n');
    assert.equal(f.doc('first').getItem('revision'),'r1');
    assert.match(f.doc('first').getItem('status'),/syntax error/);
    assert.equal(f.frame('first').contentWindow,originalWindow);
    assert.equal(f.doc('first').getItem('busy'),false);
    f.doc('readonly').setItem('content','even programmatic changes');
    await f.app.logic.galleryCodeSave(null,{key:'readonly'});
    assert.equal(calls,1);
    assert.equal(f.editor('readonly').editor.view.state.readOnly,true);
});

test('disposal aborts a pending save and ignores a late reply',async t=>{
    const f=await fixture(t);
    let finish, signal;
    f.app.rpc.call=(type,name,args,options)=>{signal=options.signal;return new Promise(resolve=>finish=resolve);};
    f.doc('first').setItem('content','value = 4\n');
    const saving=f.app.logic.galleryCodeSave(null,{key:'first'});
    const doc=f.doc('first');
    const node=f.app.src.renderer.elements.get(f.editor('first')).node.parentNode;
    node.parentBag.popNode(node.label);
    assert.equal(signal.aborted,true);
    finish({revision:'late'});await saving;
    assert.equal(doc.getItem('saved'),'value = 1\n');
    assert.equal(f.frame('first').getAttribute('src'),'pages/first');
});
