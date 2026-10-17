import {THEME_READY, THEME_SET, THEMES, APPEARANCES} from './theme-messages.js';

import {appearanceStyles} from '../dist/theme-styles.js';

/** Theme bridge injected by the gallery's launch wrappers, never by Gramlot core. */
export function mountFrameTheme(renderer, node) {
    const window = renderer.destination.ownerDocument.defaultView;
    if (window.parent === window) return;
    const style = node.builder.wrapSource(node.parentBag).style(appearanceStyles.compact);
    const message = event => {
        if (event.source !== window.parent || event.data?.type !== THEME_SET ||
            !THEMES.has(event.data.theme) || !APPEARANCES.has(event.data.appearance)) return;
        window.document.documentElement.setAttribute('data-theme', event.data.theme);
        style.setValue(appearanceStyles[event.data.appearance]);
    };
    window.addEventListener('message', message);
    renderer.onDispose(node, () => {
        window.removeEventListener('message', message);
        if (style.parentBag) style.parentBag.popNode(style.label);
    });
    window.parent.postMessage({type: THEME_READY, devices: renderer.binding.gramlot.devices}, '*');
}
