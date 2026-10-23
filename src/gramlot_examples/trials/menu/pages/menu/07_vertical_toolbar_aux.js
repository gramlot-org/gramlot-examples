/** The selected navigation section is ordinary page Data. */
export class Logic {
    selectSection(node) {
        node.SET('navigation.selected', node.getAttr('parameters').section);
    }
}
