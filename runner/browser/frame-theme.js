import {THEME_READY, THEME_SET, THEMES} from './theme-messages.js';

/** Theme bridge injected by the runner's launch wrappers, never by Gramlot core. */
export function mountFrameTheme(renderer, node) {
    const window = renderer.destination.ownerDocument.defaultView;
    if (window.parent === window) return;
    const message = event => {
        if (event.source !== window.parent || event.data?.type !== THEME_SET ||
            !THEMES.has(event.data.theme)) return;
        window.document.documentElement.setAttribute('data-theme', event.data.theme);
    };
    window.addEventListener('message', message);
    renderer.onDispose(node, () => window.removeEventListener('message', message));
    window.parent.postMessage({type: THEME_READY}, '*');
}
