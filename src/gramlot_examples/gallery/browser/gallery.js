import {mountGuidedDemo} from './gallery-guide.js';
import {mountGalleryMobile} from './gallery-mobile.js';
import {mountGallerySettings} from './gallery-settings.js';
import {mountIndexPage} from '@gramlot/gramlot/index-page-runtime';
import {highlightCode, logicSource} from './code-highlight.js';
import {renderReadme} from './markdown.js';

/** Gallery-only teaching tools and rendering services around shared containers. */
export function mountGallery(renderer, root, inspector) {
    const state = root.builder.data.getItem('galleryIndex');
    const settings = mountGallerySettings(renderer, root, state);
    let guide = null;
    const mobile = mountGalleryMobile(renderer, root, inspector, state, visible => { if (!visible) guide?.pause(); });
    const index = mountIndexPage(renderer, root, (entries, active) => {
        inspector.update(entries, active);
        mobile.update(entries, active);
        guide?.update(entries, active);
    }, (entry, {byId, node, set, listen}) => {
        const {key} = entry;
        if (key === 'l04' && !guide) guide = mountGuidedDemo(renderer, root);
        renderReadme(byId(`readme-${key}`));
        if (entry.panel.classList.contains('index-category')) return;
        highlightCode(byId(`code-${key}`));
        const logic = byId(`logic-${key}`);
        if (logic) {
            const source = logicSource(node(logic).value);
            set(byId(`logic-panel-${key}`), {hidden: source === null});
            logic.textContent = source ?? '';
            if (source !== null) highlightCode(logic);
        }
    }, {containerLayout: true, state,
        async createEntry(entry) {
            const document = renderer.destination.ownerDocument;
            const node = id => renderer.elements.get(document.getElementById(id)).node;
            const source = id => root.builder.wrapSource(node(id));
            const category = entry.open.classList.contains('index-family');
            const pane = source('index-pages').contentPane({id: `panel-${entry.key}`,
                title: entry.open.textContent, pageName: entry.key, hidden: true,
                class: category ? 'index-category' : 'gallery-panel'});
            const code = category ? null : source('gallery-code-pages').tabContainer({id: `codepane-${entry.key}`,
                class: 'gallery-codepane gallery-source-tabs', hidden: true, height: '100%', tabMode: 'underline'});
            try {
                const runtime = renderer.binding.gramlot;
                const results = await Promise.all([
                    runtime.src.remoteSource(node(`panel-${entry.key}`), 'lesson', {key: entry.key}),
                    ...(code ? [runtime.src.remoteSource(node(`codepane-${entry.key}`), 'lesson', {key: entry.key, view: 'code'})] : []),
                ]);
                if (results.some(mounted => !mounted)) throw new Error('Lesson loading was cancelled');
            } catch (error) {
                for (const target of [pane, code]) if (target?.parentBag) target.parentBag.popNode(target.label);
                throw error;
            }
        },
        onLoad(key, status) {
            const element = renderer.destination.ownerDocument.getElementById('gallery-load-status');
            renderer.elements.get(element).node.setValue(status === 'loading' ? 'Loading lesson…'
                : status === 'error' ? 'Could not load this lesson. Select it again to retry.' : '');
        },
    });
    return {dispose() { guide?.dispose(); settings.dispose(); index.dispose(); mobile.dispose(); }};
}
