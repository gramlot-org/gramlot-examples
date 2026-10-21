import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Checkbox as a switch';
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content = root.main({class:'example-page stack'});
        main_content.h1('One boolean, two presentations');
        main_content.p('Click a caption or focus the switch and press Space. Both controls share the same Data.');
        const fields = main_content.formlet({columns:1,max_width:'26rem',lbl_position:'L'});
        fields.checkbox({id:'notifications-switch',value:'^enabled',lbl:'Notifications',label:'Email updates',mode:'switch',switch_color:'^switch_color',readonly:'^readonly',disabled:'^disabled'});
        fields.checkbox({id:'notifications-check',value:'^enabled',lbl:'Same boolean',label:'Email updates',readonly:'^readonly',disabled:'^disabled'});
        fields.checkbox({value:'^readonly',lbl:'Read only',mode:'switch'});
        fields.checkbox({value:'^disabled',lbl:'Disabled',mode:'switch'});
        main_content.p('^enabled',{id:'enabled-value'});
        for(const [destination_path,value] of [['switch_color','purple'],['enabled',true],['readonly',false],['disabled',false]]) main_content.dataSetter({destination_path,value});
    }
}
