import {Page as BasePage} from '@gramlot/gramlot/page';
import grid from '../../gallery/dist/grid/descriptor.js';

export class Page extends BasePage {
    static title = "Multicolumn sort and row drag";
    static gramlots = [grid];

    main(root) {
        const main_content = root.main({datapath:'sample', padding:'16px'});
        main_content.p("Click Category for ascending. Shift-click Quantity to add it; Shift-click Quantity again for descending. Arrows show direction; numbers show priority. Drag a row to switch to manual order; the sort indicators clear.", {margin_top:0});
        const g = main_content.grid({id:"grid-04", storepath:".rows", rowMode:"attributes", height:"340px", rowHeaders:true, rowResize:true, selfDragRows:true});
        const s = g.struct();
        s.column({field:"description", name:"Description", width:"240px"});
        s.column({field:"category", name:"Category", width:"130px"});
        s.column({field:"quantity", name:"Quantity", dtype:"L", width:"105px"});
        s.column({field:"price", name:"Unit price", dtype:"N", format:"0.00", width:"120px"});
    }
}
