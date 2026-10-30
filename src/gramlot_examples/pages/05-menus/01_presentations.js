import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "One hierarchical menu, four presentations";

    main(root) {

        const main_content = root.main({padding: "20px"});
        main_content.h1("One hierarchical menu, four presentations");
        main_content.p("Each example below uses the same menu definition: Save, Details, Undo and Export → PDF / Other formats → CSV. Icons, separators and state belong to the menu in every presentation.");
        const controls = main_content.div({display: "flex", gap: "24px", flex_wrap: "wrap", margin_bottom: "14px"});
        controls.checkbox({value: "^document.locked", label: "Disable Save in every menu", lbl: "Shared disabled state"});
        controls.checkbox({value: "^document.details", label: "Details checked in every menu", lbl: "Shared checked state"});
        const cards = main_content.div({display: "grid", grid_template_columns: "repeat(auto-fit, minmax(min(100%, 33rem), 1fr))", gap: "18px"});
        this.example(cards, "popup", "1. Popup menu", "Click inside the document area to open the menu. Export opens to the side; Other formats adds a second submenu. Choosing a command closes the popup.");
        this.example(cards, "horizontal", "2. Horizontal menu bar", "The first level stays visible in a row. Click Export to open its submenu. Uncheck Disable Save above to enable Save here and in the other examples.");
        this.example(cards, "vertical", "3. Vertical menu bar", "The same first level stays visible in a column. Export opens beside the bar. Details has a live checkmark; Undo is disabled because this example has no undo history.");
        this.example(cards, "context", "4. Context menu", "Right-click inside the document area, or focus it and press Shift+F10. The same menu opens at the pointer. Escape closes it; selecting a command updates the result.");
        main_content.h2("Opening with modifiers");
        main_content.p("In this extra area only Shift+click opens the same menu. Ordinary click and Shift+Ctrl+click do not match. modifiers='*' means no modifier keys; modifiers='Shift' means exactly Shift.");
        const frame = main_content.framePane({height: "145px", border: "1px solid var(--gramlot-border-control)"});
        const area = this.document(frame, "modified");
        area.p("Shift+click here", {font_weight: "bold"});
        this.document_menu(area.menu({modifiers: "Shift"}));
    }

    example(parent, mode, title, explanation) {
        let menu;
        const card = parent.div({padding: "14px", border: "1px solid var(--gramlot-border-control)", border_radius: "8px"});
        card.h2(title, {margin_top: "0", font_size: "1.15rem"});
        card.p(explanation, {min_height: "4.5em"});
        const frame = card.framePane({height: "230px", background: "var(--gramlot-field-background)"});
        const area = this.document(frame, mode);
        if (mode === "horizontal") {
            menu = frame.top.menu({presentation: "bar", orientation: "horizontal", padding: "6px", id: "horizontal-menu"});
        } else {
            if (mode === "vertical") {
                frame.left.setAttr({width: "170px"});
                menu = frame.left.menu({presentation: "bar", orientation: "vertical", padding: "6px", width: "100%", id: "vertical-menu"});
            } else {
                if (mode === "popup") {
                    area.p("Click anywhere in this document", {font_weight: "bold"});
                    menu = area.menu({modifiers: "*", id: "popup-menu"});
                } else {
                    area.p("Right-click this document", {font_weight: "bold"});
                    menu = area.menu({id: "context-menu"});
                }
            }
        }
        this.document_menu(menu);
    }

    document(frame, name) {

        const area = frame.center.contentPane({frameTarget: true, node_label: (name + "_document"), id: (name + "-document"), tabindex: 0, padding: "14px", selfsubscribe_save: "save", selfsubscribe_toggleDetails: "toggleDetails", selfsubscribe_export: "exportDocument"});
        area.h3("Document 42", {margin_top: "0"});
        area.p("Details are visible", {hidden: "^document.details:=!{}"});
        area.p("^document.result", {role: "status", overflow_wrap: "anywhere"});
        return area;
    }

    document_menu(menu) {

        menu.menuline("documenti:save", {disabled: "^document.locked", parameters: {id: "^document.id"}});
        menu.menuline("documenti:toggleDetails", {checked: "^document.details"});
        menu.menuline("documenti:undo", {disabled: true});
        menu.menuline("-");
        const exportMenu = menu.menuline({caption: "Export", icon: "↓"}).menu();
        exportMenu.menuline("documenti:export", {caption: "PDF", parameters: {id: "^document.id", format: "PDF"}});
        exportMenu.menuline("-");
        const other = exportMenu.menuline({caption: "Other formats", icon: "▤"}).menu();
        other.menuline("documenti:export", {caption: "CSV", parameters: {id: "^document.id", format: "CSV"}});
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

