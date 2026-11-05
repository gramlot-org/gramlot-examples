import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {

    main(root) {
        const options = root.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = root.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.verticalSlider({default: 50, id: "level", value: "^level", lbl: "Vertical level", min: 0, max: 100, step: 5,
            live: "^live", disabled: "^locked"});
        fields.horizontalSlider({id: "level-copy", value: "^level", lbl: "Same level horizontally", min: 0, max: 100, step: 5, live: "^live", disabled: "^locked"});
        root.p("^level", {id: "level-value"});
    }
}
