import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main({datapath:'sample', padding:'20px', max_width:'1000px', margin:'0 auto'});
        main_content.button('Open floating grid', {action:"this.SET('.open', true)"});
        const window = main_content.floatingPane({id:'grid-floating-window', title:'1,000 resident rows', open:'^.open', width:'780px', height:'460px', movable:true, resizable:true, maximizable:true});
        window.frame.center.setAttr({display:'flex', flex_direction:'column', min_height:0, min_width:0, overflow:'hidden', padding:'5px'});
        const frame = window.frame.center.frameGrid({storepath:'.rows', rowMode:'attributes', searchOn:true, id:'grid-floating-frame', flex:1, min_height:0, min_width:0, border:'1px solid var(--gramlot-border)', overflow:'hidden'});
        frame.grid.setAttr({id:'grid-floating-demo', rowHeaders:true, rowResize:true, selfDragRows:true});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'90px'});
        s.column({field:'description', name:'Description', width:'180px'});
        s.column({field:'notes', name:'Delivery notes', width:'260px', white_space:'pre-wrap'});
    }
}
