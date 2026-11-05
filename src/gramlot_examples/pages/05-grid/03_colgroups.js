import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {

    main(root) {
        const main_content = root.main({datapath:'sample', padding:'16px'});
        const g = main_content.grid({id:"grid-03", storepath:".rows", rowMode:"attributes", height:"340px", rowHeaders:true, rowResize:true});
        const s = g.struct();
        s.column({field:"description", name:"Description", width:"240px"});
        const stock = s.colgroup({code:"stock", name:"Stock", background:"var(--gramlot-action)", color:"var(--gramlot-surface)"});
        stock.column({field:"category", name:"Category", width:"130px"});
        stock.column({field:"quantity", name:"Quantity", dtype:"L", width:"105px"});
        stock.column({field:"available", name:"Available", dtype:"B", width:"100px"});
        const details = s.colgroup({code:"details", name:"Details", background:"var(--gramlot-success)", color:"var(--gramlot-surface)"});
        details.column({field:"price", name:"Unit price", dtype:"N", format:"0.00", width:"120px"});
        details.column({field:"notes", name:"Notes", width:"300px", white_space:"pre-wrap"});
    }
}
