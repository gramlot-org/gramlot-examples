import {Page as BasePage} from '@gramlot/gramlot/page';
export class Page extends BasePage {
    static devices = ['desktop', 'tablet', 'phone'];
    main(root) {
        const main_content=root.main({class:'example-page stack'});
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
