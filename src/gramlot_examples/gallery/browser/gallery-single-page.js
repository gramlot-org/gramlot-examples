/** Single-page presentation reuses the ordinary lesson shell, Source and content loader. */
export function mountSinglePage(renderer, root, state, content) {
    const document = renderer.destination.ownerDocument;
    const element = id => document.getElementById(id);
    const node = id => renderer.elements.get(element(id)).node;
    const shell = node('gallery-single');
    const clear = () => {
        shell.requests.inflight?.cancel();
        if (element('preview-single')) content.reset('single');
        if (shell.value) for (const child of shell.value.getNodes()) shell.value.popNode(child.label);
        root.singlePanelRequest = null;
        state.setItem('singleUrl', null);
    };
    return {
        async ensure() {
            if (element('preview-single')) return;
            if (!root.singlePanelRequest) {
                root.singlePanelRequest = renderer.binding.gramlot.src.remoteSource(shell, 'single_panel');
            }
            const request = root.singlePanelRequest;
            try { await request; }
            finally { if (root.singlePanelRequest === request) root.singlePanelRequest = null; }
        },
        prepare(entry) {
            entry.panel = element('gallery-single');
            entry.frame = element('frame-single');
            entry.code = element('codepane-single');
        },
        update(entry) {
            if (state.getItem('singleUrl') === entry.url) return;
            content.reset('single');
            state.setItem('singleUrl', entry.url);
            const header = entry.panel.querySelector('header');
            renderer.elements.get(header.querySelector('h2')).node.setValue(entry.title);
            renderer.elements.get(header.querySelector('p')).node.setValue(entry.node.attr.description ?? '');
            node('frame-single').setAttr({src:entry.url, title:entry.title});
            const lesson = entry.node.attr.key != null && !entry.node.attr.category && entry.node.attr.module == null;
            node('description-single').setAttr({hidden:!lesson});
            node('codepane-single').setAttr({hidden:!lesson});
            node('gallery-guide').setAttr({hidden:entry.key !== 'l04'});
            if (lesson) content.observe(entry.key, 'single');
        },
        clear,
    };
}
