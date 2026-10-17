import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Password and labelbox";
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1("Password and labelbox");
        pane.p("Two password fields share a sample value. The browser masks the characters; changing either field updates the other.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "live", value: "^live", lbl: "Editing", label: "Update while editing"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        fields.passwordbox({id: "secret", value: "^secret", lbl: "Sample password", live: "^live",
            disabled: "^locked", placeholder: "Use a sample value", box_padding: "8px"});
        fields.passwordbox({id: "secret-copy", value: "^secret", lbl: "Same sample password", live: "^live", disabled: "^locked"});
        for (const [path, value] of [["secret", "sample-only"], ["locked", false], ["live", true]]) pane.dataSetter({destination_path: path, value});
    }
}

/** This page needs no named client methods. */
export class Logic {}
