import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main(
            {datapath:'sample', padding:'20px', max_width:'1080px', margin:'0 auto'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes',
            searchOn:true, height:'340px'});
        const s = frame.grid.struct();
        s.column({field:'position', name:'#', width:'60px', formula:'#'});
        s.column({field:'description', name:'Description', width:'200px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'90px'});
        s.column({field:'price', name:'Unit price', dtype:'N', format:'0.00', width:'110px'});
        s.column({field:'total', name:'Total', dtype:'N', format:'0.00', width:'110px',
            formula:'quantity * price', calculated:true});
        s.column({field:'running', name:'Running', dtype:'N', format:'0.00', width:'110px',
            formula:'+=total'});
        s.column({field:'share', name:'% of total', dtype:'N', format:'0.0', width:'110px',
            formula:'%=total', calculated:true});
    }
}
