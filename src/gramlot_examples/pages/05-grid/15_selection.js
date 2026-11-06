import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main(
            {datapath:'sample', padding:'20px', max_width:'1080px', margin:'0 auto'});
        main_content.radioButtonText({value:'^.mode', values:'none:None,single:Single,multi:Multi',
            lbl:'selectionMode', margin_bottom:'12px'});
        const frame = main_content.frameGrid({storepath:'.rows', rowMode:'attributes', rowHeaders:true,
            selectionMode:'^.mode', selectedId:'^.id', selectedPkeys:'^.keys',
            selected_description:'^.names', height:'300px'});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'90px'});
        s.column({field:'description', name:'Description', width:'240px'});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'100px'});
        s.column({field:'price', name:'Unit price', dtype:'N', format:'0.00', width:'120px'});
        const facts = main_content.dl({margin_top:'12px'});
        facts.dt('selectedId');
        facts.dd('^.id');
        facts.dt('selectedPkeys');
        facts.dd('^.keys');
        facts.dt('selected_description');
        facts.dd('^.names');
        facts.dt('selectionLength');
        facts.dd('^.selectionLength');
    }
}
