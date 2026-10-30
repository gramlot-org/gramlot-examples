import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Date fields: entry and display formats";
    static locale = "it-IT";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Date editing");
        main_content.p("Enter a calendar date or a word such as oggi or domani. Two fields share one civil date.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack",width:"100%",max_width:"24rem"});
        controls.checkbox({default: false, id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({default: false, id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.dateTextBox({id:"date", value:"^date", lbl:"Appointment", format:"long",  live:"^live", readonly:"^locked", box_c_width:"16rem"});
        fields.dateTextBox({id:"date-copy", value:"^date", lbl:"Same date, short display", calendar:false, format:"short",  readonly:"^locked", box_c_width:"14rem"});
        main_content.p("^date", {id:"date-value", format:"long", dtype:"D"});
    }
}
