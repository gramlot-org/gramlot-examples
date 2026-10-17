import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Checkbox and labelbox";
    static css = ["/themes/gramlot-base/theme.css"];

    main(root) {
        const pane = root.main({class: "example-page stack"});
        pane.h1("A boolean value");
        pane.p("lbl names the field; label is the caption beside its checkbox.");
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "32rem"});
        fields.checkbox({id: "newsletter", value: "^newsletter", lbl: "Contact preferences", label: "Send me the newsletter", lbl_color: "#315fa8", box_padding: "8px", disabled: "^locked"});
        fields.checkbox({id: "newsletter-copy", value: "^newsletter", lbl: "Same preference", label: "Newsletter", disabled: "^locked"});
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({value: "^locked", lbl: "State", label: "Disable the preference"});
        pane.p("Subscribed", {hidden: "^newsletter:=!{}", id: "subscribed"});
        pane.p("Not subscribed", {hidden: "^newsletter", id: "not-subscribed"});
        for (const [path, value] of [["newsletter", false], ["locked", false], ]) {
            pane.dataSetter({destination_path: path, value});
        }
    }
}

/** This page needs no named client methods. */
export class Logic {}
