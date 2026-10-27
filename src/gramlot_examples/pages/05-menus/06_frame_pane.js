import {Page as BasePage} from '@gramlot/gramlot/page';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = "FramePane regions and command recipients";
    static gramlots = [layout, mygramlot];

    main(root) {

        const main_content = root.main({padding: "16px"});
        main_content.h1("FramePane: regions and a central recipient");
        main_content.p("The frame reuses borderContainer layout. Regions appear only when accessed; none creates a toolbar automatically.");
        const frame = main_content.framePane({height: "520px", node_label: "outer_frame"});
        this.region_tools(frame);
        const center = frame.center.contentPane({frameTarget: true, node_label: "outer_editor", padding: "12px", selfsubscribe_save: "receive", selfsubscribe_undo: "receive"});
        center.h2("CENTER — outer_editor");
        center.p("^outerResult", {role: "status", id: "frame-outer-result", overflow_wrap: "anywhere"});
        center.p("Commands from the outer bars reach this content. Try Shift+click.");
        this.nested_frame(center);

    }

    region_tools(frame) {
        frame.top.setAttr({height: "84px", background: "var(--gramlot-field-background)"});
        frame.left.setAttr({width: "200px", background: "var(--gramlot-field-background)"});
        frame.right.setAttr({width: "135px", background: "var(--gramlot-field-background)"});
        frame.bottom.setAttr({height: "42px", background: "var(--gramlot-field-background)"});
        frame.top.menu({presentation: "bar"}).menuline("documenti:save", {caption: "Top bar 1", node_label: "top_save", parameters: {id: 1}});
        frame.top.menu({presentation: "bar"}).menuline("documenti:undo", {caption: "Top bar 2", parameters: {id: 1}});
        frame.left.menu({presentation: "bar", orientation: "vertical"}).menuline("documenti:save", {caption: "Left A", parameters: {id: 1}});
        frame.left.menu({presentation: "bar", orientation: "vertical"}).menuline("documenti:undo", {caption: "Left B", parameters: {id: 1}});
        const info = frame.right.contentPane({padding: "8px"});
        info.p("RIGHT");
        info.p("Ordinary content. No automatic bar.");
        frame.bottom.menu({presentation: "bar"}).menuline("documenti:save", {caption: "Bottom", parameters: {id: 1}});
    }

    nested_frame(center) {
        const inner = center.framePane({height: "170px", node_label: "inner_frame"});
        inner.top.menu({presentation: "bar"}).menuline("documenti:save", {caption: "Inner Save", node_label: "inner_save", parameters: {id: 2}});
        const recipient = inner.center.contentPane({frameTarget: true, node_label: "inner_editor", padding: "8px", selfsubscribe_save: "receive"});
        recipient.h3("Nested frame — inner_editor");
        recipient.p("^innerResult", {role: "status", id: "frame-inner-result", overflow_wrap: "anywhere"});
    }

}

/** The nearest frame supplies the recipient; handlers only write Data. */
export class Logic {
    receive(node, message) {
        const text = `${message.command} | sender: ${message.sender.label} | target: ${message.target.label} | id: ${message.parameters.id} | shift: ${message.modifiers.shift}`;
        node.SET(message.target.label === 'inner_editor' ? 'innerResult' : 'outerResult', text);
    }
}

