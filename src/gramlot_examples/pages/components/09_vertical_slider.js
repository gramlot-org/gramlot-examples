import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Vertical slider";
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1("Vertical slider");
        pane.p("Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.verticalSlider({id: "level", value: "^level", lbl: "Vertical level", min: 0, max: 100, step: 5,
            live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.horizontalSlider({id: "level-copy", value: "^level", lbl: "Same level horizontally", min: 0, max: 100, step: 5, live: "^live", disabled: "^locked"});
        pane.p("^level", {id: "level-value"});
        for (const [path, value] of [["level", 50], ["locked", false], ["live", true]]) pane.dataSetter({destination_path: path, value});
    }
}

/** This page needs no named client methods. */
export class Logic {}
