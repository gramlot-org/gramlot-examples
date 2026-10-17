import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'GroupBox and typed copy';
    static devices = ['desktop', 'tablet', 'phone'];
    static css = ['/themes/gramlot-base/theme.css'];
    static locale = 'it-IT';
    async main(root) {
        const {Bag} = await import('@gramlot/gramlot');
        const pane = root.main({class:'example-page stack'});
        pane.h1('A group with its own Data scope');
        pane.p('The copy icon writes TYTX. Use the arrow beside it to choose JSON instead.');
        const group = pane.groupBox({id:'customer-group',lbl:'Customer',datapath:'customer',copy:true,max_width:'44rem'});
        const fields = group.formlet({col_min_width:'18rem',lbl_position:'L',box_c_width:'100%'});
        fields.textbox({value:'^.name',lbl:'Name'});
        fields.dateTextBox({value:'^.date',lbl:'Date',format:'short'});
        fields.numberTextBox({value:'^.amount',lbl:'Exact amount',dtype:'N'});
        fields.checkbox({value:'^.enabled',lbl:'Active',mode:'switch'});
        const other = pane.groupBox({lbl:'Outside the copied group',datapath:'other',lbl_variant:'underline',max_width:'24rem'});
        other.textbox({value:'^.note',lbl:'Note',box_c_width:'100%'});
        pane.p('JSON is values-only: use TYTX when types and Bag node attributes must survive the round trip.');
        const typed = Bag.fromTytx('{"date":"2026-10-17::D","amount":"1234.50::N"}');
        for(const [destination_path,value] of [['customer.name','Ada'],['customer.date',typed.getItem('date')],
            ['customer.amount',typed.getItem('amount')],['customer.enabled',true],['other.note','This text is not copied']]) pane.dataSetter({destination_path,value});
    }
}
export class Logic {}
