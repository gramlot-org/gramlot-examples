import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static title = "Dropdown buttons and command menus";
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content=root.main({class:'example-page stack'});
        main_content.h1('Execute, or execute and remember');
        main_content.p('Click a menu entry to execute it. Hold Shift while selecting it to also change the main action and caption. Reload to verify persistence.');
        const actions=main_content.div({class:'card stack',max_width:'26rem'});
        const dropdown=actions.dropDownButton('Export',{id:'export-command',icon:'↓',persist:true,action:"this.SET('result', 'Default export')"});
        const menu=dropdown.menu();
        menu.menuline({caption:'Export CSV',code:'csv',id:'export-csv',action:"this.SET('result', 'CSV export')"});
        menu.menuline({caption:'Export PDF',code:'pdf',id:'export-pdf',action:"this.SET('result', 'PDF export')"});
        menu.menuline('-');
        menu.menuline({caption:'Unavailable',code:'unavailable',disabled:true,action:"this.SET('result', 'Unavailable')"});
        main_content.p('^result',{id:'dropdown-result'});
    }
}
