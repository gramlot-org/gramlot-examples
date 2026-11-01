import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Classic menu bar and hierarchy";

    main(root) {

        const main_content = root.main({padding: "20px", max_width: "900px", margin: "auto"});
        const frame = main_content.framePane({height: "260px", border: "1px solid #64748b", border_radius: "8px"});
        const bar = frame.top.menu({presentation: "bar", iconSize: 20, id: "classic-menu-bar"});
        this.file_menu(bar);
        this.edit_menu(bar);
        this.view_menu(bar);
        const center = frame.center.contentPane({frameTarget: true, padding: "16px"});
        center.p("Last chosen command");
        center.h3("^navigation.selected", {id: "chosen-command"});
        this.entry_style(main_content);

    }

    file_menu(bar) {
        const file = bar.menuline({caption: "File", id: "file-menu-trigger", overflowable: false}).menu({id: "file-popup"});
        this.item(file, "New document", "📄");
        this.item(file, "Open…", "📂");
        file.menuline("-");
        this.item(file, "Save", "💾");
        const exportMenu = file.menuline({caption: "Export", icon: "📤", id: "export-trigger"}).menu({id: "export-popup"});
        this.item(exportMenu, "PDF", "📕");
        const image = exportMenu.menuline({caption: "Image", icon: "🖼️", id: "image-trigger"}).menu({id: "image-popup"});
        this.item(image, "PNG", "🖼️");
        this.item(image, "SVG", "🖼️");
    }

    edit_menu(bar) {
        const edit = bar.menuline({caption: "Edit", overflowable: false}).menu();
        this.item(edit, "Undo", "↩️", {disabled: true});
        this.item(edit, "Copy", "📋");
    }

    view_menu(bar) {
        const view = bar.menuline({caption: "View", overflowable: false}).menu();
        view.menuline({caption: "Show details", icon: "🔎", checked: "^navigation.details", action: "toggleDetails"});
        view.menuline("-");
        this.item(view, "Full screen", "🖥️", {disabled: true});
    }

    entry_style(main_content) {
        main_content.h2("Customize one entry");
        const sample = main_content.menu({presentation: "bar", iconSize: 24});
        this.item(sample, "Save a copy", "💾", {class: "save-copy", color: "#93c5fd", width: "140px", height: "52px"});
        main_content.a("Back to the vertical icon toolbar", {href: "/pages/05-menus/03_vertical_toolbar"});
    }

    item(menu, caption, icon, attributes = {}) {
        return menu.menuline({caption: caption, icon: icon, action: "selectSection", parameters: {section: caption}, ...attributes});
    }

}

export class Logic {
    selectSection(node) {
        node.SET('navigation.selected', node.getAttr('parameters').section);
    }
    toggleDetails(node) {
        node.SET('navigation.details', !node.GET('navigation.details'));
    }
}

