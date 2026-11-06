import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const main_content = root.main({padding:'20px', max_width:'1080px', margin:'0 auto'});
        const frame = main_content.frameGrid({datapath:'sample', storepath:'.rows', rowMode:'attributes',
            rowHeaders:true, selectionMode:'multi', addrow:true,
            addrow_defaults:{description:'New item', quantity:1},
            duprow:true, delrow:true, gridsemaphore:true, height:'340px'});
        const s = frame.grid.struct();
        s.column({field:'code', name:'Code', width:'90px', edit:true});
        s.column({field:'description', name:'Description', width:'240px', edit:true});
        s.column({field:'quantity', name:'Quantity', dtype:'L', width:'100px', edit:true});
        s.column({field:'price', name:'Unit price', dtype:'N', format:'0.00', width:'120px', edit:true});
    }
}
