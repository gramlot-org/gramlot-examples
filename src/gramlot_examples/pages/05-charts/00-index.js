import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) {
        root.h1("Charts");
        root.p("Data drives the picture: both rows and chart configuration live in the Data store. Change either Bag and the chart updates through bindings.");
        root.h2("Start with frameGrid");
        root.p("searchOn=True adds search. chart=True or a chart type adds the chart icon to the same toolbar. Each frame owns a datapath and its _chart configuration; storepath identifies the rows. Open Inspector to watch them change.");
        root.h2("Choose your route");
        root.p("Bars and trends: one Data store behind a grid and a chart. Time: monthly snapshots. Continue in Charts · Live reports for the original sine stream, Australian sales and state-to-suburb drilldown.");
        root.h2("Engines");
        root.p("ECharts: 2D, 3D and maps. Plotly: native 2D, 3D points, lines and surfaces, and 2D maps. Vega: bars, lines and pies. uPlot: lines with numeric or date X values. Libraries load when used; settings offer supported combinations.");
        root.h2("Read and experiment");
        root.p("Open the chart icon in the toolbar, then Chart settings. Filter the grid or change the input values. Code contains only the declarations; Explanation describes each choice and the adjacent TYTX supplies sample data. No database is required.");
        root.h2("Chart gallery");
        root.p("Pie and donut, scatter points, 3D charts, maps and the chart types (gauges, funnel, radar, heatmap, sankey and more) are in the chart gallery. ").a("Open the chart gallery", {href: "/chart_gallery/", target: "_top"});
    }
}
