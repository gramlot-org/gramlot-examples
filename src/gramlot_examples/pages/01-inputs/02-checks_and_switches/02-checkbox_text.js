import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Checkbox group: select several values";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Several choices, one value");
        main_content.p("Choose several notification channels. Two groups share the same comma-separated codes; clearing all choices writes null.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack",width:"100%",max_width:"24rem"});
        controls.html_label("Columns (1–3): ",{for:"columns"}).span("^columns",{id:"columns-value"});
        controls.input({default: 2, id:"columns",type:"range",min:1,max:3,value:"^columns",live:true,width:"16rem",max_width:"100%"});
        controls.checkbox({default: false, id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.checkBoxText({id:"channels",value:"^channels",values:"^choices",lbl:"Notifications",cols:"^columns",readonly:"^locked"});
        fields.checkBoxText({id:"channels-copy",value:"^channels",values:"^choices",lbl:"Same channels",cols:1,readonly:"^locked"});
        main_content.p("Selected codes:");
        main_content.p("^channels",{id:"channels-value"});
    }
}
