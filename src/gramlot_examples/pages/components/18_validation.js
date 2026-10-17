import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    static title = "Required values and length";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("The draft and the accepted value");
        pane.p("Try one letter, more than eight, or an empty name. The draft stays in the field; the Data below keeps the last valid value.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"live",value:"^live",lbl:"Timing",label:"Validate while typing"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.textbox({id:"name",value:"^name",lbl:"Name (2–8 characters)",live:"^live",
            validate_notnull:true,validate_len:"2:8",validate_notnull_error:"Please enter a name.",
            validate_len_error:"Use between 2 and 8 characters.",box_c_width:"16rem",box_c_max_width:"100%"});
        fields.p("Last accepted name:");fields.p("^name",{id:"accepted-name"});
        fields.textbox({id:"name-copy",value:"^name",lbl:"Another view of the Data",readonly:true,
            box_c_width:"16rem",box_c_max_width:"100%"});
        const notes = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        notes.textBoxArea({id:"notes",value:"^notes",lbl:"Optional note (up to 20 characters)",rows:2,
            validate_len:":20",live:"^live",box_c_width:"18rem",box_c_max_width:"100%"});
        notes.p("^notes",{id:"accepted-notes"});
        const numbers = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        numbers.numberTextBox({id:"quantity",value:"^quantity",lbl:"Required quantity — zero is valid",
            validate_notnull:true,box_c_width:"10rem",box_c_max_width:"100%"});
        numbers.p("^quantity",{id:"accepted-quantity"});
        for (const [destination_path,value] of [["name","Ada"],["notes","Hello"],["quantity",0],["live",false]]) pane.dataSetter({destination_path,value});
    }
}
export class Logic {}
