import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Multiline text and labelbox";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Multiline text and labelbox");
        main_content.p("Two multiline fields share one note. Switch live editing or disable the controls while keeping the text and selection.");
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.textBoxArea({id: "notes", value: "^notes", lbl: "Notes", rows: 4, cols: 24,
            placeholder: "Write a few lines", live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.textBoxArea({id: "notes-copy", value: "^notes", lbl: "Same notes", rows: 3, cols: 24, live: "^live", disabled: "^locked"});
        for (const [path, value] of [["notes", "First line\nSecond line"], ["locked", false], ["live", true]]) main_content.dataSetter({destination_path: path, value});
    }
}
