import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "RadioButtonText and labelbox";
    static css = ["/themes/gramlot-base/theme.css"];

    main(root) {
        const pane = root.main({class: "example-page stack"});
        pane.h1("One code for each group");
        pane.p("Choose a delivery option: the Data stores its code, not its caption. The second group has its own value. Arrow keys move between options.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.html_label("Columns (1–3): ", {for: "columns"}).span("^columns", {id: "columns-value"});
        controls.input({id: "columns", type: "range", min: 1, max: 3, value: "^columns", live: true, width: "16rem", max_width: "100%"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "36rem"});
        const choices = "standard:Standard,express:Express,pickup:Pick up";
        fields.radioButtonText({id: "shipping", value: "^shipping", values: choices, lbl: "Delivery", cols: "^columns", lbl_color: "#315fa8", box_padding: "8px"});
        fields.radioButtonText({id: "alternative", value: "^alternative", values: choices, lbl: "Alternative delivery", cols: 3, box_padding: "8px"});
        const facts = pane.dl();
        facts.dt("Delivery code");
        facts.dd("^shipping", {id: "shipping-value"});
        facts.dt("Alternative code");
        facts.dd("^alternative", {id: "alternative-value"});
        for (const [path, value] of [["shipping", "standard"], ["alternative", "pickup"], ["columns", 3]]) {
            pane.dataSetter({destination_path: path, value});
        }
    }
}

/** This page needs no named client methods. */
export class Logic {}
