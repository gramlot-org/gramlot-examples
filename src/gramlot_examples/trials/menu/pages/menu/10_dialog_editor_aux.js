/** Page-local editing behavior; all state is in Data and commands target the frame center. */
const fields = ['title', 'author', 'notes'];
function copyFields(node, from, to) {
    for (const field of fields) node.SET(`editor.${to}.${field}`, node.GET(`editor.${from}.${field}`));
}
export class Logic {
    openEditor(node) {
        copyFields(node, 'saved', 'draft');
        node.SET('editor.error', '');
        node.SET('editor.open', true);
    }
    save(node) {
        const title = node.GET('editor.draft.title').trim();
        if (!title) {
            node.SET('editor.error', 'Enter a title before saving. The dialog remains open.');
            return;
        }
        node.SET('editor.draft.title', title);
        copyFields(node, 'draft', 'saved');
        node.SET('editor.error', '');
        node.SET('editor.notice', `Saved “${title}” in page Data. Reopen to continue editing.`);
        node.SET('editor.open', false);
    }
    undo(node, message) {
        copyFields(node, 'saved', 'draft');
        node.SET('editor.error', '');
        node.SET('editor.notice', message.parameters.close ? 'Cancelled: the saved document is unchanged.' : 'Draft reset to the last saved values.');
        if (message.parameters.close) node.SET('editor.open', false);
    }
    toggleDetails(node) { node.SET('editor.details', !node.GET('editor.details')); }
    discardOnClose(node) {
        copyFields(node, 'saved', 'draft');
        node.SET('editor.error', '');
        node.SET('editor.notice', 'Cancelled: the saved document is unchanged.');
        return true;
    }
}
