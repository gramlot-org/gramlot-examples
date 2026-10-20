import {Page as BasePage, createDecimal} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'GroupBox and typed copy';
    static devices = ['desktop', 'tablet', 'phone'];
    static locale = 'it-IT';
    main(root) {
        const main_content = root.main({class:'example-page stack'});
        main_content.h1('A group with its own Data scope');
        main_content.p('The copy icon writes TYTX. Use the arrow beside it to choose JSON instead.');
        const group = main_content.groupBox({id:'customer-group',lbl:'Customer',datapath:'customer',copy:true,max_width:'44rem'});
        const fields = group.formlet({col_min_width:'18rem',lbl_position:'L',box_c_width:'100%'});
        fields.textbox({value:'^.name',lbl:'Name'});
        fields.dateTextBox({value:'^.date',lbl:'Date',format:'short'});
        fields.numberTextBox({value:'^.amount',lbl:'Exact amount',dtype:'N'});
        fields.checkbox({value:'^.enabled',lbl:'Active'});
        const other = main_content.groupBox({lbl:'Outside the copied group',datapath:'other',lbl_variant:'underline',max_width:'24rem'});
        other.textbox({value:'^.note',lbl:'Note',box_c_width:'100%'});
        main_content.p('JSON is values-only: use TYTX when types and Bag node attributes must survive the round trip.');
        for(const [destination_path,value] of [['customer.name','Ada'],['customer.date',new Date(Date.UTC(2026,9,17))],
            ['customer.amount',createDecimal('1234.50')],['customer.enabled',true],['other.note','This text is not copied']]) main_content.dataSetter({destination_path,value});
    }
}
