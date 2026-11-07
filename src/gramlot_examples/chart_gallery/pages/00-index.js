/** The introduction page of the chart gallery. */
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Chart gallery';

    main(root) {
        const main_content = root.main({padding:'24px', class:'gallery-directory-page'});
        main_content.h1(this.constructor.title);
        main_content.p('Chart types and chart engines, each beside an editable grid on the same Data. Start with Value and chart types: gauges, funnel, radar, parallel coordinates, heatmap, sankey, candlestick, boxplot, treemap and sunburst. Continue with simple charts, 3D charts and maps. Select a section title for an introduction; expand its arrow to choose a working example.');
        main_content.h2('Charts with grids');
        main_content.p('The lessons that connect charts to grids, and the live reports, are in the Charts section of the main gallery. ').a('Open the gallery', {href:'/gallery/', target:'_top'});
    }
}
