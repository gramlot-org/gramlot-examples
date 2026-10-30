import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = "Basic grid \u00b7 Bag values";

    main(root) {
        const main_content = root.main({datapath:'sample', padding:'16px'});
        main_content.p("Compare each visible row with the sample Data. This is the smallest grid: storepath, rowMode and a declared struct.", {margin_top:0});
        const g = main_content.grid({id:"grid-01", storepath:".rows", rowMode:"values", height:"340px"});
        const s = g.struct();
        s.column({field:"code", name:"Code", width:"90px"});
        s.column({field:"description", name:"Description", width:"240px"});
        s.column({field:"quantity", name:"Quantity", dtype:"L", width:"105px"});
    }
}
