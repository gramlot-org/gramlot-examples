import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag} from '@gramlot/gramlot';
import {mountGalleryModules, nativeApplication} from '../src/gramlot_examples/gallery/browser/gallery-modules.js';
function fixture(t, native=true, origin='https://gallery.test/') {
    const {window}=new JSDOM('<main id="gramlot-root"></main>',{url:origin});
    if(native) window.Capacitor={isNativePlatform:()=>true,getPlatform:()=> 'ios'};
    const builder=new GramlotBuilder();builder.root.div({id:'gallery'});
    const app=new Gramlot({document:window.document,transport:false});app.src.startSource(builder.source);
    const entries=new Bag();entries.setItem('app',null,{title:'App info',url:'/mobile-application/app',module:'mobileApplication',moduleEntry:'app'});
    const modules=new Bag();modules.setItem('mobileApplication',entries,{title:'Mobile application',integration:'/mobile-application/device-provider.js'});
    const navigation=new Bag();navigation.setItem('features',null,{title:'Features'});
    app.data.setItem('galleryIndex.navigation',navigation);app.data.setItem('galleryIndex.modules',modules);
    const root=app.src.renderer.elements.get(window.document.getElementById('gallery')).node;
    t.after(()=>{app.dispose();window.close();});
    return {app,root,window,navigation:app.data.getItem('galleryIndex.navigation')};
}
test('ordinary browsers do not import native integration or expose the catalogue',async t=>{
    const f=fixture(t,false);let loaded=0;
    await mountGalleryModules(f.app,f.root,{load:async()=>{loaded++;}});
    assert.equal(loaded,0);assert.equal(f.navigation.getNodes().length,1);
    f.window.Capacitor={isNativePlatform:()=>false,getPlatform:()=> 'web'};
    assert.equal(nativeApplication(f.window),false);
});
test('broker installed before entries appear, same-origin only; root disposal releases it',async t=>{
    const f=fixture(t);let installed=0,disposed=0;
    await mountGalleryModules(f.app,f.root,{load:async url=>{
        assert.equal(url,'https://gallery.test/mobile-application/device-provider.js');
        return {installDeviceFrameHost(page,{origins}) {
            assert.equal(page,f.app);assert.deepEqual(origins,['https://gallery.test']);
            assert.equal(f.navigation.getNodes().length,1);installed++;
            return {dispose(){disposed++;}};
        }};
    }});
    assert.equal(installed,1);
    assert.deepEqual(f.navigation.getNodes().map(node=>node.label),['module_mobileApplication','features']);
    assert.equal(f.navigation.getNode('module_mobileApplication.app').attr.url,'/mobile-application/app');
    f.root.parentBag.popNode(f.root.label);
    assert.equal(disposed,1);assert.equal(f.navigation.getNodes().length,1);
});
test('late load cannot install after disposal and insecure origins fail',async t=>{
    const f=fixture(t);let resolve,installed=0;
    const pending=mountGalleryModules(f.app,f.root,{load:()=>new Promise(r=>resolve=r)});
    f.root.parentBag.popNode(f.root.label);
    resolve({installDeviceFrameHost(){installed++;}});await pending;assert.equal(installed,0);
    const insecure=fixture(t,true,'http://gallery.test/');
    await assert.rejects(mountGalleryModules(insecure.app,insecure.root),/HTTPS/);
    const foreign=fixture(t);foreign.app.data.getNode('galleryIndex.modules.mobileApplication').setAttr({integration:'https://evil.test/device.js'});
    await assert.rejects(mountGalleryModules(foreign.app,foreign.root),/same-origin/);
});

const settled = () => new Promise(resolve => setImmediate(resolve));
test('browser opt-in changes the catalogue immediately, retaining open-frame broker resources', async t => {
    const f=fixture(t,false,'http://localhost/');let installed=0,disposed=0;
    const state=f.app.data.getItem('galleryIndex');
    await mountGalleryModules(f.app,f.root,{load:async()=>({installDeviceFrameHost(){
        installed++;return {dispose(){disposed++;}};
    }})});
    state.setItem('showMobileExamples',true);await settled();
    assert.equal(f.navigation.getNodes().length,2);assert.equal(installed,1);
    assert.equal(state.getItem('nativeApplication'),false);
    state.setItem('showMobileExamples',false);await settled();
    assert.equal(f.navigation.getNodes().length,1);assert.equal(disposed,0);
    state.setItem('showMobileExamples',true);state.setItem('showMobileExamples',false);
    state.setItem('showMobileExamples',true);await settled();
    assert.equal(f.navigation.getNodes().length,2);assert.equal(installed,1);
    f.root.parentBag.popNode(f.root.label);assert.equal(disposed,1);
    state.setItem('showMobileExamples',true);await settled();
    assert.equal(f.navigation.getNodes().length,1);
});
test('switching browser opt-in off during import does not expose entries or install a broker',async t=>{
    const f=fixture(t,false);const state=f.app.data.getItem('galleryIndex');
    state.setItem('showMobileExamples',true);let resolve,installed=0;
    const pending=mountGalleryModules(f.app,f.root,{load:()=>new Promise(r=>resolve=r)});
    state.setItem('showMobileExamples',false);
    resolve({installDeviceFrameHost(){installed++;}});await pending;
    assert.equal(installed,0);assert.equal(f.navigation.getNodes().length,1);
});
for(const platform of ['ios','android']) test(`${platform} shows the catalogue regardless of browser preference`,async t=>{
    const f=fixture(t);f.window.Capacitor.getPlatform=()=>platform;
    const state=f.app.data.getItem('galleryIndex');state.setItem('showMobileExamples',false);
    await mountGalleryModules(f.app,f.root,{load:async()=>({installDeviceFrameHost:()=>({dispose(){}})})});
    assert.equal(state.getItem('nativeApplication'),true);
    state.setItem('showMobileExamples',false);await settled();
    assert.equal(f.navigation.getNodes().length,2);
});
test('browser opt-in does not allow foreign integration origins',async t=>{
    const f=fixture(t,false);f.app.data.setItem('galleryIndex.showMobileExamples',true);
    f.app.data.getNode('galleryIndex.modules.mobileApplication').setAttr({integration:'https://evil.test/device.js'});
    await assert.rejects(mountGalleryModules(f.app,f.root),/same-origin/);
});

test('mobile visibility preference persists with gallery settings across reloads',async t=>{
    const {mountGallerySettings}=await import('../src/gramlot_examples/gallery/browser/gallery-settings.js');
    const {GalleryState}=await import('../src/gramlot_examples/gallery/browser/gallery-state.js');
    const f=fixture(t,false);const state=new GalleryState(f.root.rootBuilder);
    const key='gramlot.gallery.settings:/:showMobileExamples';
    f.window.localStorage.setItem('gramlot.gallery.settings:/','TL');
    const first=mountGallerySettings(f.app.src.renderer,f.root,state);
    assert.equal(state.getItem('showMobileExamples'),false);
    assert.equal(state.getItem('labelPosition'),'TL');
    state.setItem('showMobileExamples',true);
    assert.equal(f.window.localStorage.getItem(key),'true');
    first.dispose();state.setItem('showMobileExamples',false);
    const restored=mountGallerySettings(f.app.src.renderer,f.root,state);
    assert.equal(state.getItem('showMobileExamples'),true);
    state.setItem('showMobileExamples',false);assert.equal(f.window.localStorage.getItem(key),'false');
    restored.dispose();
});
