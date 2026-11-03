import {Page as BasePage, UploadTarget} from '@gramlot/gramlot/page';
import {BrowserCameraProvider} from '@gramlot/gramlot';

class TemporaryImage extends UploadTarget {
    constructor() { super({maxBytes:4 * 1024 * 1024}); this.chunks = []; this.outcome = {state:'pending'}; }
    write(chunk) { this.chunks.push(chunk.slice()); }
    finish() {
        const bytes = new Uint8Array(this.chunks.reduce((size, chunk) => size + chunk.length, 0));
        let offset = 0; for (const chunk of this.chunks) { bytes.set(chunk,offset); offset += chunk.length; }
        let binary = ''; for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i,i + 8192));
        this.chunks = []; this.outcome = {state:'completed',result:'data:image/png;base64,' + btoa(binary)}; return this.outcome;
    }
    abort() { if (this.outcome.state !== 'completed') { this.chunks = []; this.outcome = {state:'unsaved'}; } return this.outcome; }
    status() { return this.outcome; }
}
export class Page extends BasePage {
    static title = 'Editable images';
    main(root) {
        const main_content = root.main({datapath:'imageDemo',padding:'16px'});
        main_content.dataController({func:'attachBrowserCamera',_onStart:true});


        main_content.h2('Browser only');
        main_content.imageUploader({id:'local-image',value:'^.localImage',storepath:'.localQueue'});
        main_content.h2('Application upload');
        main_content.imageUploader({id:'server-image',value:'^.serverImage',storepath:'.serverQueue',operation:'save_image'});
    }
    save_image(metadata) { return new TemporaryImage(); }
}
Page.registerUpload('save_image');

export class Logic {
    attachBrowserCamera() {
        if (!this.page.dvc.provider) this.page.dvc.attach(new BrowserCameraProvider({document:this.page.src.renderer.destination.ownerDocument}));
    }
}
