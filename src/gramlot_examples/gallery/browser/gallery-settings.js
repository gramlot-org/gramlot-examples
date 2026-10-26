import {THEME_READY} from './theme-messages.js';

export const SETTINGS_SET = 'gallery:settings-set';
export const LABEL_POSITIONS = new Set(['example', 'TL', 'TC', 'TR', 'L', 'R', 'BL', 'BC', 'BR']);

/** Gallery preferences use Data; the iframe receives only the preview choice. */
export function mountGallerySettings(renderer, root, state) {
    const document = renderer.destination.ownerDocument;
    const window = document.defaultView;
    const key = `gramlot.gallery.settings:${window.location.pathname}`;
    let saved;
    try { saved = window.localStorage.getItem(key); }
    catch (error) { if (error.name !== 'SecurityError') throw error; }
    state.setItem('labelPosition', LABEL_POSITIONS.has(saved) ? saved : 'example');
    const frames = () => [...renderer.records.get(root).element.querySelectorAll('.gallery-preview iframe')];
    const send = frame => frame.contentWindow.postMessage({type: SETTINGS_SET,
        labelPosition: state.getItem('labelPosition'), touchMode: 'auto'}, window.location.protocol === 'file:' ? '*' : window.location.origin);
    const change = () => {
        try { window.localStorage.setItem(key, state.getItem('labelPosition')); }
        catch (error) { if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error; }
        for (const frame of frames()) if (frame.hasAttribute('src')) send(frame);
    };
    const message = event => {
        if (event.origin !== window.location.origin || event.data?.type !== THEME_READY) return;
        const frame = frames().find(item => item.contentWindow === event.source);
        if (frame) send(frame);
    };
    state.subscribe('gallery-label-position', {any: event => {
        if (event.node.label === 'labelPosition') change();
    }});
    window.addEventListener('message', message);
    let disposed = false;
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        state.unsubscribe('gallery-label-position', {any:true});
        window.removeEventListener('message', message);
    };
    renderer.onDispose(root, dispose);
    return {dispose};
}

/** Preview overrides edit Source, never shadow DOM or application Data. */
export function mountFrameSettings(renderer, owner) {
    const window = renderer.destination.ownerDocument.defaultView;
    if (window.parent === window) return;
    const originals = new Map();
    const message = event => {
        if (event.source !== window.parent || event.data?.type !== SETTINGS_SET ||
            !LABEL_POSITIONS.has(event.data.labelPosition)) return;
        if (['auto', 'on', 'off'].includes(event.data.touchMode)) renderer.binding.gramlot.dom.setTouchMode(event.data.touchMode);
        const position = event.data.labelPosition;
        if (position === 'example') {
            for (const [node, attrs] of originals) if (renderer.records.has(node)) node.setAttr(attrs);
            originals.clear();
            return;
        }
        for (const [node] of renderer.records) {
            if (node.getAttr('lbl') == null) continue;
            const component = node._getMeta('gramlot_component');
            if (component && !component.parameters.value) continue;
            if (!originals.has(node)) {
                originals.set(node, Object.fromEntries(['lbl_position']
                    .map(name => [name, node.getAttr(name)])));
            }
            const attrs = originals.get(node);
            node.setAttr({...attrs, lbl_position: position});
        }
    };
    window.addEventListener('message', message);
    renderer.onDispose(owner, () => {
        window.removeEventListener('message', message);
        for (const [node, attrs] of originals) if (renderer.records.has(node)) node.setAttr(attrs);
        originals.clear();
    });
}
