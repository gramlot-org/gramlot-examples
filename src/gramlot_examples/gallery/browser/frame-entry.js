import {mountFrameTheme} from './frame-theme.js';

const script = document.currentScript;
queueMicrotask(() => {
    const renderer = window.gramlot.renderer;
    const record = renderer.elements.get(script);
    if (!record || renderer.disposed || renderer.records.get(record.node) !== record) return;
    mountFrameTheme(renderer, record.node);
});
