import {Bag, NavigationResolver} from '@gramlot/gramlot';

const METHOD = 'navigation_section';

/** A directory resolver that asks the server only for the lessons of one filter. */
export class FilteredNavigationResolver extends NavigationResolver {
    constructor({gramlot, directory, filter, onError}) {
        super({gramlot, method: METHOD, directory, onError});
        this.params = {directory, filter};
    }
    prepareValue(bag) {
        if (!(bag instanceof Bag)) throw new TypeError('Directory navigation must return a Bag');
        for (const child of this.children) child.abort();
        this.children.clear();
        for (const node of bag.getNodes()) {
            if (node.attr.directory === undefined) continue;
            const resolver = new FilteredNavigationResolver({gramlot: this.gramlot, directory: node.attr.directory,
                filter: this.params.filter, onError: this.onError});
            this.children.add(resolver);
            bag.setResolver(node.label, resolver);
        }
        return bag;
    }
}

const registries = new WeakMap();

const reportError = (renderer, message) => {
    const status = renderer.destination.ownerDocument.getElementById('gallery-load-status');
    renderer.elements.get(status).node.setValue(message);
};

/** Give every directory node of `navigation` a resolver for `filter` (null lists every lesson). */
function installResolvers(renderer, navigation, filter) {
    const resolvers = [];
    for (const node of navigation.getNodes()) if (node.attr.directory !== undefined && node.resolver === null) {
        const resolver = new FilteredNavigationResolver({gramlot: renderer.binding.gramlot, directory: node.attr.directory, filter,
            onError: error => reportError(renderer, `Could not load directory: ${error.message}`)});
        navigation.setResolver(node.label, resolver);
        resolvers.push(resolver);
    }
    return resolvers;
}

/** Install directory resolvers during page build, before the tree first renders. */
export function initializeNavigation(renderer, root) {
    const state = root.builder.data.getItem('galleryIndex');
    state.setItem('navigationOpen', true);
    state.setItem('settingsOpen', false);
    const registry = {resolvers: installResolvers(renderer, state.getItem('navigation'), null), version: 0};
    registries.set(root, registry);
    renderer.onDispose(root, () => { for (const resolver of registry.resolvers) resolver.abort(); });
}

/**
 * The navigation menu: the selected filter lives in Data (`galleryIndex.filter`) and decides which
 * lessons the server lists. The first declared filter lists everything. The choice is kept per viewer.
 */
export function mountGalleryFilter(renderer, root, state) {
    const labels = (state.getItem('filters')?.getNodes() ?? []).map(node => node.attr.label);
    if (labels.length < 2) return {dispose() {}};
    const window = renderer.destination.ownerDocument.defaultView;
    const key = `gramlot.gallery.filter:${window.location.pathname}`;
    const registry = registries.get(root);
    let disposed = false;
    const apply = async label => {
        const version = ++registry.version;
        const filter = label === labels[0] ? null : label;
        let received;
        try { received = await renderer.binding.gramlot.rpc.call('data', METHOD, {directory: '', filter}); }
        catch (error) {
            if (!disposed && version === registry.version) reportError(renderer, `Could not apply the filter: ${error.message}`);
            return;
        }
        if (disposed || version !== registry.version) return;
        if (!(received instanceof Bag)) throw new TypeError('Directory navigation must return a Bag');
        const navigation = state.getItem('navigation');
        for (const resolver of registry.resolvers) resolver.abort();
        for (const node of navigation.getNodes()) navigation.popNode(node.label);
        for (const node of received.getNodes()) navigation.setItem(node.label, node.value, {...node.attr});
        registry.resolvers = installResolvers(renderer, navigation, filter);
    };
    let saved = null;
    try { saved = window.localStorage.getItem(key); }
    catch (error) { if (error.name !== 'SecurityError') throw error; }
    state.subscribe('gallery-filter', {any: event => {
        if (event.node !== state.getNode('filter')) return;
        const label = state.getItem('filter');
        try { window.localStorage.setItem(key, label); }
        catch (error) { if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error; }
        void apply(label);
    }});
    if (labels.includes(saved) && saved !== state.getItem('filter')) state.setItem('filter', saved);
    return {dispose() { disposed = true; state.unsubscribe('gallery-filter', {any: true}); }};
}
