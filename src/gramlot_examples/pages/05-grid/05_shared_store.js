import {Page as BasePage} from '@gramlot/gramlot/page';
import grid from '../../gallery/dist/grid/descriptor.js';
import layout from '../../gallery/dist/layout/descriptor.js';

export class Page extends BasePage {
    static title = 'Two grids, independent views';
    static gramlots = [layout, grid];
    main(root) {
        const main_content = root.main({datapath:'sample', padding:'16px'});
        main_content.p('Same data, independent views. Sort, search or drag in either grid: the other keeps its own order and filter.', {margin_top:0});
        main_content.p('Click a header: ascending, then descending. Shift-click adds a column; Shift-click it again reverses only that column. Arrows show direction; 1, 2 show priority.');
        main_content.button('Toggle Linen chair quantity: 12 / 0', {id:'shared-update', action:'toggleQuantity'});
        main_content.p('The button changes one shared record: it remains in Furniture, but leaves the second view when its quantity becomes zero.');
        main_content.h3('Furniture — initially Category ↑, Quantity ↓');
        const first = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', searchOn:true, height:'270px'});
        first.grid.setAttr({id:'grid-shared-first', rowHeaders:true, rowResize:true, selfDragRows:true,
            sortedBy:'category:a,quantity:d', filter:{value:'^Furniture$',columns:['category'],dtype:'T'}});
        this.columns(first.grid.struct());
        main_content.h3('Quantity ≥ 2 — initially Quantity ↓, Unit price ↑');
        const second = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', searchOn:true, height:'270px'});
        second.grid.setAttr({id:'grid-shared-second', rowHeaders:true, rowResize:true, selfDragRows:true,
            sortedBy:'quantity:d,price:a', filter:{value:'>= 2',columns:['quantity'],dtype:'L'}});
        this.columns(second.grid.struct());
    }
    columns(struct) {
        struct.column({field:'description',name:'Description',width:'240px'});
        struct.column({field:'category',name:'Category',width:'130px'});
        struct.column({field:'quantity',name:'Quantity',dtype:'L',width:'105px'});
        struct.column({field:'price',name:'Unit price',dtype:'N',format:'0.00',width:'120px'});
    }
}

export class Logic {
    toggleQuantity(node) {
        const row = node.GET('.rows').getNode('r3');
        row.setAttr({quantity:row.getAttr('quantity') === 0 ? 12 : 0});
    }
}
