import {Page as BasePage} from '@gramlot/gramlot/page';
import layout from '../../gallery/dist/layout/descriptor.js';
import inputs from '../../gallery/dist/inputs/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';
function icon(path) {
    return ("data:image/svg+xml," + encodeURIComponent((("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#7c899c\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"" + path) + "\"/></svg>")));
}

export class PreviewPage extends BasePage {
    static gramlots = [layout, inputs, mygramlot];
    static profile = "Compact";
    static density = "28px controls / 13px text";

    main(root) {

        const page = root.main({class: "example-page stack", max_width: "1000px", gap: "var(--gramlot-space-4)"});
        page.h1((this.constructor.profile + " · workspace"));
        page.p((this.constructor.density + ". Compare forms, menus, tables and windows."), {class: "muted"});
        const links = page.nav({display: "flex", gap: "var(--gramlot-space-3)", flex_wrap: "wrap", aria_label: "Compare appearance profiles"});
        for (const [caption, path] of [["Joanna · 32px", "11_joanna"], ["Compact · 28px", "12_compact"], ["Mimi · 24px", "13_mimi"]]) {
            links.a(caption, {href: ("/pages/05-menus/" + path), target: "_top"});
        }
        page.p("Profile links open a standalone preview. Gallery Settings let you combine theme, colors and light/dark independently. Save is local only.", {class: "muted"});
        page.a("Open gallery · Settings", {href: "/", target: "_top"});
        const frame = page.framePane({height: "360px", border: "1px solid var(--gramlot-border)", border_radius: "var(--gramlot-radius-lg)", overflow: "hidden"});
        const bar = frame.top.menu({presentation: "bar", iconSize: 18, padding: "2px 4px", background: "var(--gramlot-surface-subtle)", border_bottom: "1px solid var(--gramlot-border)", id: "theme-toolbar"});
        bar.menuline("documenti:save", {iconSrc: icon("M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8"), disabled: "^preview.locked"});
        bar.menuline("documenti:undo", {iconSrc: icon("M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6")});
        bar.spacer({flex: 1});
        const menu = bar.menuline({caption: "View"}).menu();
        menu.menuline("documenti:toggleDetails", {caption: "Details", checked: "^preview.details"});
        menu.menuline("-");
        menu.menuline("documenti:save", {disabled: "^preview.locked", iconSrc: icon("M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8")});
        const center = frame.center.contentPane({frameTarget: true, selfsubscribe_save: "save", selfsubscribe_undo: "reset", selfsubscribe_toggleDetails: "toggleDetails", overflow: "auto", padding: "var(--gramlot-space-4)"});
        const tabs = center.tabContainer({height: "100%", selectedPage: "^preview.selected", id: "theme-tabs"});
        const record = tabs.contentPane({title: "Record", pageName: "record", padding: "var(--gramlot-space-3)", overflow: "auto"});
        const grid = record.div({display: "grid", grid_template_columns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "var(--gramlot-space-3)", align_items: "start"});
        const native = grid.div();
        native.html_label("Customer · native input", {for: "theme-native", display: "block"});
        native.input({value: "^preview.name", live: true, id: "theme-native"});
        const component = grid.div();
        component.textbox({value: "^preview.reference", lbl: "Reference · component", live: true, width: "100%", id: "theme-component"});
        const state = grid.div();
        state.html_label("Status", {for: "theme-status", display: "block"});
        const select = state.select({value: "^preview.status", id: "theme-status"});
        for (const value of ["Ready", "In progress", "Done"]) {
            select.option(value, {value: value});
        }
        const locked = grid.div();
        locked.html_label("Read only", {for: "theme-readonly", display: "block"});
        locked.input({value: "Assigned automatically", readonly: true, id: "theme-readonly"});
        record.checkbox({value: "^preview.locked", label: "Disable Save", margin_top: "var(--gramlot-space-3)"});
        const detail = record.div({hidden: "^preview.details:=!{}", margin_top: "var(--gramlot-space-3)"});
        detail.html_label("Notes", {for: "theme-notes", display: "block"});
        detail.textarea({value: "^preview.notes", placeholder: "Add a short note…", rows: 2, id: "theme-notes"});
        const validation = record.div({margin_top: "var(--gramlot-space-3)"});
        validation.html_label("Validation state", {for: "theme-invalid", display: "block"});
        validation.input({value: "Check this value", aria_invalid: "true", aria_describedby: "theme-error", id: "theme-invalid"});
        validation.p("Example error: enter a valid reference.", {color: "var(--gramlot-error)", id: "theme-error", margin: "3px 0 0"});
        const rows = tabs.contentPane({title: "Items", pageName: "items", padding: "var(--gramlot-space-3)", overflow: "auto"});
        const table = rows.table({min_width: "420px"});
        const head = table.thead().tr();
        for (const label of ["Reference", "Description", "Status"]) {
            head.th(label);
        }
        const body = table.tbody();
        for (const [ref, text, state] of [["PO-1048", "Workspace review", "Ready"], ["PO-1049", "Toolbar alignment", "In progress"], ["PO-1050", "Focus and contrast", "Ready"], ["PO-1051", "Compact form", "Done"]]) {
            const row = body.tr();
            for (const value of [ref, text, state]) {
                row.td(value);
            }
        }
        const footer = frame.bottom.menu({presentation: "bar", padding: "2px 4px", iconSize: 18, background: "var(--gramlot-surface-subtle)", border_top: "1px solid var(--gramlot-border)"});
        footer.menuline({group: true}).span("^preview.notice", {class: "muted"});
        footer.spacer({flex: 1});
        footer.menuline({caption: "Open dialog", action: "openDialog", overflowable: false});
        footer.menuline({caption: "Floating", action: "openFloating", overflowable: false});
        this.window(root.dialog({title: (this.constructor.profile + " · Edit record"), open: "^preview.open", width: "440px", height: "200px", movable: true, resizable: true, collapsible: true, maximizable: true}), "preview.open");
        this.window(root.floatingPane({title: (this.constructor.profile + " · Tools"), open: "^preview.floating", width: "320px", height: "200px", maximizable: true}), "preview.floating");
    }

    window(window, path) {

        const frame = window.frame;
        const toolbar = frame.top.menu({presentation: "bar", iconSize: 18, padding: "2px 4px", background: "var(--gramlot-surface-subtle)", border_bottom: "1px solid var(--gramlot-border)"});
        toolbar.menuline("documenti:undo", {caption: "Reset", iconSrc: icon("M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6")});
        const center = frame.center.contentPane({frameTarget: true, selfsubscribe_save: "save", selfsubscribe_undo: "reset", padding: "var(--gramlot-space-4)", overflow: "auto"});
        center.textbox({value: "^preview.name", lbl: "Customer", live: true, width: "100%"});
        center.p("^preview.notice", {role: "status", margin_top: "var(--gramlot-space-3)"});
        const footer = frame.bottom.menu({presentation: "bar", iconSize: 18, padding: "2px 4px", background: "var(--gramlot-surface-subtle)", border_top: "1px solid var(--gramlot-border)"});
        footer.spacer({flex: 1});
        footer.menuline({caption: "Close", action: "closeWindow", parameters: {path: path}});
        footer.menuline("documenti:save", {disabled: "^preview.locked", iconSrc: icon("M5 3h12l4 4v14H3V3h2ZM7 3v6h9V3M7 21v-8h10v8")});
    }
}
