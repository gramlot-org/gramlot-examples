import {mountGallery} from './gallery.js';
import {mountGalleryInspector} from './gallery-inspector.js';

// The page authors this classic script as the last child of its gallery shell.
// Wait until Source insertion completes before using the existing render records.
const script = document.currentScript;
queueMicrotask(() => {
    const renderer = window.gramlot.src.renderer;
    const record = renderer.elements.get(script.parentElement);
    if (!record || renderer.disposed || renderer.records.get(record.node) !== record) return; // Removed while the script was loading.
    const inspector = mountGalleryInspector(renderer, record.node, document.getElementById('gallery-inspector-panel'));
    mountGallery(renderer, record.node, inspector);
});
