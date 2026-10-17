import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Filtering select";
    static css = ["/themes/gramlot-base/theme.css"];
    main(root) {
        const pane = root.main({class:"example-page stack"});
        pane.h1("Filtering select");
        pane.p("Search a caption, store its code. Two fields share the same choice and the same list.");
        const controls = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        controls.checkbox({id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = pane.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.filteringSelect({id:"choice",value:"^choice",values:"^choices",lbl:"Delivery",readonly:"^locked",box_c_width:"16rem",placeholder:"Type part of a caption"});
        fields.filteringSelect({id:"choice-copy",value:"^choice",values:"^choices",lbl:"Same choice",readonly:"^locked",box_c_width:"16rem"});
        pane.dataSetter({destination_path:"choices",value:"standard:Standard,express:Express,pickup:Pick up"});
        pane.dataSetter({destination_path:"choice",value:"express"});
        pane.p("Selected code:");
        pane.p("^choice",{id:"choice-value"});
        pane.dataSetter({destination_path:"locked",value:false});
    }
}

export class Logic {}
