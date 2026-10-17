import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Combo box";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("Combo box");
        pane.p("Choose a suggested city or enter a different one. Two fields share the same text; suggestions do not restrict what you can write.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.comboBox({id:"choice",value:"^choice",values:"^choices",lbl:"City",readonly:"^locked",box_c_width:"16rem",placeholder:"Choose or type a city"});
        fields.comboBox({id:"choice-copy",value:"^choice",values:"^choices",lbl:"Same city",readonly:"^locked",box_c_width:"16rem"});
        pane.dataSetter({destination_path:"choices",value:"Rome,Paris,Berlin"});
        pane.dataSetter({destination_path:"choice",value:"Rome"});
        pane.p("Stored text:");
        pane.p("^choice",{id:"choice-value"});
        pane.dataSetter({destination_path:"locked",value:false});
    }
}

export class Logic {}
