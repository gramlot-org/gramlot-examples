import {Page as BasePage} from "@gramlot/gramlot/page";
export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    static locale = 'it-IT';
    main(root) {
        const main_content = root.main({class:'example-page stack'});
        const group = main_content.groupBox({id:'customer-group',lbl:'Customer',datapath:'customer',copy:true,max_width:'44rem'});
        const fields = group.formlet({col_min_width:'18rem',lbl_position:'L',box_c_width:'100%'});
        fields.textbox({value:'^.name',lbl:'Name'});
        fields.dateTextBox({value:'^.date',lbl:'Date',format:'short'});
        fields.numberTextBox({value:'^.amount',lbl:'Exact amount',dtype:'N'});
        fields.checkbox({default: true, value:'^.enabled',lbl:'Active'});
        const other = main_content.groupBox({lbl_value:'^other.kind',lbl_values:'internal:Internal note,public:Public note',datapath:'other',lbl_variant:'underline',max_width:'24rem'});
        other.textbox({value:'^.note',lbl:'Note',box_c_width:'100%'});
    }
}
