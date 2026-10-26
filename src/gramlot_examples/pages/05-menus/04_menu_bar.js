import {Page as BasePage} from '@gramlot/gramlot/page';
import layout from '../../gallery/dist/layout/descriptor.js';
import mygramlot from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = "Classic menu bar and hierarchy";
    static gramlots = [layout, mygramlot];

    main(root) {

        const main_content = root.main({padding: "20px", max_width: "900px", margin: "auto"});
        main_content.h1("Classic menu bar");
        main_content.p("Click File, Edit or View. The first level shows menu names; each opens a compact popup. In File → Export → Image, the next levels open sideways. These are nested menu and menuline declarations.");
        const frame = main_content.framePane({height: "260px", border: "1px solid #64748b", border_radius: "8px"});
        const bar = frame.top.menu({presentation: "bar", iconSize: 20, id: "classic-menu-bar"});
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
        const edit = bar.menuline({caption: "Edit", overflowable: false}).menu();
        this.item(edit, "Undo", "↩️", {disabled: true});
        this.item(edit, "Copy", "📋");
        const view = bar.menuline({caption: "View", overflowable: false}).menu();
        view.menuline({caption: "Show details", icon: "🔎", checked: "^navigation.details", action: "toggleDetails"});
        view.menuline("-");
        this.item(view, "Full screen", "🖥️", {disabled: true});
        const center = frame.center.contentPane({frameTarget: true, padding: "16px"});
        center.p("Last chosen command");
        center.h3("^navigation.selected", {id: "chosen-command"});
        main_content.h2("What to observe");
        main_content.p("A selected toolbar button uses only its highlighted background. Popup menus retain a check mark for checked entries: View → Show details toggles it. Disabled commands remain visible but cannot run. The actions here only update the message above.");
        main_content.h2("Customize one entry");
        main_content.p("caption names the entry; class_, color, width and height style its outer button. icon and iconSize configure its graphic separately. SVG uses iconSrc instead. This blue example is 140 × 52 px with a 24 px emoji icon.");
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

