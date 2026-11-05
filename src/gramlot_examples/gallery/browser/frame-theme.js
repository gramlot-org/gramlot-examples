import {THEME_READY, THEME_SET, THEMES, APPEARANCES} from './theme-messages.js';

import {appearanceStyles, paletteStyles} from '../dist/theme-styles.js';

const lessonFields = `input:not([type=checkbox],[type=radio],[type=button],[type=submit],[type=reset]), select, textarea,
    gramlot-textbox, gramlot-passwordbox, gramlot-text-box-area, gramlot-number-text-box,
    gramlot-date-text-box, gramlot-time-text-box, gramlot-filtering-select, gramlot-combo-box,
    gramlot-db-select, gramlot-db-combo-box, gramlot-horizontal-slider`;
const lessonStyles = `
.example-page :where(${lessonFields}),
.example-page .gramlot-labelbox:has(> .control-box > :is(${lessonFields})) {
    max-inline-size: min(100%, 28rem);
}
.example-page.stack > :is(button, input[type=button], input[type=submit], input[type=reset]) {
    inline-size: fit-content;
    justify-self: start;
    align-self: start;
}
`;

/** Theme bridge injected by the gallery's launch wrappers, never by Gramlot core. */
export function mountFrameTheme(renderer, node) {
    const window = renderer.destination.ownerDocument.defaultView;
    const appearance = node.getAttr('data_appearance');
    if (window.parent === window && appearance == null) return;
    if (appearance != null && !APPEARANCES.has(appearance)) throw new Error('Unknown frame appearance');
    const style = node.builder.wrapSource(node.parentBag).style(appearanceStyles[appearance ?? 'compact'] + '\n' + lessonStyles);
    const message = event => {
        if (event.origin !== (window.location.protocol === 'file:' ? 'null' : window.location.origin) || event.source !== window.parent || event.data?.type !== THEME_SET ||
            !THEMES.has(event.data.theme) || !APPEARANCES.has(event.data.appearance) || typeof event.data.palette !== 'string' || !Object.hasOwn(paletteStyles, event.data.palette)) return;
        window.document.documentElement.setAttribute('data-theme', event.data.theme);
        style.setValue(appearanceStyles[event.data.appearance] + '\n' + paletteStyles[event.data.palette] + '\n' + lessonStyles);
    };
    window.addEventListener('message', message);
    renderer.onDispose(node, () => {
        window.removeEventListener('message', message);
        if (style.parentBag) style.parentBag.popNode(style.label);
    });
    if (window.parent !== window) window.parent.postMessage({type: THEME_READY, devices: renderer.binding.gramlot.devices}, window.location.protocol === 'file:' ? '*' : window.location.origin);
}
