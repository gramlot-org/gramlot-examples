import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.chartPane({storepath:'sales.rows', configpath:'sales.chart',
                        id:'sales-chart', height:'560px'});
    }
}
