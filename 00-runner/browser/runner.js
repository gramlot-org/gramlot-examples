import {Bag} from '@jsr/genro__bag';
import {highlightCode} from './code-highlight.js';
import {renderReadme} from './markdown.js';
import {THEME_READY, THEME_SET, THEMES} from './theme-messages.js';

/** Provisional page behavior. IDs belong to the runner HTML, not to Gramlot. */
export function mountRunner(renderer, root) {
    const shell = renderer.records.get(root).element;
    const document = shell.ownerDocument;
    const window = document.defaultView;
    const byId = id => document.getElementById(id);
    const node = element => renderer.elements.get(element).node;
    const set = (element, attrs) => node(element).setAttr(attrs);
    const keyboard = byId('keyboard-navigation');
    const theme = byId('runner-theme');
    const state = new Bag();
    const opened = new Bag();
    state.setItem('opened', opened);
    state.setItem('keyboard', keyboard.checked);
    state.setItem('theme', theme.value);
    const entries = new Map();
    const releases = [];
    let drag = null;
    let disposed = false;
    const previousTheme = document.documentElement.getAttribute('data-theme');
    const listen = (element, type, handler) => {
        element.addEventListener(type, handler);
        releases.push(() => element.removeEventListener(type, handler));
    };
    const stopDrag = () => {
        if (!drag) return;
        const {handle, pointerId} = drag;
        drag = null;
        if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
    };
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        stopDrag();
        for (const release of releases.reverse()) release();
        if (previousTheme == null) document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', previousTheme);
    };
    const send = frame => frame.contentWindow.postMessage({type: THEME_SET, theme: state.getItem('theme')}, '*');
    const applyTheme = () => {
        document.documentElement.setAttribute('data-theme', state.getItem('theme'));
        for (const {frame} of entries.values()) if (frame) send(frame);
    };
    function select(key) {
        const entry = entries.get(key);
        if (!opened.getItem(key)) {
            opened.setItem(key, true);
            set(entry.tab, {hidden: false});
            if (entry.frame) set(entry.frame, {src: entry.open.getAttribute('href')});
        }
        for (const [current, item] of entries) {
            const active = current === key;
            set(item.tab, {aria_selected: String(active), tabindex: active && state.getItem('keyboard') ? 0 : -1});
            set(item.panel, {hidden: !active});
            if (item.open) set(item.open, {aria_current: active ? 'page' : null});
        }
        state.setItem('active', key);
    }
    function setRatio(entry, value) {
        const ratio = Math.max(20, Math.min(80, value));
        state.setItem(`ratio.${entry.key}`, ratio);
        set(entry.split, {style: `--split-position: ${ratio}%`});
        set(entry.handle, {aria_valuenow: ratio});
    }
    try {
        for (const tab of shell.querySelectorAll('.runner-tabs button')) {
            const key = tab.id.slice('tab-'.length);
            const entry = {key, tab, panel: byId(`panel-${key}`),
                open: key === 'intro' ? null : byId(`open-${key}`)};
            entries.set(key, entry);
            if (!tab.hidden) opened.setItem(key, true);
            if (tab.getAttribute('aria-selected') === 'true') state.setItem('active', key);
            listen(tab, 'click', () => select(key));
            if (entry.open) listen(entry.open, 'click', event => { event.preventDefault(); select(key); });
            listen(tab, 'keydown', event => {
                if (!state.getItem('keyboard') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                const keys = [...entries.keys()].filter(key => opened.getItem(key));
                const index = keys.indexOf(key);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1
                    : (index + (event.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
                event.preventDefault();
                select(keys[next]);
                entries.get(keys[next]).tab.focus();
            });
            if (key === 'intro') continue;
            renderReadme(byId(`readme-${key}`));
            if (key === 'html_svg') continue;
            entry.frame = byId(`frame-${key}`);
            entry.split = byId(`split-${key}`);
            entry.handle = byId(`divider-${key}`);
            state.setItem(`ratio.${key}`, Number(entry.handle.getAttribute('aria-valuenow')));
            highlightCode(byId(`code-${key}`));
            listen(entry.frame, 'load', () => send(entry.frame));
            listen(entry.handle, 'keydown', event => {
                const current = state.getItem(`ratio.${key}`);
                const value = event.key === 'ArrowLeft' ? current - 5 : event.key === 'ArrowRight' ? current + 5
                    : event.key === 'Home' ? 20 : event.key === 'End' ? 80 : null;
                if (value == null) return;
                event.preventDefault();
                setRatio(entry, value);
            });
            listen(entry.handle, 'pointerdown', event => {
                if (event.button !== 0) return;
                stopDrag();
                entry.handle.setPointerCapture(event.pointerId);
                drag = {entry, handle: entry.handle, pointerId: event.pointerId};
                event.preventDefault();
            });
            listen(entry.handle, 'lostpointercapture', () => {
                if (drag?.handle === entry.handle) stopDrag();
            });
        }
        listen(document, 'pointermove', event => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            const bounds = drag.entry.split.getBoundingClientRect();
            if (bounds.width > 0) setRatio(drag.entry, Math.round((event.clientX - bounds.left) * 100 / bounds.width));
        });
        for (const type of ['pointerup', 'pointercancel']) listen(document, type, event => {
            if (drag && event.pointerId === drag.pointerId) stopDrag();
        });
        listen(keyboard, 'change', () => {
            state.setItem('keyboard', keyboard.checked);
            set(keyboard, {checked: keyboard.checked});
            for (const [key, entry] of entries) {
                if (entry.open) set(entry.open, {tabindex: keyboard.checked ? 0 : -1});
                set(entry.tab, {tabindex: keyboard.checked && key === state.getItem('active') ? 0 : -1});
            }
        });
        listen(theme, 'change', () => {
            if (!THEMES.has(theme.value)) throw new Error('Runner theme must be light or dark');
            state.setItem('theme', theme.value);
            set(theme, {value: theme.value});
            for (const option of theme.options) set(option, {selected: option.value === theme.value});
            applyTheme();
        });
        listen(window, 'message', event => {
            if (event.data?.type !== THEME_READY) return;
            for (const {frame} of entries.values()) {
                if (frame && frame.contentWindow === event.source) { send(frame); break; }
            }
        });
        applyTheme();
        renderer.onDispose(root, dispose);
    } catch (error) {
        dispose();
        throw error;
    }
    return {dispose};
}
