/** Companion of 09_end_to_end.py and 09_end_to_end.js: the named logic of the story. */
export class Logic {
    sourceNode(nodeId) {
        return this.page.source.getNodeByAttr('node_id', nodeId);
    }

    /** Controller of the total: the circle turns red above 10. */
    paint(node, kwargs) {
        node.SET('.color', kwargs.total > 10 ? '#b13d48' : '#23745b');
    }

    /** The button's nested controller: one call per click, with its counter and modifiers. */
    press(node, kwargs) {
        node.SET('.presses', `Pressed ${kwargs.button_counter} times`);
        node.SET('.modifiers', kwargs.button_shift ? 'with Shift' : 'without modifiers');
    }

    loadExtras() {
        return this.page.remoteSource(this.sourceNode('extras'), 'extras');
    }

    freeze() {
        this.page.renderer.freeze(this.sourceNode('later'));
    }

    removeNote() {
        const notes = this.sourceNode('notes').value;
        const last = notes.getNodes().at(-1);
        if (last) notes.popNode(last.label);
    }

    thaw() {
        this.page.renderer.unfreeze(this.sourceNode('later'));
    }
}
