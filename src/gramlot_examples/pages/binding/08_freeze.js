import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Freeze';
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'board'});
        pane.h1('Freeze');
        const actions = pane.div({class: 'actions'});
        for (const [label, method] of [['Freeze', 'freeze'], ['Add one', 'add'],
            ['Remove last item', 'removeLast'], ['Thaw', 'thaw']]) {
            actions.button(label, {id: method}).dataController({func: method});
        }
        pane.p('^.frozen', {id: 'frozen', class: 'muted'});

        const board = pane.section({node_id: 'board', class: 'card stack'});
        board.h2('A branch that can be frozen');
        board.p('^.count', {id: 'count'});
        const items = board.ul({node_id: 'items', id: 'items'});
        for (const number of [1, 2, 3]) items.li(`Item ${number}`);

        pane.dataSetter({destination_path: '.count', value: 0});
        pane.dataSetter({destination_path: '.frozen', value: false});
    }
}

/** Logic of 08_freeze.py and 08_freeze.js: each button's nested controller calls one method. */
export class Logic {
    sourceNode(nodeId) {
        return this.page.source.getNodeByAttr('node_id', nodeId);
    }

    freeze(node) {
        this.page.renderer.freeze(this.sourceNode('board'));
        node.SET('.frozen', true);
    }

    add(node) {
        node.SET('.count', node.GET('.count') + 1);
    }

    removeLast() {
        const items = this.sourceNode('items').value;
        const last = items.getNodes().at(-1);
        if (last) items.popNode(last.label);
    }

    thaw(node) {
        this.page.renderer.unfreeze(this.sourceNode('board'));
        node.SET('.frozen', false);
    }
}
