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
    const multipageKey = `${key}:multipage`;
    let multipage = true;
    try { multipage = window.localStorage.getItem(multipageKey) !== 'false'; }
    catch (error) { if (error.name !== 'SecurityError') throw error; }
    state.setItem('multipage', multipage);
    const viewKey = `${key}:keepLessonView`;
    let keepLessonView = true;
    try { keepLessonView = window.localStorage.getItem(viewKey) !== 'false'; }
    catch (error) { if (error.name !== 'SecurityError') throw error; }
    state.setItem('keepLessonView', keepLessonView);
    state.setItem('lessonView', 'example');
    state.setItem('lessonKey', null);
    const mobileKey = `${key}:showMobileExamples`;
    let showMobileExamples = false;
    try { showMobileExamples = window.localStorage.getItem(mobileKey) === 'true'; }
    catch (error) { if (error.name !== 'SecurityError') throw error; }
    state.setItem('showMobileExamples', showMobileExamples);
    const frames = () => [...renderer.records.get(root).element.querySelectorAll('.gallery-preview iframe')];
    const send = frame => frame.contentWindow.postMessage({type: SETTINGS_SET,
        labelPosition: state.getItem('labelPosition'), touchMode: 'auto'}, window.location.protocol === 'file:' ? '*' : window.location.origin);
    const change = () => {
        try { window.localStorage.setItem(key, state.getItem('labelPosition')); }
        catch (error) { if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error; }
        for (const frame of frames()) if (frame.hasAttribute('src')) send(frame);
    };
    const message = event => {
        if (event.origin !== (window.location.protocol === 'file:' ? 'null' : window.location.origin) || event.data?.type !== THEME_READY) return;
        const frame = frames().find(item => item.contentWindow === event.source);
        if (frame) send(frame);
    };
    const remember = (name, storageKey) => state.watch(name, () => {
        try { window.localStorage.setItem(storageKey, String(state.getItem(name))); }
        catch (error) { if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error; }
    });
    const registrations = [
        state.watch('labelPosition', change),
        remember('multipage', multipageKey),
        remember('keepLessonView', viewKey),
        // A lesson's own view is a child of lessonViews; only the current lesson drives lessonView.
        state.watch('lessonViews', event => {
            const lessonKey = state.getItem('lessonKey');
            if (lessonKey == null || event.path !== state.address(`lessonViews.${lessonKey}`)) return;
            const view = state.getItem(`lessonViews.${lessonKey}`);
            if (['example', 'explanation', 'code'].includes(view)) state.setItem('lessonView', view);
        }),
        remember('showMobileExamples', mobileKey)];
    window.addEventListener('message', message);
    let disposed = false;
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        for (const registration of registrations) registration.close();
        window.removeEventListener('message', message);
    };
    renderer.onDispose(root, dispose);
    return {
        update(lessonKey) {
            if (lessonKey === state.getItem('lessonKey')) return;
            state.setItem('lessonKey', lessonKey);
            if (lessonKey != null) {
                if (state.getItem('keepLessonView')) state.setItem(`lessonViews.${lessonKey}`, state.getItem('lessonView'));
                else state.setItem('lessonView', state.getItem(`lessonViews.${lessonKey}`));
            }
        },
        dispose,
    };
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
