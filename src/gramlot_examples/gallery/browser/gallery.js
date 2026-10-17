import {mountGallerySettings} from './gallery-settings.js';
import {mountIndexPage} from '@gramlot/gramlot/index-page-runtime';
import {highlightCode, logicSource} from './code-highlight.js';
import {renderReadme} from './markdown.js';

/** Gallery-only Markdown, highlighting and source-file tabs. */
export function mountGallery(renderer, root, onSelection) {
    const settings = mountGallerySettings(renderer, root);
    const index = mountIndexPage(renderer, root, onSelection, (entry, {byId, node, set, listen}) => {
        const {key} = entry;
        renderReadme(byId(`readme-${key}`));
        if (entry.panel.classList.contains('index-category')) return;
            highlightCode(byId(`code-${key}`));
            const logic = byId(`logic-${key}`);
            if (logic) {
                const source = logicSource(node(logic).value);
                set(byId(`logic-tab-${key}`), {hidden: source === null});
                logic.textContent = source ?? '';
                if (source !== null) highlightCode(logic);
            }
            const sourceTabs = [...byId(`codepane-${key}`).querySelectorAll('[role="tab"]')].filter(tab => !tab.hidden);
            const selectSource = selected => {
                for (const item of sourceTabs) {
                    const active = item === selected;
                    set(item, {aria_selected: String(active), tabindex: active ? 0 : -1});
                    set(byId(item.getAttribute('aria-controls')), {hidden: !active});
                }
            };
            for (const [index, sourceTab] of sourceTabs.entries()) {
                listen(sourceTab, 'click', () => selectSource(sourceTab));
                listen(sourceTab, 'keydown', event => {
                    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                    const next = event.key === 'Home' ? 0 : event.key === 'End' ? sourceTabs.length - 1
                        : (index + (event.key === 'ArrowRight' ? 1 : -1) + sourceTabs.length) % sourceTabs.length;
                    event.preventDefault();
                    selectSource(sourceTabs[next]);
                    sourceTabs[next].focus();
                });
            }
    });
    return {dispose() { settings.dispose(); index.dispose(); }};
}
