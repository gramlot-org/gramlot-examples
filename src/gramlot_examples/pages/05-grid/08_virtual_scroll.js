import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Scroll · 1,000 resident rows';
    main(root) {
        const main_content = root.main({datapath:'sample', padding:'20px', max_width:'1200px', margin:'0 auto'});
        main_content.p('GRID / SCROLL', {color:'var(--gramlot-text-secondary)', font_size:'11px', letter_spacing:'.12em', margin:'0 0 8px'});
        main_content.h2('A thousand rows, room to explore', {margin:'0 0 8px'});
        main_content.p('All 1,000 records are already loaded. Scroll freely, search a column or sort the whole collection.', {color:'var(--gramlot-text-secondary)', margin:'0 0 20px'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', searchOn:true, height:'420px'});
        frame.grid.setAttr({id:'grid-scroll-demo', rowHeaders:true, rowResize:true, selfDragRows:true});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'100px'});
        s.column({field:'description', name:'Description', width:'200px'});
        s.column({field:'category', name:'Category', width:'125px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'100px'});
        s.column({field:'notes', name:'Delivery notes', width:'300px', white_space:'pre-wrap'});
        main_content.p('Drag the scrollbar to the end: R1000 is the last record. Notes wrap naturally; drag below a row number to give that row more space.', {margin:'16px 0 8px'});
        main_content.p('Click Category, then Shift-click Quantity to combine sort directions. Search for R0999 to find a record that started outside the visible area. Clear to restore the view.', {color:'var(--gramlot-text-secondary)', margin:0});
    }
}
