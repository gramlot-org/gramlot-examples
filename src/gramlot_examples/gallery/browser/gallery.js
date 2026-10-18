import {mountGuidedDemo} from './gallery-guide.js';
import {mountGalleryMobile} from './gallery-mobile.js';
import {mountGallerySettings} from './gallery-settings.js';
import {mountIndexPage} from '@gramlot/gramlot/index-page-runtime';
import {mountGalleryContent} from './gallery-content.js';
import {renderReadme} from './markdown.js';

/** Gallery-only teaching tools and rendering services around shared containers. */
export function mountGallery(renderer, root, inspector) {
    const state = root.builder.data.getItem('galleryIndex');
    const settings = mountGallerySettings(renderer, root, state);
    let guide = null;
    const content = mountGalleryContent(renderer, root);
    const mobile = mountGalleryMobile(renderer, root, inspector, state, visible => { if (!visible) guide?.pause(); });
    const index = mountIndexPage(renderer, root, (entries, active) => {
        inspector.update(entries, active);
        mobile.update(entries, active);
        guide?.update(entries, active);
    }, (entry, {byId}) => {
        const {key} = entry;
        if (key === 'l04' && !guide) guide = mountGuidedDemo(renderer, root);
        if (entry.panel.classList.contains('index-category')) {
            renderReadme(byId(`readme-${key}`));
            return;
        }
        content.observe(entry.key);
    }, {containerLayout: true, state,
        async createEntry(entry) {
            const document = renderer.destination.ownerDocument;
            const node = id => renderer.elements.get(document.getElementById(id)).node;
            const source = id => root.builder.wrapSource(node(id));
            const category = entry.open.classList.contains('index-family');
            const pane = source('index-pages').contentPane({id: `panel-${entry.key}`,
                title: entry.open.textContent, pageName: entry.key, hidden: true,
                class: category ? 'index-category' : 'gallery-panel'});
            const code = category ? null : source('gallery-code-pages').div({id: `codepane-${entry.key}`,
                class: 'gallery-codepane', hidden: true, height: '100%'});
            if (code) code.tabContainer({id: `code-tabs-${entry.key}`, class: 'gallery-source-tabs',
                height: '100%', tabMode: 'underline'}).contentPane({title: 'Code'}).p('Loading code…', {role: 'status'});
            try {
                const runtime = renderer.binding.gramlot;
                const mounted = await runtime.src.remoteSource(node(`panel-${entry.key}`), 'lesson', {key: entry.key});
                if (!mounted) throw new Error('Lesson loading was cancelled');
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
    return {dispose() { guide?.dispose(); content.dispose(); settings.dispose(); index.dispose(); mobile.dispose(); }};
}
