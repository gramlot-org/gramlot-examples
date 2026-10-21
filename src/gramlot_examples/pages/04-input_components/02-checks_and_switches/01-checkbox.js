import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Checkbox and labelbox";

    main(root) {
        const main_content = root.main({class: "example-page stack"});
        main_content.h1("A boolean value");
        main_content.p("lbl names the field; label is the caption beside its checkbox.");
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "32rem"});
        fields.checkbox({id: "newsletter", value: "^newsletter", lbl: "Contact preferences", label: "Send me the newsletter", lbl_color: "#315fa8", box_padding: "8px", disabled: "^locked"});
        fields.checkbox({id: "newsletter-copy", value: "^newsletter", lbl: "Same preference", label: "Newsletter", disabled: "^locked"});
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({value: "^locked", lbl: "State", label: "Disable the preference"});
        main_content.p("Subscribed", {hidden: "^newsletter:=!{}", id: "subscribed"});
        main_content.p("Not subscribed", {hidden: "^newsletter", id: "not-subscribed"});
        for (const [path, value] of [["newsletter", false], ["locked", false], ]) {
            main_content.dataSetter({destination_path: path, value});
        }
    }
}
