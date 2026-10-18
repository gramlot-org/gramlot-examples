import {highlightCode, logicSource} from './code-highlight.js';
import {renderReadme} from './markdown.js';

// A rebuilt gallery can observe the same Source while its request is pending.
const pending = new WeakMap();

/** Load teaching content when its actual panel is visible, retaining it in Source. */
export function mountGalleryContent(renderer, root) {
    const document = renderer.destination.ownerDocument;
    const byId = id => document.getElementById(id);
    const node = element => renderer.elements.get(element).node;
    const entries = new Map();
    let disposed = false;

    function format({key, view}) {
        if (view === 'description') {
            const readme = byId(`readme-${key}`);
            readme.textContent = node(readme).value;
            renderReadme(readme);
            return;
        }
        const code = byId(`code-${key}`);
        code.textContent = node(code).value;
        highlightCode(code);
        const logic = byId(`logic-${key}`);
        if (logic) {
            const source = logicSource(node(logic).value);
            node(byId(`logic-panel-${key}`)).setAttr({hidden: source === null});
            logic.textContent = source ?? '';
            if (source !== null) highlightCode(logic);
        }
    }

    async function load(entry) {
        if (entry.loading) return;
        entry.loading = true;
        const targetId = entry.view === 'code' ? `code-tabs-${entry.key}` : entry.element.id;
        const target = node(byId(targetId));
        const current = () => {
            const element = byId(targetId);
            return element && renderer.elements.get(element)?.node === target ? element : null;
        };
        let request = pending.get(target);
        if (!request) {
            request = renderer.binding.gramlot.src.remoteSource(target, 'lesson', {key: entry.key, view: entry.view});
            pending.set(target, request);
        }
        try {
            const mounted = await request;
            if (disposed || !current() || !mounted) return;
            format(entry);
            observer.unobserve(entry.element);
            entries.delete(entry.element);
        } catch {
            if (disposed || !current()) return;
            const status = current().querySelector('[role="status"]');
            node(status).setValue('Could not load this content. Close and reopen the panel to retry.');
        } finally {
            if (pending.get(target) === request) pending.delete(target);
            entry.loading = false;
        }
    }

    const observer = new document.defaultView.IntersectionObserver(records => {
        for (const record of records) {
            const entry = entries.get(record.target);
            if (!entry) continue;
            const visible = record.isIntersecting && record.intersectionRect.width > 0 && record.intersectionRect.height > 0;
            if (visible && !entry.visible) void load(entry);
            entry.visible = visible;
        }
    });

    const dispose = () => { disposed = true; observer.disconnect(); entries.clear(); };
    renderer.onDispose(root, dispose);
    return {
        observe(key) {
            for (const [view, id, loaded] of [
                ['code', `codepane-${key}`, `code-${key}`],
                ['description', `description-${key}`, `readme-${key}`],
            ]) {
                const element = byId(id);
                const entry = {key, view, element, visible: false, loading: false};
                if (byId(loaded)) format(entry);
                else if (!entries.has(element)) {
                    entries.set(element, entry);
                    observer.observe(element);
                }
            }
        },
        dispose,
    };
}
