import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {

    main(root) {
        const options = root.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = root.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.colorpicker({default: "#315fa8", id: "color", value: "^color", lbl: "Accent color", live: "^live", disabled: "^locked"});
        fields.colorpicker({id: "color-copy", value: "^color", lbl: "Same color", live: "^live", disabled: "^locked"});
        root.div({background_color: "^color", width: "6rem", height: "3rem", border: "1px solid #888", aria_label: "Color sample"});
        root.p("^color", {id: "color-value"});
    }
}
