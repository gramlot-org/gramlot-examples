import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Lifecycle';
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'lifecycle'});
        pane.h1('Lifecycle');
        pane.p('Follow initialization, building, starting and removal of one branch.');
        const actions = pane.div({class: 'actions'});
        for (const [label, method] of [['Freeze', 'freeze'], ['Thaw', 'thaw'],
            ['Inspect Source and DOM', 'inspect'], ['Remove branch', 'remove']]) {
            actions.button(label, {id: method, type: 'button'}).dataController({func: method});
        }
        for (const [label, key] of [['Hook trace', 'trace'], ['Data ticks', 'ticks'], ['Lookup', 'lookup']]) {
            pane.h2(label); pane.p(`^.${key}`, {id: key});
        }
        const observed = pane.section({node_id: 'observed', id: 'observed', class: 'card stack'});
        observed.h2('Observed branch');
        observed.p('^.ticks', {id: 'branch-ticks'});
        for (const [hook, stage] of [['_init', 'init'], ['_onBuilt', 'built'], ['_onStart', 'start']]) {
            observed.dataController({func: 'record', stage, [hook]: true});
        }
        observed.dataController({func: 'tick', _timing: 1, _onStart: true});
        pane.dataSetter({destination_path: '.trace', value: ''});
        pane.dataSetter({destination_path: '.ticks', value: 0});
        pane.dataSetter({destination_path: '.lookup', value: 'Press Inspect'});
    }
}

export class Logic {
    branch() { return this.page.src.source.getNodeByAttr('node_id', 'observed'); }
    record(node, {stage}) {
        const previous = node.GET('.trace');
        node.SET('.trace', previous ? `${previous} → ${stage}` : stage);
    }
    tick(node) { node.SET('.ticks', node.GET('.ticks') + 1); }
    freeze() { const branch = this.branch(); if (branch) this.page.src.renderer.freeze(branch); }
    thaw() { const branch = this.branch(); if (branch) this.page.src.renderer.unfreeze(branch); }
    inspect(node) {
        const branch = this.branch();
        if (!branch) { node.SET('.lookup', 'Source branch absent'); return; }
        const element = this.page.dom.getDomNode(branch);
        node.SET('.lookup', element && this.page.dom.getBaseSourceNode(element) === branch
            ? 'Source → DOM → same Source' : 'Source present; DOM absent');
    }
    remove() {
        const branch = this.branch();
        if (branch) branch.parentBag.popNode(branch.label);
    }
}
