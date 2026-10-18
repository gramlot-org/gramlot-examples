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
    const guide = mountGuidedDemo(renderer, root);
    const mobile = mountGalleryMobile(renderer, root, inspector, state, visible => { if (!visible) guide.pause(); });
    const index = mountIndexPage(renderer, root, (entries, active) => {
        inspector.update(entries, active);
        mobile.update(entries, active);
        guide.update(entries, active);
    }, (entry, {byId, node, set, listen}) => {
        const {key} = entry;
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
    }, {containerLayout: true, state});
    return {dispose() { guide.dispose(); settings.dispose(); index.dispose(); mobile.dispose(); }};
}
