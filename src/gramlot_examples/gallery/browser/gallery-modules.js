/** Catalogue visibility is a preference; the broker independently authorizes each frame. */
export function nativeApplication(window) {
    return window.Capacitor !== undefined && window.Capacitor.isNativePlatform() &&
        ['ios', 'android'].includes(window.Capacitor.getPlatform());
}

export async function mountGalleryModules(page, root, {load = url => import(url)} = {}) {
    const window = page.src.renderer.destination.ownerDocument.defaultView;
    const state = root.builder.data.getItem('galleryIndex');
    const native = nativeApplication(window);
    state.setItem('nativeApplication', native);
    const modules = state.getItem('modules');
    if (!modules) return;
    const visible = () => native || state.getItem('showMobileExamples') === true;
    let disposed = false;
    let pending;
    let revision = 0;
    const hosts = new Map();
    const navigation = state.getItem('navigation');
    const mounted = new Set();
    const hide = () => {
        for (const key of mounted) navigation.popNode(key);
        mounted.clear();
    };
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        state.unsubscribe('gallery-modules', {any:true});
        for (const host of hosts.values()) host.dispose();
        hide();
    };
    page.src.renderer.onDispose(root, dispose);
    const reconcile = async () => {
        if (!visible()) { hide(); return; }
        if (native && window.location.protocol !== 'https:') throw new Error('Native gallery modules require HTTPS');
        for (const node of modules.getNodes()) {
            const url = new URL(node.attr.integration, window.location.href);
            if (url.origin !== window.location.origin) throw new Error('Module integration must be same-origin');
            if (!hosts.has(url.href)) {
                const integration = await load(url.href);
                if (disposed || page.state === 'disposed' || !visible()) return;
                hosts.set(url.href, integration.installDeviceFrameHost(page, {origins:[window.location.origin]}));
            }
            const key = `module_${node.label}`;
            if (mounted.has(key)) continue;
            if (navigation.getNode(key)) throw new Error('Module navigation identity collision');
            navigation.setItem(key, node.value.deepcopy(), {title:node.attr.title}, '<features');
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
    state.subscribe('gallery-modules', {any:event => {
        if (event.node !== state.getNode('showMobileExamples')) return;
        void update().catch(error => {
            if (!disposed) root.builder.nodeById('gallery-load-status').setValue(`Mobile application: ${error.message}`);
        });
    }});
    try { await update(); }
    catch (error) { dispose(); throw error; }
    // Hiding the catalogue retains already-open frames and their broker until root disposal.
}
