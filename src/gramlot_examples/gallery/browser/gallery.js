import {renderReadme} from './markdown.js';
import {mountGuidedDemo} from './gallery-guide.js';
import {mountGalleryMobile} from './gallery-mobile.js';
import {mountGallerySettings} from './gallery-settings.js';
import {mountGalleryPresentation} from './gallery-presentation.js';
import {mountIndexPage} from '@gramlot/gramlot';
import {mountGalleryContent} from './gallery-content.js';
import {Bag, NavigationResolver} from '@gramlot/gramlot';

/** Gallery specializations around the reusable FramePage/IndexPage contract. */
export function mountGallery(renderer, root, inspector) {
    const state=root.builder.data.getItem('galleryIndex');
    const document=renderer.destination.ownerDocument;
    const byId=id=>document.getElementById(id);
    const source=id=>root.builder.wrapSource(renderer.elements.get(byId(id)).node);
    const set=(element,attrs)=>renderer.elements.get(element).node.setAttr(attrs);
    const settings=mountGallerySettings(renderer,root,state);
    const presentation=mountGalleryPresentation(renderer,root,state);
    let guide=null;
    const content=mountGalleryContent(renderer,root);
    const mobile=mountGalleryMobile(renderer,root,inspector,state,visible=>{if(!visible)guide?.pause();});
    const prepare=entry=>{
        entry.key=entry.node.attr.key??entry.pane.label;
        entry.panel=renderer.records.get(entry.pane).element;
        entry.tab=entry.panel;
        entry.frame=entry.panel.querySelector('iframe');
        entry.code=byId(`codepane-${entry.key}`);
        const description=entry.panel.querySelector('.gallery-directory-markdown');
        if(description) { description.textContent=renderer.elements.get(description).node.value; renderReadme(description); }
        if(entry.frame&&!entry.frame.hasAttribute('src'))set(entry.frame,{src:entry.url});
        if(entry.key==='l04'&&!guide)guide=mountGuidedDemo(renderer,root);
        if(entry.code)content.observe(entry.key);
    };
    const index=mountIndexPage(renderer,root,(entries,active)=>{
        source('gallery-introduction').setAttr({hidden:active!==null});
        source('index-pages').setAttr({hidden:active===null});
        presentation.update(entries,active);inspector.update(entries,active);mobile.update(entries,active);guide?.update(entries,active);
    },prepare,{state,async createEntry(entry){
        const key=entry.node.attr.key??entry.pane.label;
        entry.pane.setAttr({id:`panel-${key}`,class:'gallery-panel'});
        const code=entry.node.attr.category||entry.node.attr.key==null?null:source('gallery-code-pages').div({id:`codepane-${key}`,
            class:'gallery-codepane',hidden:true,height:'100%'});
        if(code)code.tabContainer({id:`code-tabs-${key}`,class:'gallery-source-tabs',height:'100%',tabMode:'underline'})
            .contentPane({title:'Code'}).p('Loading code…',{role:'status'});
        const selection=new Bag();selection.setItem(entry.node.label,null,{...entry.node.attr});
        try {
            const mounted=await renderer.binding.gramlot.src.remoteSource(entry.pane,'index_panel',{selection});
            if(!mounted)throw new Error('Panel loading was cancelled');
        }catch(error){if(code?.parentBag)code.parentBag.popNode(code.label);throw error;}
    },onLoad(url,status){
        source('gallery-load-status').setValue(status==='loading'?'Loading page…':status==='error'?'Could not load this page. Select it again to retry.':'');
    }});
    return {dispose(){guide?.dispose();content.dispose();settings.dispose();presentation.dispose();index.dispose();mobile.dispose();}};
}

/** Install directory resolvers during page build, before the tree first renders. */
export function initializeNavigation(renderer, root) {
    const state=root.builder.data.getItem('galleryIndex');
    state.setItem('navigationOpen', true);
    state.setItem('settingsOpen', false);
    const navigation=state.getItem('navigation');
    const resolvers=[];
    for(const node of navigation.getNodes()) if(node.attr.directory !== undefined && node.resolver === null) {
        const resolver=new NavigationResolver({gramlot:renderer.binding.gramlot,method:'navigation_section',directory:node.attr.directory,
            onError:error=>{renderer.elements.get(renderer.destination.ownerDocument.getElementById('gallery-load-status')).node.setValue(`Could not load directory: ${error.message}`);}});
        navigation.setResolver(node.label,resolver);resolvers.push(resolver);
    }
    renderer.onDispose(root,()=>{for(const resolver of resolvers)resolver.abort();});
}


/** Toolbar actions change the same Source drawers as their built-in handles. */
export function toggleGalleryPanel(builder, nodeId, statePath) {
    builder.nodeById(nodeId).setAttr({drawer: builder.data.getItem(statePath) ? 'close' : true});
}
