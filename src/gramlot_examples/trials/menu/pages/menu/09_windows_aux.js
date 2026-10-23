export class Logic {
    openBasic(node) { node.SET('windows.basic', true); }
    openModal(node) { node.SET('windows.modal', true); }
    openFloating(node) { node.SET('windows.floating', true); }
    save(node, message) { node.SET('windows.notice', `Save received by the ${message.parameters.window} frame; draft retained locally.`); }
    beforeClose(node, {reason}) {
        const allowed = !node.GET('windows.locked');
        node.SET('windows.notice', allowed ? `Closing requested by ${reason}.` : 'Close refused: clear Prevent closing inside the window.');
        return allowed;
    }
    closeWindow(node) {
        let owner = node;
        while (!['dialog', 'floatingPane'].includes(owner.nodeTag)) owner = owner.parentNode;
        return owner.requestClose('application');
    }
}
