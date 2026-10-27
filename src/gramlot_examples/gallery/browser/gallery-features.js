import {Bag} from '@gramlot/gramlot';
import features from '../features.json' with {type:'json'};
import catalog from '../../catalog.json' with {type:'json'};

const entries = features.flatMap(group => group.features);
const states = new Set(['new', 'seen', 'tried']);

/** Data owns progress. Session storage only keeps its reload snapshot. */
export function mountFeatureProgress(renderer, root, state) {
    const window = renderer.destination.ownerDocument.defaultView;
    const storageKey = `gramlot.gallery.features:${window.location.pathname}`;
    let progress = state.getItem('featureProgress');
    if (progress === null) {
        progress = new Bag();
        state.setItem('featureProgress', progress);
    }
    state.setItem('featureStorageNotice', '');
    let saved = {};
    try {
        const text = window.sessionStorage.getItem(storageKey);
        if (text !== null) saved = JSON.parse(text);
    } catch (error) {
        if (!(error instanceof SyntaxError) && error.name !== 'SecurityError') throw error;
        state.setItem('featureStorageNotice', 'Previous progress could not be restored. Current progress remains in page Data.');
    }
    for (const feature of entries) {
        if (saved !== null && states.has(saved[feature.id])) progress.setItem(feature.id, saved[feature.id]);
    }
    const tree = new Bag();
    for (const group of features) {
        const children = new Bag();
        for (const feature of group.features) {
            children.setItem(feature.id, null, {caption:feature.label, feature:feature.id});
        }
        tree.setItem(group.id, children, {caption:group.title});
    }
    state.setItem('featureTree', tree);
    state.setItem('featureSelected', 'welcome');
    state.subscribe('gallery-feature-selection', {any:event => {
        if (event.node.label !== 'featureSelection') return;
        const path = state.getItem('featureSelection');
        state.setItem('featureSelected', path ? tree.getNode(path).attr.feature ?? 'welcome' : 'welcome');
    }});
    const summarize = () => {
        const counts = {new:0, seen:0, tried:0};
        for (const node of progress.getNodes()) if (states.has(node.value)) counts[node.value]++;
        for (const group of features) {
            let seen = 0, available = 0;
            for (const feature of group.features) {
                const value = progress.getItem(feature.id);
                const known = states.has(value);
                if (known) available++;
                if (value === 'seen' || value === 'tried') seen++;
                tree.getNode(`${group.id}.${feature.id}`).setAttr({
                    caption:feature.label + (value === 'tried' ? ' ✓' : ''),
                    labelClass:value === 'tried' ? 'feature-tried' : value === 'seen' ? 'feature-seen' : 'feature-new',
                });
            }
            tree.getNode(group.id).setAttr({
                caption:group.title + (available ? ` · ${seen}/${available}` : ''),
                labelClass:available > 0 && seen === available ? 'feature-seen' : 'feature-new',
            });
        }
        state.setItem('featureSummary', `${counts.new} to discover · ${counts.seen} seen · ${counts.tried} tried`);
    };
    const persist = () => {
        summarize();
        const snapshot = Object.fromEntries(progress.getNodes().map(node => [node.label, node.value]));
        try { window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot)); }
        catch (error) {
            if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error;
            state.setItem('featureStorageNotice', 'Progress is kept in page Data, but this browser cannot save it for reload.');
        }
    };
    progress.subscribe('gallery-feature-progress', {any:persist});
    summarize();
    const dispose = () => {
        progress.unsubscribe('gallery-feature-progress', {any:true});
        state.unsubscribe('gallery-feature-selection', {any:true});
    };
    renderer.onDispose(root, dispose);
    return {dispose};
}

/** Opening a lesson never claims that its behaviors were actually tried. */
export function markFeatureExampleSeen(state, key) {
    const progress = state.getItem('featureProgress');
    for (const feature of entries) {
        if (feature.examples.includes(key) && progress.getItem(feature.id) === 'new') {
            progress.setItem(feature.id, 'seen');
        }
    }
}

/** Reuse the navigation Bag and its resolvers, then select through IndexPage Data. */
export async function openFeatureExample(root, key) {
    const family = catalog.families.find(group => group.examples.some(item => item.key === key));
    if (!family) throw new Error(`Unknown example: ${key}`);
    const state = root.builder.data.getItem('galleryIndex');
    state.setItem('featureRequest', key);
    const example = family.examples.find(item => item.key === key);
    const directory = [family.folder, ...example.folder.split('/').slice(0, -1)].join('/');
    const branch = state.getItem('navigation').getNode(family.key);
    async function find(node, path) {
        if (node.attr.key === key) return path;
        if (!node.attr.category) return null;
        node.getValue(); // RemoteResolver returns the cached value and starts loading.
        if (node.resolver !== null) await node.resolver.loading;
        const children = node.staticValue;
        if (root.indexContext.disposed) return null;
        if (children === null) return null;
        for (const child of children.getNodes()) {
            if (child.attr.directory !== undefined &&
                directory !== child.attr.directory && !directory.startsWith(child.attr.directory + '/')) continue;
            const found = await find(child, `${path}.${child.label}`);
            if (found) return found;
        }
        return null;
    }
    const path = await find(branch, family.key);
    if (root.indexContext.disposed || state.getItem('featureRequest') !== key) return;
    if (!path) throw new Error(`Example is not available in navigation: ${key}`);
    state.setItem('featuresOpen', false);
    state.setItem('navigationSelection', path);
}
