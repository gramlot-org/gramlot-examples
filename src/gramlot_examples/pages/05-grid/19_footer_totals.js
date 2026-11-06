import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main(
            {datapath:'sample', padding:'20px', max_width:'1080px', margin:'0 auto'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', footer:'Totals',
            searchOn:true, height:'340px'});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'90px'});
        s.column({field:'description', name:'Description', width:'200px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'100px', totalize:true});
        s.column({field:'price', name:'Unit price', dtype:'N', format:'0.00', width:'110px'});
        s.column({field:'total', name:'Total', dtype:'N', format:'0.00', width:'120px',
            formula:'quantity * price', calculated:true, totalize:true, footer_format:'0.00'});
        const summary = main_content.div({margin_top:'12px'});
        summary.span('Order total: ');
        summary.span('^.totalize.total', {dtype:'N', format:'0.00', font_weight:'600'});
    }
}
