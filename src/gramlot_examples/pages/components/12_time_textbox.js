import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Time editing";
    static locale = "it-IT";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("Time editing");
        pane.p("Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.timeTextBox({id:"time", value:"^time", lbl:"Departure", format:"medium", live:"^live", readonly:"^locked", box_c_width:"14rem"});
        fields.timeTextBox({id:"time-copy", value:"^time", lbl:"Same time, short display", format:"short", readonly:"^locked", box_c_width:"14rem"});
        pane.p("^time", {id:"time-value", format:"medium", dtype:"H"});
        pane.dataSetter({destination_path:"time",value:new Date('1970-01-01T09:30:00Z')});
        for (const [path,value] of [["live",false],["locked",false]]) pane.dataSetter({destination_path:path,value});
    }
}

export class Logic {}
