import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Time fields: entry and display formats";
    static locale = "it-IT";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Time editing");
        main_content.p("Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack",width:"100%",max_width:"24rem"});
        controls.checkbox({default: false, id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({default: false, id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.timeTextBox({id:"time", value:"^time", lbl:"Departure", format:"medium", live:"^live", readonly:"^locked", box_c_width:"14rem"});
        fields.timeTextBox({id:"time-copy", value:"^time", lbl:"Same time, short display", format:"short", readonly:"^locked", box_c_width:"14rem"});
        main_content.p("^time", {id:"time-value", format:"medium", dtype:"H"});
    }
}
