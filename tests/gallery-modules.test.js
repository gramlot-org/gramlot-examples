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
    app.data.setItem('galleryIndex.navigation',new Bag());app.data.setItem('galleryIndex.modules',modules);
    const root=app.src.renderer.elements.get(window.document.getElementById('gallery')).node;
    t.after(()=>{app.dispose();window.close();});
    return {app,root,window,navigation:app.data.getItem('galleryIndex.navigation')};
}
test('ordinary browsers do not import native integration or expose the catalogue',async t=>{
    const f=fixture(t,false);let loaded=0;
    await mountGalleryModules(f.app,f.root,{load:async()=>{loaded++;}});
    assert.equal(loaded,0);assert.equal(f.navigation.getNodes().length,0);
    f.window.Capacitor={isNativePlatform:()=>false,getPlatform:()=> 'web'};
    assert.equal(nativeApplication(f.window),false);
});
test('broker installed before entries appear, same-origin only; root disposal releases it',async t=>{
    const f=fixture(t);let installed=0,disposed=0;
    await mountGalleryModules(f.app,f.root,{load:async url=>{
        assert.equal(url,'https://gallery.test/mobile-application/device-provider.js');
        return {installDeviceFrameHost(page,{origins}) {
            assert.equal(page,f.app);assert.deepEqual(origins,['https://gallery.test']);
            assert.equal(f.navigation.getNodes().length,0);installed++;
            return {dispose(){disposed++;}};
        }};
    }});
    assert.equal(installed,1);
    assert.equal(f.navigation.getNode('module_mobileApplication.app').attr.url,'/mobile-application/app');
    f.root.parentBag.popNode(f.root.label);
    assert.equal(disposed,1);assert.equal(f.navigation.getNodes().length,0);
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
