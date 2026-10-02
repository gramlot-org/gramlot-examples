import {mountGallery} from './gallery.js';

// The page authors this classic script as the last child of its gallery shell.
// Wait until Source insertion completes before using the existing render records.
const script = document.currentScript;
queueMicrotask(() => {
    const renderer = window.gramlot.renderer;
    const record = renderer.elements.get(script.parentElement);
    if (!record || renderer.disposed || renderer.records.get(record.node) !== record) return; // Removed while the script was loading.
    mountGallery(renderer, record.node);
});
