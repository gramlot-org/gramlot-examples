import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Single radio buttons";
    static css = ['/themes/gramlot-base/theme.css'];

    main(root) {
        const pane = root.main({class: 'example-page stack'});
        pane.h1("Single radio buttons");
        pane.p("Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent.");
        const controls = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        controls.checkbox({id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = pane.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        for (const [code, caption] of [["standard", "Standard"], ["express", "Express"], ["pickup", "Pick up"]]) {
            fields.radioButton({id: code, value: `^${code}`, group: "delivery", label: caption,
                lbl: caption, disabled: "^locked", box_padding: "4px"});
        }
        fields.radioButton({id: "independent", value: "^independent", group: "other", label: "Independent choice", lbl: "Another group", disabled: "^locked"});
        const facts = pane.dl();
        for (const code of ["standard", "express", "pickup", "independent"]) {
            facts.dt(code); facts.dd(`^${code}`, {id: `${code}-value`});
        }
        for (const [path, value] of [["standard", true], ["express", false], ["pickup", false], ["independent", false], ["locked", false]]) pane.dataSetter({destination_path: path, value});
    }
}

/** This page needs no named client methods. */
export class Logic {}
