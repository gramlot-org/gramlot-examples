import {Bag} from '@gramlot/gramlot';
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const options = 'MI:Milano,TO:Torino,CO:Como,PV:Pavia';
        const pane = root.div({max_width:'34rem',display:'grid',gap:'1rem',padding:'1rem'});
        pane.checkbox({value:'^locked',default:false,label:'Read only',id:'locked'});
        const inline = pane.groupBox({lbl:'Inline'});
        inline.comboBox({value:'^columns',values:'1,2,3',default:'2',lbl:'Columns',id:'columns',box_c_width:'6rem'});
        inline.checkBoxText({value:'^cities',values:options,cols:'==Number(columns)',columns:'^columns',readonly:'^locked',id:'channels'});
        const popup = pane.groupBox({lbl:'Popup'});
        popup.checkBoxText({value:'^cities',values:options,popup:true,readonly:'^locked',id:'channels-copy'});
        popup.code('^cities',{id:'city-codes'});
        root.dataRemote({destination_path:'documents',method:'document_choices',cacheTime:-1});
        const hierarchy = pane.groupBox({lbl:'Hierarchy'});
        hierarchy.checkBoxText({value:'^selected',values:'^documents',hierarchical:true,readonly:'^locked',id:'hierarchy-inline'});
        hierarchy.code('^selected',{id:'selected-paths'});
    }
    document_choices() {
        const choices = new Bag({manual:new Bag({guide:null,reference:null})});
        choices.setItem('manual.fixed',null,{checked:'disabled:on'});
        return choices;
    }
}
Page.registerEndpoint('document_choices');
