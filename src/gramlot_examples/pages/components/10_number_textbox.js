import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Number editing";
    static locale = "it-IT";
    static css = ["/themes/gramlot-base/theme.css"];
    async main(root) {
        const {Bag} = await import('@gramlot/gramlot');
        const pane = root.main({class:"example-page stack"});
        pane.h1("Number editing");
        pane.p("Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"live",value:"^live",lbl:"Editing",label:"Update while typing"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.numberTextBox({id:"amount", value:"^amount", lbl:"Amount (0–100)", format:"0.00", min:0, max:100, live:"^live", readonly:"^locked", box_c_width:"14rem"});
        fields.numberTextBox({id:"amount-copy", value:"^amount", lbl:"Same amount", format:"0.00", readonly:"^locked", box_c_width:"14rem"});
        fields.numberTextBox({id:"quantity", value:"^quantity", lbl:"Integer", dtype:"L", readonly:"^locked", box_c_width:"10rem"});
        fields.numberTextBox({id:"exact", value:"^exact", lbl:"Exact Decimal", dtype:"N", format:"0.00", readonly:"^locked", box_c_width:"16rem"});
        pane.p("^amount", {id:"amount-value", format:"0.00", dtype:"R"});
        pane.p("^exact", {id:"exact-value", format:"0.00", dtype:"N"});
        pane.dataSetter({destination_path:"amount",value:12.5});
        pane.dataSetter({destination_path:"quantity",value:3});
        pane.dataSetter({destination_path:"exact",value:Bag.fromTytx('{"exact":"9007199254740993.25::N"}').getItem('exact')});
        for (const [path,value] of [["live",false],["locked",false]]) pane.dataSetter({destination_path:path,value});
    }
}


export class Logic {}
