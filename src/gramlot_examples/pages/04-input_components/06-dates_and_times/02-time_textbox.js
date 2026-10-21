import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Time editing";
    static locale = "it-IT";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Time editing");
        main_content.p("Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value.");
        const controls = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.timeTextBox({id:"time", value:"^time", lbl:"Departure", format:"medium", live:"^live", readonly:"^locked", box_c_width:"14rem"});
        fields.timeTextBox({id:"time-copy", value:"^time", lbl:"Same time, short display", format:"short", readonly:"^locked", box_c_width:"14rem"});
        main_content.p("^time", {id:"time-value", format:"medium", dtype:"H"});
        main_content.dataSetter({destination_path:"time",value:new Date('1970-01-01T09:30:00Z')});
        for (const [path,value] of [["live",false],["locked",false]]) main_content.dataSetter({destination_path:path,value});
    }
}
