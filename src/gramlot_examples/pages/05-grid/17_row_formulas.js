import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main(
            {datapath:'sample', padding:'20px', max_width:'1080px', margin:'0 auto'});
        main_content.numberTextBox({value:'^.vat', lbl:'VAT %', dtype:'N', format:'0.00', live:true,
            box_c_width:'10rem', margin_bottom:'12px'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', height:'340px'});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'90px'});
        s.column({field:'description', name:'Description', width:'200px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'90px', edit:true});
        s.column({field:'price', name:'Unit price', dtype:'N', format:'0.00', width:'110px', edit:true});
        s.column({field:'total', name:'Total', dtype:'N', format:'0.00', width:'110px',
            formula:'quantity * price', calculated:true});
        s.column({field:'tax', name:'VAT amount', dtype:'N', format:'0.00', width:'110px',
            formula:'total * vat / 100', formula_vat:'^.vat', calculated:true});
        s.column({field:'gross', name:'Gross', dtype:'N', format:'0.00', width:'110px',
            formula:'total + tax', calculated:true});
    }
}
