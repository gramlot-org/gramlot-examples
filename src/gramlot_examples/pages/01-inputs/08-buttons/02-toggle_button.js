import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = "Toggle buttons and selection state";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content=root.main({class:'example-page stack'});
        main_content.h1('One button, one boolean');
        main_content.p("Toggle Enabled and compare the checkbox: both edit the same boolean. Read only prevents changes; Disabled also removes the command from normal interaction.");
        const fields=main_content.formlet({columns:1,max_width:'26rem',lbl_position:'L'});
        fields.toggleButton('Enabled',{default: false, id:'toggle-command',value:'^enabled',readonly:'^readonly',disabled:'^disabled',action:"this.SET('result', this.GET('enabled') ? 'Enabled' : 'Disabled')"});
        fields.checkbox({value:'^enabled',lbl:'Same Data',id:'toggle-checkbox'});
        fields.checkbox({default: false, value:'^readonly',lbl:'Read only'});
        fields.checkbox({default: false, value:'^disabled',lbl:'Disabled'});
        main_content.p('^result',{id:'toggle-result'});
    }
}
