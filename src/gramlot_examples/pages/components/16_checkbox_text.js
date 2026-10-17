import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Checkbox group";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("Several choices, one value");
        pane.p("Choose several notification channels. Two groups share the same comma-separated codes; clearing all choices writes null.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.html_label("Columns (1–3): ",{for:"columns"}).span("^columns",{id:"columns-value"});
        controls.input({id:"columns",type:"range",min:1,max:3,value:"^columns",live:true,width:"16rem",max_width:"100%"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.checkBoxText({id:"channels",value:"^channels",values:"^choices",lbl:"Notifications",cols:"^columns",readonly:"^locked",box_padding:"8px"});
        fields.checkBoxText({id:"channels-copy",value:"^channels",values:"^choices",lbl:"Same channels",cols:1,readonly:"^locked",box_padding:"8px"});
        pane.p("Selected codes:");
        pane.p("^channels",{id:"channels-value"});
        for (const [destination_path,value] of [["choices","email:Email,sms:SMS,push:Push"],["channels","email,push"],["columns",2],["locked",false]]) pane.dataSetter({destination_path,value});
    }
}

export class Logic {}
