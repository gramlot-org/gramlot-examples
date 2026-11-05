import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const pane = root.div({datapath:'sample', max_width:'56rem'});
        for (const [caption,choice] of [['Tutti',''],['John','john'],['John e Fred','john,fred']]) {
            pane.button(caption, {action:"this.SET('.setFilter', choice)",choice});
        }
        const frame = pane.frameGrid({storepath:'.customers',rowMode:'attributes',
                                      searchOn:'Customer:name',height:'350px'});
        frame.grid.setAttr({id:'column-facets',columnFilters:true,setFilter:'^.setFilter'});
        const struct = frame.grid.struct();
        for (const [field,title] of [['john','John'],['fred','Fred']]) {
            struct.column({field,name:title[0],title,width:'40px',align:'center',
                           check:'multiple',checked:'^.sets.'+field,checkedField:'id'});
        }
        struct.column({field:'name',name:'Customer',width:'180px'});
        struct.column({field:'city',name:'City',width:'150px'});
        struct.column({field:'category',name:'Category',width:'150px'});
        struct.column({field:'joined',name:'Joined',dtype:'D',width:'130px'});
    }
}
