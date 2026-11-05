import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        const pane = root.div({max_width:'36rem'});
        const frame = pane.frameGrid({storepath:'product.suppliers',rowMode:'attributes',
                                     searchOn:'Supplier:supplier_name',height:'240px'});
        frame.grid.setAttr({id:'primary-supplier'});
        const columns = frame.grid.struct();
        columns.column({field:'primary',name:'',title:'Primary supplier',width:'32px',align:'center',
                        check:'single',checked:'^product.primary_supplier_id',
                        checkedField:'supplier_id'});
        columns.column({field:'supplier_name',name:'Supplier'});
        pane.code('^product.primary_supplier_id',{lbl:'Selected ID'});
    }
}
