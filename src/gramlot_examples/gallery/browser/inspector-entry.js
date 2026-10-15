import {mountGalleryInspector} from './gallery-inspector.js';

// Mount the existing palette on the example itself, without the gallery shell.
const script = document.currentScript;
queueMicrotask(() => {
    const renderer = window.gramlot.src.renderer;
    const record = renderer.elements.get(script);
    if (!record || renderer.disposed || renderer.records.get(record.node) !== record) return;
    mountGalleryInspector(renderer, record.node);
});
