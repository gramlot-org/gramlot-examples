/** Example business behavior: commands update Data through their Source recipient. */
export class Logic {
    save(node, message) {
        node.SET('document.result', `Received ${message.command} for document ${message.parameters.id}; sender ${message.sender.label}; target ${message.target.label}`);
    }
    undo(node) {
        node.SET('document.title', 'Working document');
        node.SET('document.result', 'Undo received by the central content');
    }
    toggleDetails(node) {
        node.SET('document.details', !node.GET('document.details'));
    }
    exportDocument(node, message) {
        node.SET('document.result', `Export ${message.parameters.format} for document ${message.parameters.id}`);
    }
}
