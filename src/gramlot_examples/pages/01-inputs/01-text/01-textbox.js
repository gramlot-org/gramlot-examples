import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static devices = ['desktop', 'tablet', 'phone'];
    static title = "Text fields: live updates and labels";

    main(root) {
        const main_content = root.main({class: "example-page stack"});
        main_content.h1("One value, two textboxes");
        main_content.p("Type in either field. Both share the same Data value.");
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.html_label("Label position", {for: "position"});
        const position = controls.select({default: "TL", id: "position", value: "^position", width: "8rem", max_width: "100%"});
        for (const code of ["TL", "TC", "TR", "L", "R", "BL", "BC", "BR"]) {
            position.option(code, {value: code});
        }
        controls.checkbox({default: true, value: "^live", lbl: "Editing", label: "Update while typing"});
        controls.checkbox({default: false, value: "^readonly", lbl: "State", label: "Read only"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "32rem"});
        fields.textbox({id: "customer", value: "^customer", lbl: "Customer", lbl_position: "^position", live: "^live", readonly: "^readonly", placeholder: "Enter a name", lbl_color: "#315fa8", box_padding: "8px", box_l_padding: "4px", box_c_width: "240px"});
        fields.textbox({id: "customer-copy", value: "^customer", lbl: "Same customer", live: "^live", readonly: "^readonly"});
        main_content.h2("The Data");
        main_content.p("^customer", {id: "customer-value"});
    }
}
