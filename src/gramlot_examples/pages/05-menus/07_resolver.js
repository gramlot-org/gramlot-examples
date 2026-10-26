import {Bag} from '@gramlot/gramlot';
import {Page as BasePage} from '@gramlot/gramlot/page';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = "Resolver menus and nested Bags";
    static gramlots = [inputs, layout, mygramlot];

    main(root) {

        const main_content = root.main({padding: "20px"});
        main_content.h1("A submenu supplied by a resolver");
        main_content.p("Open Document → Export, or Export in the visible bar: the server supplies the submenu. Change Document ID and reopen it; ID 0 is empty. Enable Resolver error to try failure and retry. Disable exports and Details are live bindings.");
        const controls = main_content.div({display: "flex", flex_wrap: "wrap", gap: "16px"});
        controls.numberTextBox({value: "^document.id", lbl: "Document ID", width: "8rem"});
        controls.checkbox({value: "^document.locked", lbl: "Disable exports"});
        controls.checkbox({value: "^document.hidden", lbl: "Hide current document"});
        controls.checkbox({value: "^document.fail", lbl: "Resolver error"});
        const frame = main_content.framePane({height: "390px"});
        this.commands(frame.top.menu({presentation: "bar"}).menuline({caption: "Document"}).menu());
        this.commands(frame.top.menu({presentation: "bar", id: "resolver-toolbar"}));
        const center = frame.center.contentPane({frameTarget: true, node_label: "document_editor", padding: "16px", selfsubscribe_export: "exportDocument", selfsubscribe_toggleDetails: "toggleDetails"});
        center.h2("Resolver result and live state");
        center.p("^document.result", {role: "status", id: "resolver-result"});
        center.p("Details enabled", {hidden: "^document.details:=!{}"});
        center.p("Change Document ID and reopen Export. ID 0 returns an empty Bag. Resolver error enables the Retry state.");
    }

    commands(menu) {
        menu.menuline({caption: "Export"}).menu({resolver: "export_menu", resolver_document_id: "^document.id", resolver_fail: "^document.fail", cacheTime: 30});
    }

    export_menu({document_id, fail = false}) {

        if (fail) {
            throw new Error("Intentional lesson error: turn off Resolver error and reopen Export");
        }
        const result = new Bag();
        if (document_id === 0) {
            return result;
        }
        result.setItem("current", null, {kind: "command", command: "documenti:export", caption: `Current document ${document_id}`, parameters: {id: document_id, format: "PDF"}, disabled: "^document.locked", hidden: "^document.hidden"});
        result.setItem("details", null, {kind: "command", command: "documenti:toggleDetails", checked: "^document.details"});
        result.setItem("separator", null, {kind: "separator"});
        const formats = new Bag();
        for (const format of ["PDF", "CSV"]) {
            formats.setItem(format.toLowerCase(), null, {kind: "command", command: "documenti:export", caption: format, parameters: {id: document_id, format: format}, disabled: "^document.locked"});
        }
        result.setItem("formats", formats, {kind: "submenu", caption: "Other formats"});
        result.setItem("recent", null, {kind: "submenu", caption: "Recent documents", resolver: "recent_menu", resolver_document_id: document_id, cacheTime: 30});
        return result;
    }

    recent_menu({document_id}) {

        const result = new Bag();
        result.setItem("previous", null, {kind: "command", command: "documenti:export", caption: `Previous document ${(document_id - 1)}`, parameters: {id: (document_id - 1), format: "PDF"}});
        return result;
    }
}
Page.registerEndpoint("export_menu");
Page.registerEndpoint("recent_menu");

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

