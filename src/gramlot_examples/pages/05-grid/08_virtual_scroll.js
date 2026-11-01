import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Scroll · 1,000 resident rows';
    main(root) {
        const main_content = root.main({datapath:'sample', padding:'20px', max_width:'1200px', margin:'0 auto'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', searchOn:true, height:'420px'});
        frame.grid.setAttr({id:'grid-scroll-demo', rowHeaders:true, rowResize:true, selfDragRows:true});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'100px'});
        s.column({field:'description', name:'Description', width:'200px'});
        s.column({field:'category', name:'Category', width:'125px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'100px'});
        s.column({field:'notes', name:'Delivery notes', width:'300px', white_space:'pre-wrap'});
    }
}
