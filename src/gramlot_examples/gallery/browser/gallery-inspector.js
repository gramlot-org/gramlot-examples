import {InspectorConnection, attachInspectorAgent} from '@gramlot/gramlot/tools/inspector';
import {INSPECTOR_CONNECT, INSPECTOR_READY} from './inspector-messages.js';

/** One shell palette; only the shell and the visible, registered preview are offered. */
export function mountGalleryInspector(renderer, root, destination = renderer.destination.ownerDocument.body) {
    const document = renderer.destination.ownerDocument;
    const window = document.defaultView;
    const button = document.getElementById('gallery-inspector');
    const buttonNode = renderer.elements.get(button).node;
    let entries = new Map(), active = null, palette = null, rootAgent = null;
    let docked = false, desktopVisible = false;
    const ready = new Set();
    const connections = new Map();
    const buttonState = () => buttonNode.setAttr({disabled: false, checked: !!palette && !palette.hidden});
    const close = () => {
        palette?.remove(); palette = null;
        for (const connection of connections.values()) connection.close();
        connections.clear();
        rootAgent?.dispose(); rootAgent = null;
        buttonState();
    };
    const connectRoot = () => {
        const channel = new window.MessageChannel();
        rootAgent = attachInspectorAgent(window.gramlot, channel.port1);
        connections.set('top', new InspectorConnection(channel.port2));
    };
    const connectFrame = entry => {
        const channel = new window.MessageChannel();
        connections.set(entry.key, new InspectorConnection(channel.port1));
        entry.frame.contentWindow.postMessage({type: INSPECTOR_CONNECT}, '*', [channel.port2]);
    };
    const sync = (follow = false) => {
        if (!palette) return;
        const entry = entries.get(active);
        const available = entry?.frame && ready.has(entry.frame.contentWindow);
        if (available && !connections.has(entry.key)) connectFrame(entry);
        const targets = [{id: 'top', title: `${document.title || 'Gallery'} (top)`, connection: connections.get('top')}];
        if (available) targets.push({id: entry.key, title: entry.title, connection: connections.get(entry.key)});
        palette.targets = targets;
        if (follow) palette.selectedTarget = available ? entry.key : 'top';
        // Hidden previews retain their agent and breakpoints until reload or palette close.
        for (const [id, connection] of connections) if (id !== 'top' && ![...entries.values()].some(entry => entry.key === id)) {
            connection.close(); connections.delete(id);
        }
    };
    const open = () => {
        if (palette) return;
        connectRoot();
        palette = document.createElement('gramlot-tools-inspector');
        palette.toggleAttribute('docked', docked);
        palette.addEventListener('close', close);
        sync(true);
        destination.append(palette);
        buttonState();
    };
    const toggle = () => {
        if (palette && !palette.hidden) { close(); return; }
        open(); palette.hidden = false; buttonState();
    };
    const setPresentation = (nextDocked, visible) => {
        if (nextDocked && !docked) desktopVisible = !!palette && !palette.hidden;
        if (!nextDocked && docked) visible = desktopVisible;
        docked = nextDocked;
        if (visible) open();
        if (palette) {
            palette.toggleAttribute('docked', docked);
            palette.hidden = !visible;
        }
        buttonState();
    };
    const receive = event => {
        if (event.data?.type !== INSPECTOR_READY) return;
        const entry = [...entries.values()].find(item => item.frame?.contentWindow === event.source);
        if (!entry) return;
        ready.add(event.source);
        connections.get(entry.key)?.close(); connections.delete(entry.key);
        sync(entry.url === active);
    };
    const update = (nextEntries, nextActive) => {
        const changed = nextActive !== active;
        entries = nextEntries; active = nextActive;
        sync(changed);
    };
    button.addEventListener('click', toggle);
    window.addEventListener('message', receive);
    buttonState();
    renderer.onDispose(root, () => {
        button.removeEventListener('click', toggle);
        window.removeEventListener('message', receive);
        close(); ready.clear();
    });
    return {update, setPresentation};
}
