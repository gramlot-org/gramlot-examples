import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Single radio buttons";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Single radio buttons");
        main_content.p("Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent.");
        const controls = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        for (const [code, caption] of [["standard", "Standard"], ["express", "Express"], ["pickup", "Pick up"]]) {
            fields.radioButton({id: code, value: `^${code}`, group: "delivery", label: caption,
                lbl: caption, disabled: "^locked", box_padding: "4px"});
        }
        fields.radioButton({id: "independent", value: "^independent", group: "other", label: "Independent choice", lbl: "Another group", disabled: "^locked"});
        const facts = main_content.dl();
        for (const code of ["standard", "express", "pickup", "independent"]) {
            facts.dt(code); facts.dd(`^${code}`, {id: `${code}-value`});
        }
        for (const [path, value] of [["standard", true], ["express", false], ["pickup", false], ["independent", false], ["locked", false]]) main_content.dataSetter({destination_path: path, value});
    }
}
