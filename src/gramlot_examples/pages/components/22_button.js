import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Button commands';
    static devices = ['desktop', 'tablet', 'phone'];
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane=root.main({class:'example-page stack'});
        pane.h1('One shared command engine');
        pane.p('Confirm the action, or click the delayed command several times: only the last burst is delivered.');
        const actions=pane.div({class:'card stack',max_width:'26rem'});
        actions.button('Confirm action',{id:'command-confirm',icon:'✓',action:"this.SET('result', 'Confirmed')",ask:'Run this command?'});
        actions.button('Delayed command',{id:'command-delay',_delay:300,action:"this.SET('result', 'Delayed: ' + _counter)"});
        actions.html_button('Plain HTML',{type:'button',id:'command-native',connect_onclick:"this.SET('result', 'Explicit HTML event')"});
        pane.p('^result',{id:'command-result'});
        pane.dataSetter({destination_path:'result',value:'No command yet'});
    }
}
export class Logic {}
