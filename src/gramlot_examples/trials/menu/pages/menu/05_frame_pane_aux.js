/** The nearest frame supplies the recipient; handlers only write Data. */
export class Logic {
    receive(node, message) {
        const text = `${message.command} | sender: ${message.sender.label} | target: ${message.target.label} | id: ${message.parameters.id} | shift: ${message.modifiers.shift}`;
        node.SET(message.target.label === 'inner_editor' ? 'innerResult' : 'outerResult', text);
    }
}
