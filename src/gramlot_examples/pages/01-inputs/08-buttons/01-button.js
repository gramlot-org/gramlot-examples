import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = "Buttons: icons, labels and commands";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content=root.main({class:'example-page stack'});
        const actions=main_content.div({class:'card stack',max_width:'26rem'});
        actions.button('Confirm action',{id:'command-confirm',icon:'✓',action:"this.SET('result', 'Confirmed')",ask:'Run this command?'});
        actions.button('Delayed command',{id:'command-delay',_delay:300,action:"this.SET('result', 'Delayed: ' + _counter)"});
        actions.html_button('Plain HTML',{type:'button',id:'command-native',width:'fit-content',connect_onclick:"this.SET('result', 'Explicit HTML event')"});
        main_content.p('^result',{id:'command-result'});
    }
}
