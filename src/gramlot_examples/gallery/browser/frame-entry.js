import {mountFrameInspector} from './frame-inspector.js';
import {mountFrameTheme} from './frame-theme.js';

const script = document.currentScript;
queueMicrotask(() => {
    const renderer = window.gramlot.src.renderer;
    const record = renderer.elements.get(script);
    if (!record || renderer.disposed || renderer.records.get(record.node) !== record) return;
    mountFrameInspector(renderer, record.node);
    mountFrameTheme(renderer, record.node);
});
