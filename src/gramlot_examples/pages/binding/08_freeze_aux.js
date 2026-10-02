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
