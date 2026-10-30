import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Vertical slider: orientation and values";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Vertical slider");
        main_content.p("Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.verticalSlider({default: 50, id: "level", value: "^level", lbl: "Vertical level", min: 0, max: 100, step: 5,
            live: "^live", disabled: "^locked"});
        fields.horizontalSlider({id: "level-copy", value: "^level", lbl: "Same level horizontally", min: 0, max: 100, step: 5, live: "^live", disabled: "^locked"});
        main_content.p("^level", {id: "level-value"});
    }
}
