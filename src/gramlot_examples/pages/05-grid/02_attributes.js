import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Rows as attributes";

    main(root) {
        const main_content = root.main({datapath:'sample', padding:'16px'});
        main_content.p("Inspect Data: the row value is empty and its fields are attributes. Zero and false remain visible.", {margin_top:0});
        const g = main_content.grid({id:"grid-02", storepath:".rows", rowMode:"attributes", height:"340px"});
        const s = g.struct();
        s.column({field:"description", name:"Description", width:"240px"});
        s.column({field:"quantity", name:"Quantity", dtype:"L", width:"105px"});
        s.column({field:"price", name:"Unit price", dtype:"N", format:"0.00", width:"120px"});
        s.column({field:"available", name:"Available", dtype:"B", width:"100px"});
    }
}
