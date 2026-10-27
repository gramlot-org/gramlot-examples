import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Individual radio buttons";

    main(root) {
        const main_content = root.main({class: 'example-page stack'});
        main_content.h1("Single radio buttons");
        main_content.p("Each radio binds its own boolean. A shared group makes the choices exclusive; a separate group stays independent.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack", width: "100%", max_width: "24rem"});
        controls.checkbox({default: false, id: "locked", value: "^locked", lbl: "State", label: "Disable controls"});
        const fields = main_content.formlet({class: "card stack", width: "100%", max_width: "24rem"});
        for (const [code, caption] of [["standard", "Standard"], ["express", "Express"], ["pickup", "Pick up"]]) {
            fields.radioButton({id: code, value: `^${code}`, group: "delivery", label: caption,
                 disabled: "^locked"});
        }
        fields.radioButton({id: "independent", value: "^independent", group: "other", label: "Independent choice", lbl: "Another group", disabled: "^locked"});
        const facts = main_content.dl();
        for (const code of ["standard", "express", "pickup", "independent"]) {
            facts.dt(code); facts.dd(`^${code}`, {id: `${code}-value`});
        }
    }
}
