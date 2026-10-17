import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Checkbox as a switch';
    static devices = ['desktop', 'tablet', 'phone'];
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane = root.main({class:'example-page stack'});
        pane.h1('One boolean, two presentations');
        pane.p('Click a caption or focus the switch and press Space. Both controls share the same Data.');
        const fields = pane.formlet({columns:1,max_width:'26rem',lbl_position:'L'});
        fields.checkbox({id:'notifications-switch',value:'^enabled',lbl:'Notifications',label:'Email updates',mode:'switch',switch_color:'^switch_color',readonly:'^readonly',disabled:'^disabled'});
        fields.checkbox({id:'notifications-check',value:'^enabled',lbl:'Same boolean',label:'Email updates',readonly:'^readonly',disabled:'^disabled'});
        fields.checkbox({value:'^readonly',lbl:'Read only',mode:'switch'});
        fields.checkbox({value:'^disabled',lbl:'Disabled',mode:'switch'});
        pane.p('^enabled',{id:'enabled-value'});
        for(const [destination_path,value] of [['switch_color','purple'],['enabled',true],['readonly',false],['disabled',false]]) pane.dataSetter({destination_path,value});
    }
}
export class Logic {}
