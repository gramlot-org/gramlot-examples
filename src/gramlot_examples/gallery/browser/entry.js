import {GalleryCodeLogic} from './gallery-code-logic.js';
import {mountGallery, initializeNavigation} from './gallery.js';
import {mountGalleryInspector} from './gallery-inspector.js';

/** The gallery uses the ordinary Page Logic lifecycle. */
export class Logic {
    galleryCodeMount(node, args) { return GalleryCodeLogic.prototype.galleryCodeMount.call(this, node, args); }
    galleryCodeSave(node, args) { return GalleryCodeLogic.prototype.galleryCodeSave.call(this, node, args); }
    galleryCodeRevert(node, args) { return GalleryCodeLogic.prototype.galleryCodeRevert.call(this, node, args); }
    galleryInitialize() {
        const renderer = this.page.src.renderer;
        const root = renderer.elements.get(renderer.destination.ownerDocument.getElementById('gallery')).node;
        initializeNavigation(renderer, root);
    }
    galleryMount() {
        const renderer = this.page.src.renderer;
        const document = renderer.destination.ownerDocument;
        const root = renderer.elements.get(document.getElementById('gallery')).node;
        const inspector = mountGalleryInspector(renderer, root, document.getElementById('gallery-inspector-panel'));
        mountGallery(renderer, root, inspector);
    }
}
