import {Bag} from '@gramlot/gramlot';
import {Page as BasePage} from '@gramlot/gramlot/page';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = "Complete document workspace";
    static gramlots = [inputs, layout, mygramlot];

    main(root) {

        const main_content = root.main({padding: "20px", height: "620px"});
        main_content.h1("One menu, two presentations");
        main_content.p("Example: edit the document, use the visible menu bar or open Document, and open Export to load a submenu.");
        const frame = main_content.framePane({node_label: "document", height: "480px"});
        const controls = frame.top.contentPane({node_label: "controls", padding: "8px", display: "flex", gap: "12px", flex_wrap: "wrap"});
        controls.numberTextBox({value: "^document.id", lbl: "Document ID", width: "9rem"});
        controls.checkbox({value: "^document.locked", lbl: "Disable Save", margin_right: "16px"});
        controls.checkbox({value: "^document.hide_export", lbl: "Hide Export", margin_right: "16px"});
        controls.checkbox({value: "^document.fail", lbl: "Resolver error"});
        this.document_menu(frame.top.menu({presentation: "bar"}).menuline({caption: "Document", id: "menu-actions"}).menu());
        const bar = frame.top.menu({presentation: "bar", orientation: "horizontal", node_label: "toolbar", id: "menu-toolbar"});
        this.document_menu(bar);
        bar.spacer({size: 12});
        bar.contentPane({node_label: "search"}).input({value: "^document.query", placeholder: "A normal embedded input", aria_label: "Search"});
        bar.spacer({flex: 1});
        const nested = bar.contentPane({node_label: "extra"}).menu({presentation: "bar", orientation: "vertical"});
        nested.menuline("documenti:save", {caption: "Save after confirmation", ask: "Save this document?", parameters: {id: "^document.id"}});
        nested.menuline("documenti:save", {caption: "Save after 1 second", _delay: 1000, parameters: {id: "^document.id"}});
        const editor = frame.center.contentPane({frameTarget: true, node_label: "editor", padding: "16px", selfsubscribe_save: "save", selfsubscribe_undo: "undo", selfsubscribe_toggleDetails: "toggleDetails", selfsubscribe_export: "exportDocument"});
        editor.h2("Document content");
        editor.textbox({value: "^document.title", lbl: "Title", width: "26rem"});
        editor.p("Details are visible", {hidden: "^document.details:=!{}", id: "menu-details"});
        editor.p("^document.result", {id: "menu-result", role: "status"});
        frame.bottom.menu({presentation: "bar"}).menuline("documenti:undo");
    }

    document_menu(menu) {
        menu.menuline("documenti:save", {disabled: "^document.locked", parameters: {id: "^document.id"}});
        menu.menuline("documenti:undo");
        menu.menuline("-");
        menu.menuline("documenti:toggleDetails", {checked: "^document.details"});
        menu.menuline({caption: "Export", node_label: "export", hidden: "^document.hide_export"}).menu({resolver: "export_menu", resolver_document_id: "^document.id", resolver_fail: "^document.fail", cacheTime: 30});
    }

    export_menu({document_id, fail = false}) {

        if (fail) {
            throw new Error("Trial resolver failure: turn off Resolver error, then retry");
        }
        const result = new Bag();
        for (const format of ["PDF", "CSV"]) {
            result.setItem(format.toLowerCase(), null, {kind: "command", command: "documenti:export", caption: `${format} — document ${document_id}`, parameters: {id: document_id, format: format}, disabled: "^document.locked"});
        }
        return result;
    }
}
Page.registerEndpoint("export_menu");

/** Business behavior only: Source messages and Data writes, no DOM/event plumbing. */
export class Logic {
    save(node,message){node.SET('document.result',`Save document ${message.parameters.id}; sender ${message.sender.label}; shift=${message.modifiers.shift}`);}
    undo(node){node.SET('document.title','Working document');node.SET('document.result','Undo received by the central content');}
    toggleDetails(node){const visible=!node.GET('document.details');node.SET('document.details',visible);node.SET('document.result',`Details ${visible ? 'shown' : 'hidden'}`);}
    exportDocument(node,message){node.SET('document.result',`Export ${message.parameters.format} for document ${message.parameters.id}`);}
}

