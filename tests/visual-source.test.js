import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag} from '@gramlot/gramlot';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import tree from '@gramlot/gramlot/components/tree';
import uploads from '@gramlot/gramlot/components/uploads';
import {Page, Logic} from '../src/gramlot_examples/pages/07-tools/02-visual_source.js';

const rootPath = 'main.visual.layout.center.design.pageRoot';
const tick = () => new Promise(resolve => setTimeout(resolve, 30));
function fixture(t, dataRoot = 'pageData', seed = true) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {pretendToBeVisual:true});
    window.ResizeObserver = class {observe() {} unobserve() {} disconnect() {}};
    Object.defineProperty(window.document, 'fonts', {value:new window.EventTarget()});
    window.HTMLDialogElement.prototype.show = window.HTMLDialogElement.prototype.showModal = function () {this.open = true;};
    window.HTMLDialogElement.prototype.close = function () {this.open = false;};
    window.HTMLElement.prototype.showPopover = function () {};
    const collections = [inputs, layout, tree, uploads];
    const app = new Gramlot({document:window.document, transport:false, collections});
    app.src.logicRegistry.register(Logic, {group:null, resource:'visual-source-test'});
    const builder = new GramlotBuilder(null, {collections});
    const page = new Page();
    page.dataRoot = dataRoot;
    page.main(builder.root);
    app.src.startSource(builder.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const source = app.src.source;
    if (seed) {
        const page = app.src.builder.wrapSource(source.getNode(rootPath));
        page.h2('Your page');
        page.p('Example paragraph');
    }
    const node = source.getNode('main.visual');
    const call = (name, ...args) => {
        const {group, method} = app.src.logicRegistry.resolve(name, node);
        return method.call(group, node, ...args);
    };
    const drop = (tag, path = 'pageRoot') => call('dropNode', {
        item:source.getNode('main.visual.layout.center.design.' + path), path, dropValues:{'app/widget':{tag}}
    });
    return {app, source, node, window, call, drop};
}

test('gallery editor composes the shared component and edits its page-only Source', async t => {
    const f = fixture(t);
    await tick();
    assert.ok(f.window.document.getElementById('visual-source-tree'));
    f.drop('textbox');
    assert.equal(f.app.data.getItem('__editor.error'), '');
    assert.ok(f.source.getNode(rootPath).value.getNodes().some(node => node.nodeTag === 'textbox'));
    f.call('newPage');
    assert.equal(f.source.getNode(rootPath).value, null);
});
