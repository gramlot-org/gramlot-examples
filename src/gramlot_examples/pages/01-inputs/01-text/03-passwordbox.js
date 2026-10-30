import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Password fields";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("One password, two masked fields");
        main_content.p("Two password fields share a sample value. The browser masks the characters; changing either field updates the other.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.passwordbox({id: "secret", value: "^secret", lbl: "Sample password", live: "^live",
            disabled: "^locked", placeholder: "Use a sample value"});
        fields.passwordbox({id: "secret-copy", value: "^secret", lbl: "Same sample password", live: "^live", disabled: "^locked"});
    }
}
