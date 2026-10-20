import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Combo box";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Combo box");
        main_content.p("Choose a suggested city or enter a different one. Two fields share the same text; suggestions do not restrict what you can write.");
        const controls = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.comboBox({id:"choice",value:"^choice",values:"^choices",lbl:"City",readonly:"^locked",box_c_width:"16rem",placeholder:"Choose or type a city"});
        fields.comboBox({id:"choice-copy",value:"^choice",values:"^choices",lbl:"Same city",readonly:"^locked",box_c_width:"16rem"});
        main_content.dataSetter({destination_path:"choices",value:"Rome,Paris,Berlin"});
        main_content.dataSetter({destination_path:"choice",value:"Rome"});
        main_content.p("Stored text:");
        main_content.p("^choice",{id:"choice-value"});
        main_content.dataSetter({destination_path:"locked",value:false});
    }
}
