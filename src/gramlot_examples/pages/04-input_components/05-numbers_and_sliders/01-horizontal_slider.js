import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Horizontal slider";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Horizontal slider");
        main_content.p("Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.");
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.horizontalSlider({id: "level", value: "^level", lbl: "Level", min: 0, max: 100, step: 5,
            live: "^live", disabled: "^locked", box_padding: "8px"});
        fields.horizontalSlider({id: "level-copy", value: "^level", lbl: "Same level", min: 0, max: 100, step: 5, live: "^live", disabled: "^locked"});
        main_content.p("^level", {id: "level-value"});
        for (const [path, value] of [["level", 50], ["locked", false], ["live", true]]) main_content.dataSetter({destination_path: path, value});
    }
}
