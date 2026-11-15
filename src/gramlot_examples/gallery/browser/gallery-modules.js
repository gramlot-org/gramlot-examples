import {GalleryState} from './gallery-state.js';

/** Catalogue visibility is a preference; the broker independently authorizes each frame. */
export function nativeApplication(window) {
    return window.Capacitor !== undefined && window.Capacitor.isNativePlatform() &&
        ['ios', 'android'].includes(window.Capacitor.getPlatform());
}

export async function mountGalleryModules(page, root, {load = url => import(url)} = {}) {
    const window = page.src.renderer.destination.ownerDocument.defaultView;
    const state = new GalleryState(root.rootBuilder);
    const native = nativeApplication(window);
    state.setItem('nativeApplication', native);
    if (!state.getItem('modules')) return;
    const visible = () => native || state.getItem('showMobileExamples') === true;
    let disposed = false;
    let registration = null;
    let pending;
    let revision = 0;
    const hosts = new Map();
    const mounted = new Set();
    const hide = () => {
        const navigation = state.getItem('navigation');
        for (const key of mounted) navigation.popNode(key);
        mounted.clear();
    };
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        registration?.close();
        for (const host of hosts.values()) host.dispose();
        hide();
    };
    page.src.renderer.onDispose(root, dispose);
    const reconcile = async () => {
        if (!visible()) { hide(); return; }
        if (native && window.location.protocol !== 'https:') throw new Error('Native gallery modules require HTTPS');
        // Modules are read by label at each use: the loop crosses awaits.
        for (const label of state.getItem('modules').getNodes().map(node => node.label)) {
            const url = new URL(state.getNode(`modules.${label}`).attr.integration, window.location.href);
            if (url.origin !== window.location.origin) throw new Error('Module integration must be same-origin');
            if (!hosts.has(url.href)) {
                const integration = await load(url.href);
                if (disposed || page.state === 'disposed' || !visible()) return;
                hosts.set(url.href, integration.installDeviceFrameHost(page, {origins:[window.location.origin]}));
            }
            const key = `module_${label}`;
            if (mounted.has(key)) continue;
            const navigation = state.getItem('navigation');
            if (navigation.getNode(key)) throw new Error('Module navigation identity collision');
            const module = state.getNode(`modules.${label}`);
            navigation.setItem(key, module.value.deepcopy(), {title:module.attr.title}, '<features');
            mounted.add(key);
        }
    };
    const update = () => {
        revision++;
        if (!visible()) hide();
        // One import/install at a time; replay the latest preference after each await.
        if (!pending) pending = (async () => {
            let applied;
            do {
                applied = revision;
                await reconcile();
            } while (!disposed && applied !== revision);
        })().finally(() => { pending = null; });
        return pending;
    };
    registration = state.watch('showMobileExamples', () => {
        void update().catch(error => {
            if (!disposed) root.builder.nodeById('gallery-load-status').setValue(`Mobile application: ${error.message}`);
        });
    });
    try { await update(); }
    catch (error) { dispose(); throw error; }
    // Hiding the catalogue retains already-open frames and their broker until root disposal.
}
