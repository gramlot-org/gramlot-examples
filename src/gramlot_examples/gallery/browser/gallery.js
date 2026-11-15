import {mountFeatureProgress, markFeatureExampleSeen, openFeatureExample} from './gallery-features.js';
import {renderReadme} from './markdown.js';
import {mountGuidedDemo} from './gallery-guide.js';
import {mountGalleryMobile} from './gallery-mobile.js';
import {mountSinglePage} from './gallery-single-page.js';
import {mountGallerySettings} from './gallery-settings.js';
import {mountGalleryPresentation} from './gallery-presentation.js';
import {mountIndexPage} from '@gramlot/gramlot';
import {mountGalleryContent} from './gallery-content.js';
import {Bag} from '@gramlot/gramlot';
import {mountGalleryFilter} from './gallery-filter.js';
import {GalleryState} from './gallery-state.js';
export {initializeNavigation} from './gallery-filter.js';

/** Gallery specializations around the reusable FramePage/IndexPage contract. */
export function mountGallery(renderer, root, inspector) {
    const state=new GalleryState(root.rootBuilder);
    const document=renderer.destination.ownerDocument;
    const byId=id=>document.getElementById(id);
    const source=id=>root.builder.wrapSource(renderer.elements.get(byId(id)).node);
    const set=(element,attrs)=>renderer.elements.get(element).node.setAttr(attrs);
    const settings=mountGallerySettings(renderer,root,state);
    const filter=mountGalleryFilter(renderer,root,state);
    const presentation=mountGalleryPresentation(renderer,root,state);
    const progress = mountFeatureProgress(renderer, root, state);
    const showContent = () => {
        const features = state.getItem('featuresOpen') === true;
        const active = state.getItem('active');
        source('gallery-features').setAttr({hidden:!features});
        source('gallery-introduction').setAttr({hidden:features || active!==null});
        source('index-pages').setAttr({hidden:features || active===null || !state.getItem('multipage')});
        source('gallery-single').setAttr({hidden:features || active===null || state.getItem('multipage')});
    };
    const featureView = [
        state.watch('navigationSelection', () => {
            state.setItem('featureRequest', null);
            state.setItem('featuresOpen', state.getItem('navigationSelection') === 'features');
        }),
        state.watch('featuresOpen', showContent)];
    const closeFeatureView = () => { for (const registration of featureView) registration.close(); };
    renderer.onDispose(root, closeFeatureView);
    // A lesson link rendered by renderReadme opens that lesson in the gallery.
    const openLesson = event => {
        const anchor = event.target.closest?.('a[data-gallery-lesson]');
        if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openFeatureExample(root, anchor.dataset.galleryLesson).catch(error => console.error(error));
    };
    document.addEventListener('click', openLesson);
    renderer.onDispose(root, () => document.removeEventListener('click', openLesson));
    let guide=null;
    const content=mountGalleryContent(renderer,root);
    const single=mountSinglePage(renderer,root,state,content);
    const mobile=mountGalleryMobile(renderer,root,inspector,state,visible=>{if(!visible)guide?.pause();});
    const prepare=entry=>{
        entry.key=entry.node.attr.key??entry.pane.label;
        if (!state.getItem('multipage')) { single.prepare(entry); return; }
        entry.panel=renderer.records.get(entry.pane).element;
        entry.tab=entry.panel;
        entry.frame=entry.panel.querySelector('iframe');
        entry.code=byId(`codepane-${entry.key}`);
        const description=entry.panel.querySelector('.gallery-directory-markdown');
        if(description) { description.textContent=renderer.elements.get(description).node.value; renderReadme(description,{base:entry.url,lessons:state.getItem('featureExamples')}).catch(error => console.error(error)); }
        if(entry.frame&&!entry.frame.hasAttribute('src'))set(entry.frame,{src:entry.url});
        if(entry.key==='l04'&&!guide)guide=mountGuidedDemo(renderer,root);
        if(entry.code)content.observe(entry.key);
    };
    const index=mountIndexPage(renderer,root,(entries,active)=>{
        if (root.galleryModeChanging) return;
        source('gallery-load-status').setValue(entries.get(active)?.loading ? 'Loading page…' : '');
        state.setItem('featureRequest', null);
        state.setItem('featuresOpen', false);
        showContent();
        const entry = entries.get(active);
        if (entry && !entry.loading && !state.getItem('multipage')) {
            single.update(entry);
            if (!guide) guide=mountGuidedDemo(renderer,root);
            for (const other of [...entries.values()]) if (other !== entry) other.pane.parentBag.popNode(other.pane.label);
        }
        settings.update(entry && !entry.loading && entry.code ? (state.getItem('multipage') ? entry.key : 'single') : null);
        if (entry && !entry.loading) markFeatureExampleSeen(state, entry.key);
        presentation.update(entries,active);inspector.update(entries,active);mobile.update(entries,active);guide?.update(entries,active);
    },prepare,{state:'galleryIndex',async createEntry(entry){
        if (!state.getItem('multipage')) { await single.ensure(); return; }
        const key=entry.node.attr.key??entry.pane.label;
        entry.pane.setAttr({id:`panel-${key}`,class:'gallery-panel'});
        const selection=new Bag();selection.setItem(entry.node.label,null,{...entry.node.attr});
        const mounted=await renderer.binding.gramlot.src.remoteSource(entry.pane,'index_panel',{selection});
        if(!mounted)throw new Error('Panel loading was cancelled');
    },onLoad(url,status){
        if(index.disposed)return;
        if (status === 'ready') markFeatureExampleSeen(state, index.entries.get(url).key);
        const active=state.getItem('active');
        const loading=index.entries.get(active)?.loading;
        source('gallery-load-status').setValue(loading?'Loading page…':
            status==='error'&&(active===url||active===null)?'Could not load this page. Select it again to retry.':'');
    }});
    const multipage = state.watch('multipage', () => {
        const selected = state.getItem('navigationSelection');
        root.galleryModeChanging = true;
        try {
            guide?.dispose(); guide=null;
            for (const entry of [...index.entries.values()]) entry.pane.parentBag.popNode(entry.pane.label);
            single.clear();
        } finally { root.galleryModeChanging = false; }
        showContent();
        if (selected != null) state.setItem('navigationSelection', selected);
    });
    renderer.onDispose(root,()=>multipage.close());
    return {dispose(){filter.dispose();multipage.close();progress.dispose();closeFeatureView();guide?.dispose();content.dispose();settings.dispose();presentation.dispose();index.dispose();mobile.dispose();}};
}

/** Toolbar actions change the same Source drawers as their built-in handles. */
export function toggleGalleryPanel(builder, nodeId, statePath) {
    builder.nodeById(nodeId).setAttr({drawer: builder.data.getItem(statePath) ? 'close' : true});
}
