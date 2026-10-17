import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    static title = "Date calendar";
    static locale = "it-IT";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("One date, three editors");
        pane.p("Pick a day or type a date. The inline calendar, popup and text-only field share the same Data value.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.dateTextBox({id:"date",value:"^date",lbl:"With popup",
            readonly:"^locked",box_c_width:"14rem",box_c_max_width:"100%"});
        fields.dateTextBox({id:"plain",value:"^date",lbl:"Text only",calendar:false,
            readonly:"^locked",box_c_width:"14rem",box_c_max_width:"100%"});
        fields.dateCalendar({id:"calendar",value:"^date",lbl:"Choose a day",readonly:"^locked",lbl_color:"#4369c5",box_c_max_width:"100%"});
        pane.p("^date",{id:"date-value",format:"long",dtype:"D"});
        pane.dataSetter({destination_path:"date",value:new Date('2026-10-16T00:00:00Z')});
        pane.dataSetter({destination_path:"locked",value:false});
    }
}
export class Logic {}
