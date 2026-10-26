/** Native catalogue visibility is presentation; the broker separately authorizes each frame. */
export function nativeApplication(window) {
    return window.Capacitor !== undefined && window.Capacitor.isNativePlatform() &&
        ['ios', 'android'].includes(window.Capacitor.getPlatform());
}

export async function mountGalleryModules(page, root, {load = url => import(url)} = {}) {
    const window = page.src.renderer.destination.ownerDocument.defaultView;
    const state = root.builder.data.getItem('galleryIndex');
    const modules = state.getItem('modules');
    if (!modules || !nativeApplication(window)) return;
    if (window.location.protocol !== 'https:') throw new Error('Native gallery modules require HTTPS');
    let disposed = false;
    const hosts = new Map();
    const navigation = state.getItem('navigation');
    const mounted = [];
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        for (const host of hosts.values()) host.dispose();
        for (const key of mounted) navigation.popNode(key);
    };
    page.src.renderer.onDispose(root, dispose);
    try {
        for (const node of modules.getNodes()) {
            const url = new URL(node.attr.integration, window.location.href);
            if (url.origin !== window.location.origin) throw new Error('Module integration must be same-origin');
            if (!hosts.has(url.href)) {
                const integration = await load(url.href);
                if (disposed || page.state === 'disposed') return;
                hosts.set(url.href, integration.installDeviceFrameHost(page, {origins:[window.location.origin]}));
            }
            const key = `module_${node.label}`;
            if (navigation.getNode(key)) throw new Error('Module navigation identity collision');
            navigation.setItem(key, node.value.deepcopy(), {title:node.attr.title});
            mounted.push(key);
        }
    } catch (error) {
        dispose();
        throw error;
    }
}
