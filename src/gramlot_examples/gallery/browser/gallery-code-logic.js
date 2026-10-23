/** Python gallery source editing: drafts belong to Data, requests to the mounted panel. */
export class GalleryCodeLogic {
    galleryCodeMount(node, {key}) {
        this.galleryCodeDocuments ??= new Map();
        const doc = node.getRelativeData('.');
        const entry = {doc, node:node.parentNode, request:null, disposed:false};
        this.galleryCodeDocuments.set(key,entry);
        const update = () => {
            const dirty = doc.getItem('content') !== doc.getItem('saved');
            doc.setItem('saveDisabled',!dirty || doc.getItem('readonly') || doc.getItem('busy'));
            doc.setItem('revertDisabled',!dirty || doc.getItem('busy'));
        };
        doc.subscribe('gallery-code',{any:event => {
            if (['content','saved','readonly','busy'].includes(event.node.label)) update();
        }});
        update();
        this.page.src.renderer.onDispose(entry.node,() => {
            entry.disposed=true;
            entry.request?.abort();
            doc.unsubscribe('gallery-code',{any:true});
            if (this.galleryCodeDocuments.get(key) === entry) this.galleryCodeDocuments.delete(key);
        });
    }
    async galleryCodeSave(node, {key}) {
        const entry = this.galleryCodeDocuments.get(key);
        if (!entry || entry.disposed || entry.doc.getItem('saveDisabled')) return;
        const {doc} = entry;
        const content = doc.getItem('content');
        const request = new AbortController();
        entry.request=request;
        doc.setItem('busy',true);
        doc.setItem('status','Saving…');
        try {
            const result=await this.page.rpc.call('data','gallery_source_save',
                {key,content,revision:doc.getItem('revision')},{signal:request.signal});
            if (entry.disposed || request.signal.aborted) return;
            doc.setItem('revision',result.revision);
            doc.setItem('saved',content);
            const renderer=this.page.src.renderer;
            const frame=renderer.destination.ownerDocument.getElementById(`frame-${key}`);
            const frameNode=renderer.elements.get(frame).node;
            const url=new URL(frameNode.getAttr('src'),frame.ownerDocument.baseURI);
            url.searchParams.set('gallery_revision',result.revision);
            frameNode.setAttr({src:url.href});
            doc.setItem('status','Saved. Preview reloaded from its initial state.');
        } catch (error) {
            if (!entry.disposed && !request.signal.aborted) doc.setItem('status',error.message);
        } finally {
            entry.request=null;
            if (!entry.disposed) doc.setItem('busy',false);
        }
    }
    galleryCodeRevert(node, {key}) {
        const entry=this.galleryCodeDocuments.get(key);
        if (!entry || entry.disposed || entry.doc.getItem('revertDisabled')) return;
        const view=this.page.src.renderer.destination.ownerDocument.defaultView;
        if (!view.confirm('Discard changes and restore the last loaded or saved source?')) return;
        entry.doc.setItem('content',entry.doc.getItem('saved'));
        entry.doc.setItem('status','Restored the last loaded or saved source.');
    }
}
