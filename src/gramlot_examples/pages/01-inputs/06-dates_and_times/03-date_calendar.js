import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static devices = ['desktop', 'tablet', 'phone'];
    static title = "Inline and popup calendars";
    static locale = "it-IT";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("One date, three editors");
        main_content.p("Pick a day or type a date. The inline calendar, popup and text-only field share the same Data value.");
        const controls = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({default: false, id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.dateTextBox({id:"date",value:"^date",lbl:"With popup",
            readonly:"^locked",box_c_width:"14rem",box_c_max_width:"100%"});
        fields.dateTextBox({id:"plain",value:"^date",lbl:"Text only",calendar:false,
            readonly:"^locked",box_c_width:"14rem",box_c_max_width:"100%"});
        fields.dateCalendar({id:"calendar",value:"^date",lbl:"Choose a day",readonly:"^locked",lbl_color:"#4369c5",box_c_max_width:"100%"});
        main_content.p("^date",{id:"date-value",format:"long",dtype:"D"});
    }
}
