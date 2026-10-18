/** Responsive presentation only: the index continues to own pages and iframe lifetimes. */
export function mountGalleryMobile(renderer, root, inspector, state, onExampleVisibility = () => {}) {
    const shell = renderer.records.get(root).element;
    const document = shell.ownerDocument;
    const window = document.defaultView;
    const narrow = () => window.getComputedStyle(shell).getPropertyValue('--gallery-narrow').trim() === '1';
    state.setItem('view', 'example');
    state.setItem('menu', false);
    const byId = id => document.getElementById(id);
    const set = (element, attrs) => renderer.elements.get(element).node.setAttr(attrs);
    const main = shell.querySelector('.index-main');
    const regions = byId('gallery-regions');
    const center = byId('gallery-center');
    const sidebar = byId('index-sidebar');
    const code = byId('index-code');
    const panel = byId('gallery-inspector-panel');
    const menu = byId('gallery-mobile-menu');
    const backdrop = byId('gallery-mobile-backdrop');
    const views = shell.querySelector('.gallery-mobile-views');
    const footer = shell.querySelector('.index-footer');
    const buttons = new Map(['example', 'code', 'inspector'].map(view => [view, byId(`gallery-view-${view}`)]));
    const listeners = [];
    let entries = new Map(), active = null, mobile = false, disposed = false;
    const listen = (element, type, fn) => {
        element.addEventListener(type, fn);
        listeners.push(() => element.removeEventListener(type, fn));
    };
    const apply = () => {
        if (!mobile) return;
        const view = state.getItem('view');
        const expanded = state.getItem('menu');
        onExampleVisibility(view === 'example' && !expanded);
        set(shell, {data_mobile_view: view});
        set(main, {hidden: view !== 'example', inert: expanded, tabindex: -1});
        set(center, {hidden: expanded || view !== 'example'});
        set(regions, {hidden: !expanded && view === 'inspector'});
        set(code, {hidden: expanded || view !== 'code', inert: expanded, width: '100%', drawer: false});
        set(panel, {hidden: view !== 'inspector', inert: expanded});
        set(sidebar, {hidden: !expanded, width: '100%', drawer: false});
        set(backdrop, {hidden: true});
        set(menu, {aria_expanded: String(expanded)});
        set(views, {inert: expanded});
        set(footer, {inert: expanded});
        for (const [name, button] of buttons) {
            set(button, {aria_pressed: String(name === view), disabled: name === 'code' && !entries.get(active)?.code});
        }
        // Desktop keyboard navigation is opt-in; the mobile drawer is always keyboard accessible.
        for (const item of sidebar.querySelectorAll('a, summary')) set(item, {tabindex: 0});
        inspector.setPresentation(true, view === 'inspector');
    };
    const closeMenu = (focus = true) => {
        state.setItem('menu', false); apply();
        if (focus) menu.focus();
    };
    listen(menu, 'click', () => {
        const expanded = !state.getItem('menu');
        state.setItem('menu', expanded); apply();
        if (expanded) sidebar.querySelector('a[aria-current="page"], a').focus();
    });
    listen(backdrop, 'click', () => closeMenu());
    listen(sidebar, 'click', event => {
        // Re-selecting the already active page must close the drawer too.
        if (mobile && state.getItem('menu') && event.target.closest('a') && !event.target.closest('summary')) {
            closeMenu(false); main.focus();
        }
    });
    listen(document, 'keydown', event => {
        if (!mobile || !state.getItem('menu')) return;
        if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
        if (event.key !== 'Tab') return;
        const targets = [menu, ...sidebar.querySelectorAll('summary, a')].filter(item => item.getClientRects().length);
        const first = targets[0], last = targets.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    for (const [view, button] of buttons) listen(button, 'click', () => {
        state.setItem('view', view); apply();
    });
    const resize = () => {
        if (mobile === narrow()) return;
        mobile = narrow();
        state.setItem('menu', false);
        if (mobile) {
            state.setItem('desktopSidebarWidth', renderer.elements.get(sidebar).node.getAttr('width'));
            state.setItem('desktopCodeWidth', renderer.elements.get(code).node.getAttr('width'));
            apply(); return;
        }
        set(shell, {data_mobile_view: null});
        set(main, {hidden: false, inert: false});
        set(center, {hidden: false}); set(regions, {hidden: false});
        set(code, {hidden: !entries.get(active)?.code, inert: false, width: state.getItem('desktopCodeWidth'), drawer: state.getItem('codeVisible') ? true : 'close'});
        set(sidebar, {hidden: false, width: state.getItem('desktopSidebarWidth'), drawer: state.getItem('navigationVisible') ? true : 'close'});
        set(panel, {hidden: false, inert: false});
        set(backdrop, {hidden: true});
        set(views, {inert: false}); set(footer, {inert: false});
        const keyboard = state.getItem('keyboard');
        for (const item of sidebar.querySelectorAll('a, summary')) set(item, {tabindex: keyboard ? 0 : -1});
        inspector.setPresentation(false, false);
    };
    listen(window, 'resize', resize);
    const update = (nextEntries, nextActive) => {
        const changed = active !== nextActive;
        entries = nextEntries; active = nextActive;
        const menuWasOpen = state.getItem('menu');
        const familySelected = entries.get(active)?.panel.classList.contains('index-category');
        if (changed || !entries.get(active)?.code && state.getItem('view') === 'code') {
            state.setItem('view', 'example');
            if (!familySelected) state.setItem('menu', false);
        }
        // Index selection has just projected its desktop preferences; apply the mobile view afterwards.
        apply();
        if (mobile && changed && menuWasOpen && !familySelected) main.focus();
    };
    resize();
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        for (const remove of listeners) remove();
    };
    renderer.onDispose(root, dispose);
    return {update, dispose};
}
