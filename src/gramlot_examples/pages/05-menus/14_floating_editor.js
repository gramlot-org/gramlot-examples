import {Page as BasePage} from '@gramlot/gramlot/page';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';
function svg_icon(drawing) {

    const svg = (("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#7c899c\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" + drawing) + "</svg>");
    return ("data:image/svg+xml," + encodeURIComponent(svg));
}
const ICONS = {"save": svg_icon("<path d=\"M5 3h12l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z\"/><path d=\"M7 3v6h9V3M7 21v-8h10v8M13 5v2\"/>"), "reset": svg_icon("<path d=\"M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6\"/>"), "cancel": svg_icon("<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m8.5 8.5 7 7m0-7-7 7\"/>"), "details": svg_icon("<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M9 4v16m4-11h4m-4 6h4\"/>")};

export class Page extends BasePage {
    static title = "Complete floating editor";
    static gramlots = [layout, mygramlot];
    static css = ["/themes/gramlot-compact/theme.css"];

    main(root) {

        const main_content = root.main({padding: "20px", max_width: "900px", margin: "auto"});
        main_content.h1("A complete floating editor");
        main_content.p("Edit a document inside a nonmodal floating window containing a real framePane. The left icon bar and top toolbar control the same draft; the bottom bar keeps Cancel and Save at the right. Only Save updates the saved document shown below.");
        const steps = main_content.ol();
        steps.li("Open the editor and change the title or notes. Save copies the draft to the saved document and closes the floating window. This is local page Data, not a server or disk save.");
        steps.li("Open it again, make another change and choose Cancel: the saved document must stay unchanged. X and Escape also discard the current draft.");
        steps.li("Reset draft restores the last saved values without closing. Details toggles an extra field and its menu checkmark. Document opens a hierarchical menu using the same commands.");
        steps.li("Drag, resize, maximize and collapse the floating window. Its toolbars stay in their frame regions; the center scrolls when space is limited. The page remains usable: move or collapse the window and edit the Background note below. Compare with Complete dialog editor, which blocks its page.");
        main_content.button("Open floating editor", {action: "openEditor", id: "open-editor"});
        main_content.html_label("Background note", {for: "background-note", display: "block", margin_top: "var(--gramlot-space-3)"});
        main_content.input({value: "^editor.background", live: true, id: "background-note", width: "100%"});
        main_content.p("^editor.background", {role: "status", id: "background-result"});
        main_content.p("In Gallery Settings, combine Theme, Colors and Color mode. The same settings apply to the dialog example; changing them preserves the open editor and its draft.");
        const summary = main_content.section({margin_top: "20px", padding: "16px", border: "1px solid var(--gramlot-border-control)", border_radius: "8px"});
        summary.h2("Saved document");
        summary.h3("^editor.saved.title", {id: "saved-title"});
        summary.p("^editor.saved.author", {id: "saved-author"});
        summary.p("^editor.saved.notes", {id: "saved-notes", white_space: "pre-wrap"});
        main_content.p("^editor.notice", {role: "status", id: "editor-result"});
        const window = root.floatingPane({title: "Floating document editor", open: "^editor.open", beforeClose: "discardOnClose", movable: true, resizable: true, collapsible: true, collapsed: "^editor.collapsed", maximizable: true, maximized: "^editor.maximized", width: "620px", height: "380px", id: "editor-window"});
        const frame = window.frame;
        frame.left.setAttr({width:'44px', background:'var(--gramlot-surface-subtle)', border_right:'1px solid var(--gramlot-border)'});
        const tools = frame.left.menu({presentation:'bar', orientation:'vertical', labelPosition:'tooltip', iconSize:20});
        tools.menuline('documenti:toggleDetails', {caption:'Details', iconSrc:ICONS.details, checked:'^editor.details'});
        tools.menuline('documenti:undo', {caption:'Reset draft', iconSrc:ICONS.reset, parameters:{close:false}});
        tools.spacer({flex:1});
        tools.menuline('documenti:save', {iconSrc:ICONS.save});
        const toolbar = frame.top.menu({presentation: "bar", padding: "2px 6px", iconSize: 18, background: "var(--gramlot-surface-subtle)", border_bottom: "1px solid var(--gramlot-border-control)", id: "editor-toolbar"});
        toolbar.menuline("documenti:undo", {caption: "Reset draft", iconSrc: ICONS["reset"], parameters: {close: false}});
        toolbar.menuline("documenti:toggleDetails", {caption: "Details", iconSrc: ICONS["details"], checked: "^editor.details"});
        toolbar.spacer({flex: 1});
        const commands = toolbar.menuline({caption: "Document"}).menu();
        commands.menuline("documenti:undo", {caption: "Reset draft", iconSrc: ICONS["reset"], parameters: {close: false}});
        commands.menuline("documenti:toggleDetails", {caption: "Details", iconSrc: ICONS["details"], checked: "^editor.details"});
        const center = frame.center.contentPane({frameTarget: true, node_label: "document_editor", padding: "var(--gramlot-space-4)", overflow: "auto", selfsubscribe_save: "save", selfsubscribe_undo: "undo", selfsubscribe_toggleDetails: "toggleDetails"});
        center.p("Draft — changes are committed only by Save.", {margin_top: "0"});
        center.html_label("Title (required)", {for: "editor-title", display: "block", margin_bottom: "4px"});
        center.input({value: "^editor.draft.title", live: true, id: "editor-title", width: "100%", box_sizing: "border-box"});
        center.html_label("Notes", {for: "editor-notes", display: "block", margin_top: "var(--gramlot-space-3)", margin_bottom: "4px"});
        center.textarea({value: "^editor.draft.notes", live: true, rows: 4, id: "editor-notes", width: "100%", box_sizing: "border-box"});
        const details = center.div({hidden: "^editor.details:=!{}", margin_top: "var(--gramlot-space-3)"});
        details.html_label("Author", {for: "editor-author", display: "block", margin_bottom: "4px"});
        details.input({value: "^editor.draft.author", live: true, id: "editor-author", width: "100%", box_sizing: "border-box"});
        center.p("^editor.error", {role: "alert", id: "editor-error", color: "var(--gramlot-error, #b22)"});
        const footer = frame.bottom.menu({presentation: "bar", padding: "2px 8px", iconSize: 18, background: "var(--gramlot-surface-subtle)", border_top: "1px solid var(--gramlot-border-control)", id: "editor-footer"});
        footer.spacer({flex: 1});
        const actions = footer.menuline({group: true, overflowable: false});
        actions.menuline("documenti:undo", {caption: "Cancel", iconSrc: ICONS["cancel"], parameters: {close: true}, id: "editor-cancel"});
        actions.menuline("documenti:save", {caption: "Save", iconSrc: ICONS["save"], id: "editor-save"});
    }
}

/** Page-local editing behavior; all state is in Data and commands target the frame center. */
const fields = ['title', 'author', 'notes'];
function copyFields(node, from, to) {
    for (const field of fields) node.SET(`editor.${to}.${field}`, node.GET(`editor.${from}.${field}`));
}
export class Logic {
    openEditor(node) {
        copyFields(node, 'saved', 'draft');
        node.SET('editor.error', '');
        node.SET('editor.open', true);
    }
    save(node) {
        const title = node.GET('editor.draft.title').trim();
        if (!title) {
            node.SET('editor.error', 'Enter a title before saving. The floating window remains open.');
            return;
        }
        node.SET('editor.draft.title', title);
        copyFields(node, 'draft', 'saved');
        node.SET('editor.error', '');
        node.SET('editor.notice', `Saved “${title}” in page Data. Reopen to continue editing.`);
        node.SET('editor.open', false);
    }
    undo(node, message) {
        copyFields(node, 'saved', 'draft');
        node.SET('editor.error', '');
        node.SET('editor.notice', message.parameters.close ? 'Cancelled: the saved document is unchanged.' : 'Draft reset to the last saved values.');
        if (message.parameters.close) node.SET('editor.open', false);
    }
    toggleDetails(node) { node.SET('editor.details', !node.GET('editor.details')); }
    discardOnClose(node) {
        copyFields(node, 'saved', 'draft');
        node.SET('editor.error', '');
        node.SET('editor.notice', 'Cancelled: the saved document is unchanged.');
        return true;
    }
}

