import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {

    main(root) {
        const fields = root.formlet({class: "card stack", width: "100%", max_width: "32rem"});
        fields.checkbox({id: "newsletter", value: "^newsletter", lbl: "Contact preferences", label: "Send me the newsletter", lbl_color: "var(--gramlot-action)", disabled: "^locked"});
        fields.checkbox({id: "newsletter-copy", value: "^newsletter", lbl: "Same preference", label: "Newsletter", disabled: "^locked"});
        const options = root.details({max_width: "32rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: false, value: "^locked", lbl: "State", label: "Disable the preference"});
        root.p("Subscribed", {hidden: "^newsletter:=!{}", id: "subscribed"});
        root.p("Not subscribed", {hidden: "^newsletter", id: "not-subscribed"});
    }
}
