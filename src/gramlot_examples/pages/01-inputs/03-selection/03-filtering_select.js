import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Search a list and select a value";
    main(root) {
        const main_content = root.main({class:"example-page stack"});
        main_content.h1("Filtering select");
        main_content.p("Search a caption, store its code. Two fields share the same choice and the same list.");
        const options = main_content.details({max_width: "24rem"});
        options.summary("Options · change the behavior");
        const controls = options.formlet({class: "stack",width:"100%",max_width:"24rem"});
        controls.checkbox({default: false, id:"locked",value:"^locked",lbl:"State",label:"Read only"});
        const fields = main_content.formlet({class:"card stack",width:"100%",max_width:"24rem"});
        fields.filteringSelect({id:"choice",value:"^choice",values:"^choices",lbl:"Delivery",readonly:"^locked",box_c_width:"16rem",placeholder:"Type part of a caption"});
        fields.filteringSelect({id:"choice-copy",value:"^choice",values:"^choices",lbl:"Same choice",readonly:"^locked",box_c_width:"16rem"});
        main_content.p("Selected code:");
        main_content.p("^choice",{id:"choice-value"});
    }
}
