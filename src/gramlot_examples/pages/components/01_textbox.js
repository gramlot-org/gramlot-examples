import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    static title = "Textbox and labelbox";
    static css = ["/themes/gramlot-base/theme.css"];

    main(root) {
        const pane = root.main({class: "example-page stack"});
        pane.h1("One value, two textboxes");
        pane.p("Type in either field. Both share the same Data value.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.html_label("Label position", {for: "position"});
        const position = controls.select({id: "position", value: "^position", width: "8rem", max_width: "100%"});
        for (const code of ["TL", "TC", "TR", "L", "R", "BL", "BC", "BR"]) {
            position.option(code, {value: code});
        }
        controls.checkbox({value: "^live", lbl: "Editing", label: "Update while typing"});
        controls.checkbox({value: "^readonly", lbl: "State", label: "Read only"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "32rem"});
        fields.textbox({id: "customer", value: "^customer", lbl: "Customer", lbl_position: "^position", live: "^live", readonly: "^readonly", placeholder: "Enter a name", lbl_color: "#315fa8", box_padding: "8px", box_l_padding: "4px", box_c_width: "240px"});
        fields.textbox({id: "customer-copy", value: "^customer", lbl: "Same customer", live: "^live", readonly: "^readonly"});
        pane.h2("The Data");
        pane.p("^customer", {id: "customer-value"});
        for (const [path, value] of [["customer", "Ada"], ["position", "TL"], ["live", true], ["readonly", false]]) {
            pane.dataSetter({destination_path: path, value});
        }
    }
}

/** This page needs no named client methods. */
export class Logic {}
