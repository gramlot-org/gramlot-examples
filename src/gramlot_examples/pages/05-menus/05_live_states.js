import {Page as BasePage} from '@gramlot/gramlot/page';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = "Reactive menu states";
    static gramlots = [inputs, layout, mygramlot];

    main(root) {

        const main_content = root.main({padding: "20px"});
        main_content.h1("One state, two presentations");
        main_content.p("Use the checkboxes to change both menus. Open Document for the popup, or use the permanent row. Details toggles the shared checkmark and paragraph; disabled Save cannot run.");
        const controls = main_content.div({display: "flex", gap: "20px", margin_bottom: "16px"});
        controls.checkbox({value: "^document.locked", lbl: "Disable Save"});
        controls.checkbox({value: "^document.hidden", lbl: "Hide Export"});
        controls.checkbox({value: "^document.details", lbl: "Show details"});
        const frame = main_content.framePane({height: "360px"});
        this.commands(frame.top.menu({presentation: "bar"}).menuline({caption: "Document", id: "states-actions"}).menu());
        this.commands(frame.top.menu({presentation: "bar", id: "states-toolbar"}));
        const center = frame.center.contentPane({frameTarget: true, node_label: "document_editor", padding: "16px", selfsubscribe_save: "save", selfsubscribe_toggleDetails: "toggleDetails", selfsubscribe_export: "exportDocument"});
        center.h2("The application owns the state");
        center.p("Details are visible", {hidden: "^document.details:=!{}", id: "states-details"});
        center.p("^document.result", {role: "status"});
    }

    commands(menu) {
        menu.menuline("documenti:save", {disabled: "^document.locked", parameters: {id: "^document.id"}});
        menu.menuline("documenti:toggleDetails", {checked: "^document.details"});
        menu.menuline("documenti:export", {hidden: "^document.hidden", parameters: {id: 42, format: "PDF"}});
    }
}

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

