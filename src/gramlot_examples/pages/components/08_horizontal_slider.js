import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Horizontal slider";
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1("Horizontal slider");
        pane.p("Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.horizontalSlider({id: "level", value: "^level", lbl: "Level", min: 0, max: 100, step: 5,
            live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.horizontalSlider({id: "level-copy", value: "^level", lbl: "Same level", min: 0, max: 100, step: 5, live: "^live", disabled: "^locked"});
        pane.p("^level", {id: "level-value"});
        for (const [path, value] of [["level", 50], ["locked", false], ["live", true]]) pane.dataSetter({destination_path: path, value});
    }
}

/** This page needs no named client methods. */
export class Logic {}
