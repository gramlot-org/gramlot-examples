import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Horizontal slider: range and steps";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Horizontal slider");
        main_content.p("Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.horizontalSlider({default: 50, id: "level", value: "^level", lbl: "Level", min: 0, max: 100, step: 5,
            live: "^live", disabled: "^locked"});
        fields.horizontalSlider({id: "level-copy", value: "^level", lbl: "Same level", min: 0, max: 100, step: 5, live: "^live", disabled: "^locked"});
        main_content.p("^level", {id: "level-value"});
    }
}
