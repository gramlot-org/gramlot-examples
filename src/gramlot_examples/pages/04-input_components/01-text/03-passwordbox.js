import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Password and labelbox";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Password and labelbox");
        main_content.p("Two password fields share a sample value. The browser masks the characters; changing either field updates the other.");
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: true, id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.passwordbox({id: "secret", value: "^secret", lbl: "Sample password", live: "^live",
            disabled: "^locked", placeholder: "Use a sample value", box_padding: "8px"});
        fields.passwordbox({id: "secret-copy", value: "^secret", lbl: "Same sample password", live: "^live", disabled: "^locked"});
    }
}
