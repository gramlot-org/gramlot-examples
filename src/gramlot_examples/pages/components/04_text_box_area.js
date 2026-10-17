import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Multiline text and labelbox";
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1("Multiline text and labelbox");
        pane.p("Two multiline fields share one note. Switch live editing and move the label while keeping the text and selection.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.textBoxArea({id: "notes", value: "^notes", lbl: "Notes", rows: 4, cols: 24,
            placeholder: "Write a few lines", live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.textBoxArea({id: "notes-copy", value: "^notes", lbl: "Same notes", rows: 3, cols: 24, live: "^live", disabled: "^locked"});
        for (const [path, value] of [["notes", "First line\nSecond line"], ["locked", false], ["live", true]]) pane.dataSetter({destination_path: path, value});
    }
}

/** This page needs no named client methods. */
export class Logic {}
