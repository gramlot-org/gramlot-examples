import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Toggle button with LED';
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content=root.main({class:'example-page stack'});
        main_content.h1('A boolean command with an LED');
        const fields=main_content.formlet({columns:1,max_width:'26rem',lbl_position:'L'});
        fields.toggleButton('Enabled',{id:'toggle-command',value:'^enabled',readonly:'^readonly',disabled:'^disabled',action:"this.SET('result', this.GET('enabled') ? 'Enabled' : 'Disabled')"});
        fields.checkbox({value:'^enabled',lbl:'Same Data',id:'toggle-checkbox'});
        fields.checkbox({value:'^readonly',lbl:'Read only'});
        fields.checkbox({value:'^disabled',lbl:'Disabled'});
        main_content.p('^result',{id:'toggle-result'});
        for(const [destination_path,value] of [['enabled',false],['readonly',false],['disabled',false],['result','No command yet']]) main_content.dataSetter({destination_path,value});
    }
}
