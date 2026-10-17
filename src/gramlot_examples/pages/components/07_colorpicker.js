import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Color and labelbox";
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1("Color and labelbox");
        pane.p("Choose a color in either picker. Both controls and the swatch follow the same Data value.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.colorpicker({id: "color", value: "^color", lbl: "Accent color", live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.colorpicker({id: "color-copy", value: "^color", lbl: "Same color", live: "^live", disabled: "^locked"});
        pane.div({background_color: "^color", width: "6rem", height: "3rem", border: "1px solid #888", aria_label: "Color sample"});
        pane.p("^color", {id: "color-value"});
        for (const [path, value] of [["color", "#315fa8"], ["locked", false], ["live", true]]) pane.dataSetter({destination_path: path, value});
    }
}

/** This page needs no named client methods. */
export class Logic {}
