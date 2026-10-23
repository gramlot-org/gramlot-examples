export class Logic {
    selectSection(node) {
        node.SET('navigation.selected', node.getAttr('parameters').section);
    }
    toggleDetails(node) {
        node.SET('navigation.details', !node.GET('navigation.details'));
    }
}
