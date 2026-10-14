import {attachInspectorAgent} from '@gramlot/gramlot/tools/inspector';
import {INSPECTOR_CONNECT, INSPECTOR_READY} from './inspector-messages.js';

/** The example owns its real Bags and executes edits/breakpoints in its own realm. */
export function mountFrameInspector(renderer, node) {
    const window = renderer.destination.ownerDocument.defaultView;
    if (window.parent === window) return;
    let agent = null;
    const message = event => {
        if (event.source !== window.parent || event.data?.type !== INSPECTOR_CONNECT || event.ports.length !== 1) return;
        agent?.dispose();
        agent = attachInspectorAgent(window.gramlot, event.ports[0]);
    };
    window.addEventListener('message', message);
    window.parent.postMessage({type: INSPECTOR_READY}, '*');
    renderer.onDispose(node, () => {
        window.removeEventListener('message', message);
        agent?.dispose();
    });
}
