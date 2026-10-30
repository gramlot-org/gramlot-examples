import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Toolbar: groups, priority and overflow";

    main(root) {

        const main_content = root.main({padding: "24px", max_width: "1200px", margin: "auto"});
        main_content.h1("Toolbar: groups, priority and overflow");
        main_content.p("This is still a menu. Its menuline entries become toolbar slots: commands, groups and a search input share the same row. The first level fills the frame; submenus and overflow open as compact menus.");
        this.button_styles(main_content);
        this.priority_overflow(main_content);
        this.moving_input(main_content);
        this.retained_groups(main_content);
        this.vertical_overflow(main_content);

    }

    button_styles(main_content) {
        main_content.h2("Three toolbar button styles");
        main_content.p("The same commands appear below with labels beside the icon, small labels below, or icons only. Hover a button for its tooltip. All use larger 28 px toolbar icons and a subtle hover background. In the overflow menu every entry returns to an icon with its label beside it.");
        const previews = main_content.div({display: "grid", grid_template_columns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "14px", margin_bottom: "24px"});
        for (const [mode, title] of [["beside", "Icon + label"], ["below", "Small label below"], ["tooltip", "Icon + tooltip"]]) {
            const card = previews.div({border: "1px solid var(--gramlot-border)", border_radius: "8px", padding: "12px", min_width: "0"});
            card.h3(title, {margin: "0 0 12px"});
            const preview_frame = card.framePane({height: "140px"});
            const preview_bar = preview_frame.top.menu({presentation: "bar", labelPosition: mode, iconSize: 28, id: `style-${mode}`});
            preview_bar.menuline("documenti:save", {parameters: {id: 42}, disabled: "^document.locked", id: `style-${mode}-save`});
            preview_bar.menuline("documenti:undo");
            preview_bar.menuline("documenti:toggleDetails", {checked: "^document.details"});
            this.recipient(preview_frame, `style_${mode}_editor`);
        }
        main_content.p("These are presentation settings only. Command labels, checked/disabled state and recipients are preserved. A group or individual menuline can override labelPosition and iconSize.");
    }

    priority_overflow(main_content) {
        main_content.h2("1. Make the toolbar narrower");
        main_content.p("Move the width slider. Flexible space shrinks first. Export and Copy (priority 10) move together into the overflow menu before Details (40) and Save/Undo (80). At equal priority the last group leaves first. Documents and Search always remain in the toolbar.");
        this.width_controls(main_content);
        const shell = main_content.div({width: "^toolbar.width:={} + 'px'", max_width: "100%", border: "1px solid var(--gramlot-border)", border_radius: "8px", overflow: "hidden", id: "responsive-frame"});
        const frame = shell.framePane({height: "245px"});
        frame.top.setAttr({background: "var(--gramlot-field-background)", padding: "6px"});
        this.priority_bar(frame);
        this.recipient(frame, "document_editor");
        main_content.p("Type in Search, resize, open the overflow menu, then choose a command. The query below stays bound to the same Data value. Save follows the checkbox; Details remains checked in both presentations. No server save or search is performed.");
        main_content.div().strong("Query: ");
        main_content.p("^document.query", {id: "query-result", min_height: "22px", margin: "0 0 20px"});
    }

    width_controls(main_content) {
        const controls = main_content.div({display: "flex", align_items: "center", gap: "12px", flex_wrap: "wrap", margin: "12px 0"});
        controls.html_label("Toolbar width", {for: "toolbar-width"});
        controls.input({type: "range", min: 280, max: 1080, step: 20, value: "^toolbar.width", live: true, id: "toolbar-width", aria_label: "Toolbar width", width: "280px"});
        controls.span("^toolbar.width", {min_width: "40px"});
        controls.span("px");
        controls.input({type: "checkbox", value: "^document.locked", id: "toolbar-lock", aria_label: "Disable Save"});
        controls.html_label("Disable Save", {for: "toolbar-lock"});
    }

    priority_bar(frame) {
        const bar = frame.top.menu({presentation: "bar", id: "responsive-toolbar"});
        const title = bar.menuline({group: true, overflowable: false, id: "title-group"});
        title.span("Documents", {font_weight: "600", padding: "0 8px"});
        title.span("42", {opacity: "0.65"});
        bar.spacer({size: 12});
        const editing = bar.menuline({group: true, priority: 80, id: "editing-group"});
        editing.menuline("documenti:save", {labelPosition: "tooltip", tooltip: "Save document", parameters: {id: 42}, disabled: "^document.locked", id: "toolbar-save"});
        editing.menuline("documenti:undo", {labelPosition: "tooltip", tooltip: "Undo", id: "toolbar-undo"});
        bar.menuline("documenti:toggleDetails", {priority: 40, checked: "^document.details", id: "toolbar-details"});
        this.export_group(bar, "export-group", 10);
        bar.spacer({flex: 1});
        const search = bar.menuline({group: true, overflowable: false, id: "search-group"});
        search.span("⌕", {font_size: "22px", aria_hidden: true});
        search.input({value: "^document.query", live: true, placeholder: "Search documents", aria_label: "Search documents", width: "190px", id: "toolbar-search"});
    }

    moving_input(main_content) {
        main_content.h2("2. An input can move into the menu too");
        main_content.p("Here the search group is allowed to overflow at priority 0. Use the same width slider. Enter text, then narrow the bar: open the overflow menu and continue editing the same input. Its value and binding are preserved; the Search label and input always move together.");
        const second_shell = main_content.div({width: "^toolbar.width:={} + 'px'", max_width: "100%", border: "1px solid var(--gramlot-border)", border_radius: "8px", padding: "6px", box_sizing: "border-box"});
        const second_frame = second_shell.framePane({height: "150px"});
        const second = second_frame.top.menu({presentation: "bar", id: "input-toolbar"});
        const fixed = second.menuline({group: true, overflowable: false});
        fixed.span("Recent documents", {font_weight: "600", padding: "0 8px", white_space: "nowrap"});
        fixed.menuline("documenti:save", {parameters: {id: 42}});
        second.spacer({flex: 1});
        const moving = second.menuline({group: true, priority: 0, id: "moving-search-group"});
        moving.span("Search", {white_space: "nowrap"});
        moving.input({value: "^document.query", live: true, placeholder: "Same query", aria_label: "Movable search", width: "220px", id: "moving-search"});
        this.recipient(second_frame, "secondary_editor");
    }

    retained_groups(main_content) {
        main_content.h2("3. Retained groups scroll without breaking");
        main_content.p("Every group in this narrow bar is retained. Scroll horizontally to reach the final search field: groups do not split, wrap or disappear into the overflow menu. This is the fallback when retained content alone cannot fit.");
        const scroll_shell = main_content.div({width: "400px", max_width: "100%", border: "1px solid var(--gramlot-border)", border_radius: "8px", padding: "6px", box_sizing: "border-box"});
        const scroll_frame = scroll_shell.framePane({height: "130px"});
        const retained = scroll_frame.top.menu({presentation: "bar", id: "scroll-toolbar"});
        for (const [index, caption] of ["Inbox", "Archive", "Shared documents"].entries()) {
            const group = retained.menuline({group: true, overflowable: false});
            group.menuline("documenti:save", {caption: caption, parameters: {id: index}, white_space: "nowrap"});
            group.menuline("documenti:undo", {labelPosition: "tooltip", tooltip: "Undo"});
        }
        retained.menuline({group: true, overflowable: false}).input({value: "^document.query", live: true, placeholder: "Search", aria_label: "Retained search", width: "190px"});
        this.recipient(scroll_frame, "retained_editor");
    }

    vertical_overflow(main_content) {
        main_content.h2("4. The same policy on a vertical toolbar");
        main_content.p("Move the height slider. Groups leave from the bottom at equal priority; the overflow button opens their menu beside the bar. The retained heading stays in the toolbar.");
        main_content.input({type: "range", min: 80, max: 300, step: 20, value: "^toolbar.height", live: true, aria_label: "Vertical toolbar height", id: "toolbar-height", width: "260px"});
        const vertical_frame = main_content.framePane({height: "330px", border: "1px solid var(--gramlot-border)", border_radius: "8px", margin_top: "10px"});
        vertical_frame.left.setAttr({width: "190px", padding: "6px"});
        const vertical = vertical_frame.left.menu({presentation: "bar", orientation: "vertical", height: "^toolbar.height:={} + 'px'", width: "178px", id: "vertical-toolbar"});
        vertical.menuline({group: true, overflowable: false}).strong("Folders", {padding: "8px"});
        for (const [index, caption] of ["Inbox", "Archive", "Shared"].entries()) {
            const group = vertical.menuline({group: true, priority: 0, id: `folder-group-${index}`});
            group.menuline("documenti:save", {caption: caption, parameters: {id: index}});
            group.menuline("documenti:undo", {caption: "Undo"});
        }
        this.recipient(vertical_frame, "vertical_editor");
        main_content.p("User customization and sessionStorage preferences are deferred until this first version has been tried.");
    }

    export_group(bar, identity, priority) {

        const group = bar.menuline({group: true, priority: priority, id: identity});
        group.menuline("documenti:save", {caption: "Copy", icon: "⧉", parameters: {id: 42}});
        const exportMenu = group.menuline({caption: "Export", icon: "↓"}).menu();
        exportMenu.menuline("documenti:export", {caption: "PDF", parameters: {id: 42, format: "PDF"}});
        exportMenu.menuline("-");
        exportMenu.menuline("documenti:export", {caption: "CSV", parameters: {id: 42, format: "CSV"}});
    }

    recipient(frame, name) {

        const center = frame.center.contentPane({frameTarget: true, node_label: name, selfsubscribe_save: "save", selfsubscribe_undo: "undo", selfsubscribe_toggleDetails: "toggleDetails", selfsubscribe_export: "exportDocument", padding: "16px"});
        center.p("^document.result", {role: "status", margin: "0 0 8px"});
        center.p("Document details are visible", {hidden: "^document.details:=!{}", margin: "0", opacity: "0.7"});
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

