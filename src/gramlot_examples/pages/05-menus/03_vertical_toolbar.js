import {Page as BasePage} from '@gramlot/gramlot/page';
function svg_icon(drawing) {

    const svg = (("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#dbe4ef\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" + drawing) + "</svg>");
    return ("data:image/svg+xml," + encodeURIComponent(svg));
}
const ICONS = {"home": svg_icon("<path d=\"m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9\"/>"), "documents": svg_icon("<path d=\"M3 7V4h7l2 3h9v14H3Z\"/><path d=\"M3 10h18\"/>"), "activity": svg_icon("<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 6v6l4 2\"/>"), "settings": svg_icon("<path d=\"M4 7h16M4 17h16\"/><circle cx=\"8\" cy=\"7\" r=\"3\" fill=\"#292929\"/><circle cx=\"16\" cy=\"17\" r=\"3\" fill=\"#292929\"/>"), "integrations": svg_icon("<path d=\"M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-12 0ZM12 17v4\"/>"), "branches": svg_icon("<circle cx=\"6\" cy=\"4\" r=\"2\"/><circle cx=\"6\" cy=\"20\" r=\"2\"/><circle cx=\"18\" cy=\"5\" r=\"2\"/><path d=\"M6 6v12m0-5c0-4 12 1 12-6\"/>"), "overview": svg_icon("<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/>")};

export class Page extends BasePage {
    static title = "Vertical icon toolbar";

    main(root) {

        const main_content = root.main({padding: "24px", max_width: "900px", margin: "auto"});
        main_content.h1("Vertical icon toolbar");
        main_content.p("A narrow rail with SVG icons and tooltips; selection uses only its background. Select Home, Documents or Activity: the highlighted button and central content follow the same Data value. Tools opens a menu to the right, marked ›.");
        this.height_control(main_content);
        main_content.p("Reduce the height to send lower-priority items into the › overflow menu. Home and Tools stay on the rail. Labels always appear beside icons inside a menu; selecting an overflow entry also updates the highlighted section.");
        this.vertical_toolbar(main_content);
        main_content.a("Try the classic menu bar and nested menus →", {href: "/pages/05-menus/04_menu_bar", display: "block", margin: "16px 0"});
        main_content.p("The drawings are SVG images supplied through iconSrc. iconSize controls the icon independently of the button. The classic menu-bar lesson also shows emoji icons and per-entry styling.");
        this.horizontal_toolbar(main_content);

    }

    height_control(main_content) {
        const controls = main_content.div({display: "flex", gap: "12px", align_items: "center", flex_wrap: "wrap", margin: "16px 0"});
        controls.html_label("Rail height", {for: "rail-height"});
        controls.input({type: "range", min: 180, max: 500, step: 20, value: "^navigation.height", live: true, id: "rail-height", aria_label: "Rail height", width: "190px"});
        controls.span("^navigation.height");
        controls.span("px");
    }

    vertical_toolbar(main_content) {
        const frame = main_content.framePane({height: "^navigation.height:={} + 'px'", min_height: "180px", border: "1px solid #64748b", border_radius: "12px", overflow: "hidden", id: "rail-frame"});
        frame.left.setAttr({width: "64px", padding: "8px 3px", background: "#292929"});
        const rail = frame.left.menu({presentation: "bar", orientation: "vertical", labelPosition: "tooltip", iconSize: 32, width: "58px", id: "icon-rail"});
        this.section(rail, "home", "Home", {overflowable: false});
        this.section(rail, "documents", "Documents", {priority: 80});
        this.section(rail, "activity", "Activity", {priority: 60});
        const tools = rail.menuline({caption: "Tools", iconSrc: ICONS["settings"], overflowable: false, id: "rail-tools"}).menu({id: "rail-tools-menu"});
        this.section(tools, "settings", "Settings");
        this.section(tools, "integrations", "Integrations");
        rail.menuline("-");
        this.section(rail, "branches", "Branches", {priority: 20});
        this.section(rail, "overview", "Overview", {priority: 10});
        const center = frame.center.contentPane({frameTarget: true, node_label: "navigation_content", padding: "18px"});
        center.h2("^navigation.selected", {id: "selected-section", margin: "0 0 12px", text_transform: "capitalize"});
        center.p("Selected section. Choose another icon or open Tools.");
    }

    horizontal_toolbar(main_content) {
        main_content.h2("The horizontal equivalent");
        main_content.p("Here Tools and the overflow trigger point down (▾). Popup descendants continue to open sideways.");
        const horizontal = main_content.menu({presentation: "bar", labelPosition: "tooltip", iconSize: 28, id: "horizontal-rail", padding: "8px", border: "1px solid #64748b", border_radius: "8px"});
        this.section(horizontal, "home", "Home", {overflowable: false});
        horizontal.menuline({caption: "Tools", iconSrc: ICONS["settings"], overflowable: false, id: "horizontal-tools"}).menu().menuline({caption: "Settings", iconSrc: ICONS["settings"], action: "selectSection", parameters: {section: "settings"}});
        horizontal.spacer({flex: 1});
        for (const [key, caption] of [["documents", "Documents"], ["activity", "Activity"], ["branches", "Branches"], ["overview", "Overview"]]) {
            this.section(horizontal, key, caption);
        }
    }

    section(menu, key, caption, attributes = {}) {
        return menu.menuline({caption: caption, iconSrc: ICONS[key], tooltip: caption, checked: `^navigation.selected:={} === '${key}'`, action: "selectSection", parameters: {section: key}, ...attributes});
    }

}

/** The selected navigation section is ordinary page Data. */
export class Logic {
    selectSection(node) {
        node.SET('navigation.selected', node.getAttr('parameters').section);
    }
}

