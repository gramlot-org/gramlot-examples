import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main(
            {datapath:'sample', padding:'20px', max_width:'1080px', margin:'0 auto'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', searchOn:true,
            export:true, printRows:true, advancedTools:true, height:'340px'});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'90px'});
        s.column({field:'description', name:'Description', width:'240px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'100px'});
        s.column({field:'price', name:'Unit price', dtype:'N', format:'0.00', width:'120px'});
    }
}
