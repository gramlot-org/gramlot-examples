import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = 'Dropdown commands and persistence';
    static devices = ['desktop', 'tablet', 'phone'];
    static css = ['/themes/gramlot-base/theme.css'];
    main(root) {
        const pane=root.main({class:'example-page stack'});
        pane.h1('Execute, or execute and remember');
        pane.p('Click a menu entry to execute it. Hold Shift while selecting it to also change the main action and caption. Reload to verify persistence.');
        const actions=pane.div({class:'card stack',max_width:'26rem'});
        const dropdown=actions.dropDownButton('Export',{id:'export-command',icon:'↓',persist:true,action:"this.SET('result', 'Default export')"});
        const menu=dropdown.menu();
        menu.menuline('Export CSV',{code:'csv',id:'export-csv',action:"this.SET('result', 'CSV export')"});
        menu.menuline('Export PDF',{code:'pdf',id:'export-pdf',action:"this.SET('result', 'PDF export')"});
        menu.menuline('-');
        menu.menuline('Unavailable',{code:'unavailable',disabled:true,action:"this.SET('result', 'Unavailable')"});
        pane.p('^result',{id:'dropdown-result'});
        pane.dataSetter({destination_path:'result',value:'No command yet'});
    }
}
export class Logic {}
