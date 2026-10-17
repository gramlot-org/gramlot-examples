import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Date editing";
    static locale = "it-IT";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("Date editing");
        pane.p("Enter a calendar date or a word such as oggi or domani. Two fields share one civil date.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.dateTextBox({id:"date", value:"^date", lbl:"Appointment", format:"long",  live:"^live", readonly:"^locked", box_c_width:"16rem"});
        fields.dateTextBox({id:"date-copy", value:"^date", lbl:"Same date, short display", calendar:false, format:"short",  readonly:"^locked", box_c_width:"14rem"});
        pane.p("^date", {id:"date-value", format:"long", dtype:"D"});
        pane.dataSetter({destination_path:"date",value:new Date('2026-10-16T00:00:00Z')});
        for (const [path,value] of [["live",false],["locked",false]]) pane.dataSetter({destination_path:path,value});
    }
}

export class Logic {}
