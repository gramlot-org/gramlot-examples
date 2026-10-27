import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from "@gramlot/gramlot/page";

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Numeric fields: format and constraints";
    static locale = "it-IT";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Number editing");
        main_content.p("Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack",width:"100%",max_width:"24rem"});
        controls.checkbox({default: false, id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({default: false, id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.numberTextBox({id:"amount", value:"^amount", lbl:"Amount (0–100)", format:"0.00", min:0, max:100, live:"^live", readonly:"^locked", box_c_width:"14rem"});
        fields.numberTextBox({id:"amount-copy", value:"^amount", lbl:"Same amount", format:"0.00", readonly:"^locked", box_c_width:"14rem"});
        fields.numberTextBox({id:"quantity", value:"^quantity", lbl:"Integer", dtype:"L", readonly:"^locked", box_c_width:"10rem"});
        fields.numberTextBox({id:"exact", value:"^exact", lbl:"Exact Decimal", dtype:"N", format:"0.00", readonly:"^locked", box_c_width:"16rem"});
        main_content.p("^amount", {id:"amount-value", format:"0.00", dtype:"R"});
        main_content.p("^exact", {id:"exact-value", format:"0.00", dtype:"N"});
    }
}
