import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Multiline text fields";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.textBoxArea({id: "notes", value: "^notes", lbl: "Notes", rows: 4, cols: 24,
            placeholder: "Write a few lines", live: "^live", disabled: "^locked"});
        fields.textBoxArea({id: "notes-copy", value: "^notes", lbl: "Same notes", rows: 3, cols: 24, live: "^live", disabled: "^locked"});
    }
}
