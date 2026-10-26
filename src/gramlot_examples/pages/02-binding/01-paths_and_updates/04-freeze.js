import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Defer structural updates with freeze";

    main(root) {
        const pane = root.div({class: 'example-page stack', datapath: 'board'});
        pane.h1('Freeze');
        pane.p("Freeze the branch, increment the count and remove an item. The count updates immediately; item removal appears only after Thaw.");
        const actions = pane.div({class: 'actions'});
        for (const [label, method] of [['Freeze', 'freeze'], ['Increment Data count', 'add'],
            ['Remove last item', 'removeLast'], ['Thaw', 'thaw']]) {
            actions.button(label, {id: method}).dataController({func: method});
        }
        pane.p('^.frozen', {id: 'frozen', mask: 'Structural updates frozen: {}', class: 'muted'});

        const board = pane.section({nodeId: 'board', class: 'card stack'});
        board.h2('A branch that can be frozen');
        board.p('^.count', {id: 'count'});
        const items = board.ul({nodeId: 'items', id: 'items'});
        for (const number of [1, 2, 3]) items.li(`Item ${number}`);

    }
}

/** Logic of 04-freeze.py and 04-freeze.js: each button's nested controller calls one method. */
export class Logic {
    sourceNode(nodeId) {
        return this.page.src.builder.nodeById(nodeId);
    }

    freeze(node) {
        this.page.src.renderer.freeze(this.sourceNode('board'));
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
        this.page.src.renderer.unfreeze(this.sourceNode('board'));
        node.SET('.frozen', false);
    }
}
