import {Page as BasePage} from '@gramlot/gramlot/page';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = "FramePane, dialog and floating windows";
    static gramlots = [layout, mygramlot];

    main(root) {

        const main_content = root.main({padding: "20px", max_width: "900px", margin: "auto"});
        main_content.h1("FramePane, dialog and floating");
        main_content.p("All three windows contain a real framePane: a top toolbar, central editable content and a bottom action bar. The title bar belongs to the window and stays separate from the frame's toolbar.");
        main_content.h2("1. Dialog defaults");
        main_content.p("Open the basic dialog: the background is blocked. Its title has Close only; movement, resize and collapse are disabled by default. Escape closes it and focus returns to the opener.");
        main_content.button("Open basic dialog", {action: "openBasic", id: "open-basic"});
        main_content.h2("2. Movable modal dialog");
        main_content.p("This dialog enables move, resize, collapse and maximize. First move or resize it; then click □ to fill the viewport and ❐ to recover its previous position and size. Move and resize pause while maximized. Collapse keeps the page blocked and remembers maximize; ＋ expands it again. The internal checkbox can veto X, Escape and the footer Close action.");
        main_content.button("Open movable dialog", {action: "openModal", id: "open-modal"});
        main_content.h2("3. Floating window");
        main_content.p("The same chrome is nonmodal here. Move, resize and collapse are enabled by default. Maximize is explicitly enabled here too: □ fills the viewport and ❐ restores its geometry. Collapse a maximized floating window and edit the field below: the page remains usable. Expand with ＋ to return to maximized size. Title and resize handle also accept arrow keys (10 px; Shift gives 1 px).");
        main_content.button("Open floating window", {action: "openFloating", id: "open-floating"});
        main_content.input({value: "^windows.background", live: true, id: "background-field", width: "100%", margin: "12px 0", aria_label: "Background field"});
        main_content.p("^windows.notice", {id: "window-notice"});
        main_content.p("The draft and window geometry survive close/reopen during this page session. No document is saved to a server. Maximize retains the draft and normal geometry; reload persistence is outside this example.");
        this.contents(root.dialog({title: "Basic modal dialog", open: "^windows.basic", width: "440px", height: "310px", id: "basic-window"}), "basic");
        this.contents(root.dialog({title: "Movable modal dialog", open: "^windows.modal", collapsed: "^windows.collapsed", movable: true, resizable: true, collapsible: true, maximizable: true, maximized: "^windows.modal_maximized", beforeClose: "beforeClose", width: "440px", height: "360px", id: "modal-window"}), "modal");
        this.contents(root.floatingPane({title: "Floating tools", open: "^windows.floating", maximizable: true, maximized: "^windows.floating_maximized", beforeClose: "beforeClose", width: "360px", height: "340px", id: "floating-window"}), "floating");
    }

    contents(window, kind) {

        const frame = window.frame;
        const bar = frame.top.menu({presentation: "bar", iconSize: 22, padding: "4px"});
        bar.menuline("documenti:save", {parameters: {window: kind}});
        bar.menuline({caption: "Actions"}).menu().menuline("documenti:save", {parameters: {window: kind}});
        bar.spacer({flex: 1});
        bar.menuline({group: true}).span("Frame top", {font_size: "12px"});
        const content = frame.center.contentPane({frameTarget: true, selfsubscribe_save: "save", padding: "12px", overflow: "auto"});
        content.p("Frame center: this draft is shared Data.");
        content.input({value: "^windows.draft", live: true, width: "100%", aria_label: "Window draft"});
        if (kind !== "basic") {
            const row = content.div({margin: "12px 0"});
            row.input({type: "checkbox", value: "^windows.locked", id: (kind + "-locked")});
            row.html_label("Prevent closing", {for: (kind + "-locked")});
        }
        content.p("^windows.notice");
        const footer = frame.bottom.menu({presentation: "bar", padding: "4px"});
        footer.menuline({group: true}).span("Frame bottom", {font_size: "12px"});
        footer.spacer({flex: 1});
        footer.menuline({caption: "Close", action: "closeWindow"});
    }
}

export class Logic {
    openBasic(node) { node.SET('windows.basic', true); }
    openModal(node) { node.SET('windows.modal', true); }
    openFloating(node) { node.SET('windows.floating', true); }
    save(node, message) { node.SET('windows.notice', `Save received by the ${message.parameters.window} frame; draft retained locally.`); }
    beforeClose(node, {reason}) {
        const allowed = !node.GET('windows.locked');
        node.SET('windows.notice', allowed ? `Closing requested by ${reason}.` : 'Close refused: clear Prevent closing inside the window.');
        return allowed;
    }
    closeWindow(node) {
        let owner = node;
        while (!['dialog', 'floatingPane'].includes(owner.nodeTag)) owner = owner.parentNode;
        return owner.requestClose('application');
    }
}

