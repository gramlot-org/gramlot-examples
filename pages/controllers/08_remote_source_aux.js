/** Companion of 08_remote_source.py and 08_remote_source.js. */
export class Logic {
    /** The button's controller: ask the server for the Source method `details` of this Page. */
    load(node, kwargs) {
        const target = this.page.source.getNodeByAttr('node_id', 'details');
        return this.page.remoteSource(target, 'details', {topic: kwargs.topic});
    }
}
