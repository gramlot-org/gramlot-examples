import inputs from '../../../gallery/dist/inputs/descriptor.js';
import layout from '../../../gallery/dist/layout/descriptor.js';
import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static gramlots = [inputs, layout];
    static title = "Arrange fields with formlet";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class:'example-page stack'});
        main_content.h1('One layout, shared label settings');
        main_content.p('Change the columns. The fields keep their values and their own label overrides.');
        const controls = main_content.formlet({class:'card stack',max_width:'24rem'});
        controls.html_label('Columns',{for:'columns'});
        const select = controls.select({default: "2", id:'columns',value:'^columns',width:'6rem'});
        select.option('One',{value:'1'});select.option('Two',{value:'2'});
        const fields = main_content.formlet({id:'fields',columns:'^columns:=Number({})',datapath:'customer',
            lbl_position:'L',lbl_text_align:'right',box_c_width:'100%',max_width:'44rem',gap:'10px 16px'});
        fields.textbox({id:'first-name',value:'^.name',lbl:'Name'});
        fields.textbox({value:'^.surname',lbl:'Surname'});
        fields.textbox({value:'^.city',lbl:'City'});
        fields.checkbox({default: true, value:'^.enabled',lbl:'Active'});
        fields.textBoxArea({value:'^.notes',lbl:'Notes (override)',lbl_position:'TL',rows:2});
        main_content.p('^customer.name',{id:'accepted-name'});
    }
}
