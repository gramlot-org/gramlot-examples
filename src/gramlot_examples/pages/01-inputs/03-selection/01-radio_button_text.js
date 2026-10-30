import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Radio group: choose one value";

    main(root) {
        const main_content = root.main({class: "example-page stack"});
        main_content.h1("One code for each group");
        main_content.p("Choose a delivery option: the Data stores its code, not its caption. The second group has its own value. Arrow keys move between options.");
        const options = main_content.details({max_width: "36rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.html_label("Columns (1–3): ", {for: "columns"}).span("^columns", {id: "columns-value"});
        controls.input({default: 3, id: "columns", type: "range", min: 1, max: 3, value: "^columns", live: true, width: "16rem", max_width: "100%"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "36rem"});
        const choices = "standard:Standard,express:Express,pickup:Pick up";
        fields.radioButtonText({id: "shipping", value: "^shipping", values: choices, lbl: "Delivery", cols: "^columns", lbl_color: "var(--gramlot-action)"});
        fields.radioButtonText({id: "alternative", value: "^alternative", values: choices, lbl: "Alternative delivery", cols: 3});
        const facts = main_content.dl();
        facts.dt("Delivery code");
        facts.dd("^shipping", {id: "shipping-value"});
        facts.dt("Alternative code");
        facts.dd("^alternative", {id: "alternative-value"});
    }
}
