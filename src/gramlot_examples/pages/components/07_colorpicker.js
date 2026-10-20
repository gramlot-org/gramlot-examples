import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Color and labelbox";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Color and labelbox");
        main_content.p("Choose a color in either picker. Both controls and the swatch follow the same Data value.");
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.colorpicker({id: "color", value: "^color", lbl: "Accent color", live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.colorpicker({id: "color-copy", value: "^color", lbl: "Same color", live: "^live", disabled: "^locked"});
        main_content.div({background_color: "^color", width: "6rem", height: "3rem", border: "1px solid #888", aria_label: "Color sample"});
        main_content.p("^color", {id: "color-value"});
        for (const [path, value] of [["color", "#315fa8"], ["locked", false], ["live", true]]) main_content.dataSetter({destination_path: path, value});
    }
}
