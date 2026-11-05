import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {

    main(root) {

        const main_content = root.main({padding: "20px", max_width: "900px", margin: "auto"});
        const choices = main_content.div({class:'grid'});
        for (const [title,caption,action,key] of [
            ['Default dialog','Open basic dialog','openBasic','open-basic'],
            ['Movable dialog','Open movable dialog','openModal','open-modal'],
            ['Floating window','Open floating window','openFloating','open-floating'],
        ]) {
            const block = choices.section({class:'card stack'});
            block.h2(title);
            block.button(caption, {action,id:key});
        }
        main_content.input({value: "^windows.background", live: true, id: "background-field", width: "100%", margin: "12px 0", lbl: "Background field"});
        main_content.p("^windows.notice", {id: "window-notice"});
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
        content.input({value: "^windows.draft", live: true, width: "100%", lbl: "Window draft"});
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

