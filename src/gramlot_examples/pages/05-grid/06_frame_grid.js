import {Page as BasePage} from '@gramlot/gramlot/page';
import layout from '../../gallery/dist/layout/descriptor.js';
import grid from '../../gallery/dist/grid/descriptor.js';
import commands from '../../gallery/dist/menu-trial/descriptor.js';

export class Page extends BasePage {
    static title = 'FrameGrid · complete example';
    static gramlots = [layout, grid, commands];

    main(root) {
        const main_content = root.main({padding:'12px', height:'100%', min_height:0});
        const frame = main_content.frameGrid({searchOn:true, datapath:'orders', storepath:'.rows', rowMode:'attributes',
            height:'calc(100vh - 24px)', id:'orders-frame', border:'1px solid var(--gramlot-border)',
            border_radius:'var(--gramlot-radius-sm)', overflow:'hidden'});
        frame.grid.setAttr({id:'orders-grid', rowHeaders:true, rowResize:true, selfDragRows:true, selfsubscribe_updateFirst:'updateFirst', selfsubscribe_removeLast:'removeLast'});
        this.columns(frame.grid.struct());
        this.bars(frame);
    }
    columns(struct) {
        struct.column({field:'description',name:'Description',width:'240px'});
        const details=struct.colgroup({code:'details',name:'Order details',background:'var(--gramlot-action)',color:'var(--gramlot-surface)'});
        details.column({field:'quantity',name:'Qty',dtype:'L',width:'52px'});
        details.column({field:'price',name:'Unit price',dtype:'N',format:'0.00',width:'94px'});
        details.column({field:'product',name:'Product',width:'84px'});
        details.column({field:'total',name:'Total',dtype:'N',format:'0.00',width:'92px'});
        details.column({field:'netTotal',name:'Net total',dtype:'N',format:'0.00',width:'92px'});
        const delivery=struct.colgroup({code:'delivery',name:'Delivery',background:'var(--gramlot-success)',color:'var(--gramlot-success-background)'});
        delivery.column({field:'notes',name:'Delivery notes',width:'320px',white_space:'pre-wrap'});
        delivery.column({field:'language',name:'Lang.',width:'54px',align:'center'});
        delivery.column({field:'method',name:'Delivery',width:'154px'});
        const alternatives=struct.colgroup({code:'alternatives',name:'Alternatives',background:'var(--gramlot-warning)',color:'var(--gramlot-warning-background)'});
        alternatives.column({field:'alternative',name:'Alternative',width:'140px'});
        alternatives.column({field:'contact',name:'Contact',width:'120px'});
    }
    bars(frame) {
        const top=frame.top.menu({presentation:'bar',aria_label:'Order commands',padding:'4px 8px',labelPosition:'tooltip',iconSize:20,background:'var(--gramlot-surface-subtle)'});
        const title = top.menuline({group:true, overflowable:false, gap:'10px'});
        const symbol = title.svg({viewBox:'0 0 24 24', width:22, height:22, fill:'none',
            stroke:'currentColor', stroke_width:'1.6', aria_hidden:'true'});
        symbol.path({d:'M12 3 3 7.5v9L12 21l9-4.5v-9L12 3ZM3 7.5l9 4.5 9-4.5M12 12v9M7.5 5.25l9 4.5'});
        title.strong('Studio orders', {font_size:'1.08em'});
        top.spacer({flex:1});
        const actions=top.menuline({group:true,priority:20});
        actions.menuline('gridExample:updateFirst',{id:'orders-update'});
        actions.menuline('gridExample:removeLast',{id:'orders-remove'});
        frame.dataFormula({result_path:'.count',formula:'rows.getNodes().length',rows:'^.rows',_onBuilt:true});
        const bottom=frame.bottom.menu({presentation:'bar',aria_label:'Order status',padding:'4px 8px'});
        const count=bottom.menuline({group:true,overflowable:false});
        count.span('^.count',{id:'orders-count'});count.span('rows · Read only');
        bottom.spacer({flex:1});
        bottom.menuline({group:true,priority:10}).span('^.status',{id:'orders-status'});
    }
}

/** Commands reach the central grid; their state is ordinary page Data. */
export class Logic {
    updateFirst(node) {
        const first=node.GET('.rows').getNodes()[0];
        if (!first) return;
        const {quantity}=first.getAttr();
        first.setAttr({price:99.5,total:quantity*99.5,netTotal:quantity*99.5});
        node.SET('.status','First row updated');
    }
    removeLast(node) {
        const rows=node.GET('.rows'), last=rows.getNodes().at(-1);
        if (!last) return;
        rows.popNode(last.label);node.SET('.status','Last row removed');
    }
}
