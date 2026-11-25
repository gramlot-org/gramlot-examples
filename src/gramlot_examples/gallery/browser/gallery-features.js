import {Bag} from '@gramlot/gramlot';
import features from '../features.json' with {type:'json'};
import {GalleryState} from './gallery-state.js';

const entries = features.flatMap(group => group.features);
const states = new Set(['new', 'seen', 'tried']);

/** A new navigation Bag of the feature groups; once in Data it is read at its address. */
function featureTreeBag() {
    const tree = new Bag();
    for (const group of features) {
        const children = new Bag();
        for (const feature of group.features) {
            children.setItem(feature.id, null, {caption:feature.label, feature:feature.id});
        }
        tree.setItem(group.id, children, {caption:group.title});
    }
    return tree;
}

/** Data owns progress. Session storage only keeps its reload snapshot. */
export function mountFeatureProgress(renderer, root, state) {
    const window = renderer.destination.ownerDocument.defaultView;
    const storageKey = `gramlot.gallery.features:${window.location.pathname}`;
    // Progress and the feature tree are Data sub-Bags: they are read at their address on each use.
    const progress = () => state.getItem('featureProgress');
    if (progress() === null) state.setItem('featureProgress', new Bag());
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
        if (progress().getNode(feature.id) !== null && saved !== null && states.has(saved[feature.id])) progress().setItem(feature.id, saved[feature.id]);
    }
    state.setItem('featureTree', featureTreeBag());
    const featureTree = () => state.getItem('featureTree');
    state.setItem('featureSelected', 'welcome');
    const selection = state.watch('featureSelection', () => {
        const path = state.getItem('featureSelection');
        state.setItem('featureSelected', path ? featureTree().getNode(path).attr.feature ?? 'welcome' : 'welcome');
    });
    const summarize = () => {
        const counts = {new:0, seen:0, tried:0};
        const tree = featureTree();
        for (const node of progress().getNodes()) if (states.has(node.value)) counts[node.value]++;
        for (const group of features) {
            let seen = 0, available = 0;
            for (const feature of group.features) {
                const value = progress().getItem(feature.id);
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
        const snapshot = Object.fromEntries(progress().getNodes().map(node => [node.label, node.value]));
        try { window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot)); }
        catch (error) {
            if (!['SecurityError', 'QuotaExceededError'].includes(error.name)) throw error;
            state.setItem('featureStorageNotice', 'Progress is kept in page Data, but this browser cannot save it for reload.');
        }
    };
    const progressChange = state.watch('featureProgress', persist);
    summarize();
    const dispose = () => {
        progressChange.close();
        selection.close();
    };
    renderer.onDispose(root, dispose);
    return {dispose};
}

/** Opening a lesson never claims that its behaviors were actually tried. */
export function markFeatureExampleSeen(state, key) {
    for (const feature of entries) {
        const address = `featureProgress.${feature.id}`;
        if (feature.examples.includes(key) && state.getItem(address) === 'new') state.setItem(address, 'seen');
    }
}

/** Reuse the navigation Bag and its resolvers, then select through IndexPage Data. */
export async function openFeatureExample(root, key) {
    const state = new GalleryState(root.rootBuilder);
    const index = root._internal.indexContext;
    const example = state.getItem('featureExamples').getNode(key);
    if (example === null) throw new Error(`Example is not available in this gallery: ${key}`);
    state.setItem('featureRequest', key);
    const {url} = example.attr;
    // Families sit at the root or inside a group of groups.json; a group's directory is not a path.
    async function find(nodes, prefix) {
        for (const node of nodes) {
            const path = prefix ? `${prefix}.${node.label}` : node.label;
            if (node.attr.key === key) return path;
            if (!node.attr.category) continue;
            const group = String(node.attr.url).startsWith('groups/');
            if (!group && node.attr.directory !== undefined && !url.startsWith('pages/' + node.attr.directory + '/')) continue;
            node.getValue(); // RemoteResolver returns the cached value and starts loading.
            if (node.resolver !== null) await node.resolver.loading;
            if (index.disposed) return null;
            const children = node.staticValue;
            if (children === null) continue;
            const found = await find(children.getNodes(), path);
            if (found) return found;
        }
        return null;
    }
    const path = await find(state.getItem('navigation').getNodes(), '');
    if (index.disposed || state.getItem('featureRequest') !== key) return;
    if (!path) throw new Error(`Example is not available in navigation: ${key}`);
    state.setItem('featuresOpen', false);
    state.setItem('navigationSelection', path);
}
