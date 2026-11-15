# Charts

> **What you learn** — Connect one Data store to grids and charts, change configuration through bindings, compare engines, and animate signals and snapshots.

A chart has **two inputs in the Data store**: the rows to display and the configuration describing how to display them. They are both Bags. Changing either input updates the chart through Gramlot's reactive bindings: edit a value, change a measure or axis, filter the grid, or replace rows received from a server. Application actions do not need to call a redraw method.

`frameGrid` uses `storepath` for the rows and its own `datapath` for interface state. `chart=True` adds the chart icon to its existing toolbar. `chart="bar"` also chooses the initial type. `chart_*` supplies initial configuration; the live configuration lives at `._chart` below the frame's datapath. Existing configuration is retained when the window closes and reopens. Each frameGrid needs a distinct datapath, even when several frames share the same row store.

`searchOn=True` adds search to the same toolbar. The chart follows that grid's filtered view. Search does not delete rows from the original Bag. Open Inspector to compare rows, `._chart` and Source while trying the examples.

## Choose a route

- **Bars and trends:** one Data store behind a grid and a chart, including Australian sales.
- **Time:** advance through prepared monthly sales snapshots.

## Chart gallery

Pie and donut, scatter points, 3D bars and surfaces, maps and the chart types (gauges, funnel, radar,
parallel coordinates, heatmap, sankey, candlestick, boxplot, treemap and sunburst) are in the
[chart gallery](/chart_gallery/). The chart gallery links back to this gallery.

## Engines

| Engine | Implemented use in Gramlot | Try it here |
| --- | --- | --- |
| ECharts | 2D charts, Cartesian 3D and geographic views; 3D loads ECharts GL | Bars and trends; shares, 3D bars and maps in the chart gallery |
| Plotly | Native 2D charts, scatter/line/surface 3D and 2D maps | Engine comparisons; numeric 3D in the chart gallery |
| Vega | Bars, lines and pie charts | Change engine in a simple chart |
| uPlot | Lines with a numeric or date X field | Trends with numeric sample positions |

These are implemented adapter capabilities, not every feature offered by the external libraries. Engines load when used. The shared settings show compatible choices; unsupported external configuration is reported rather than silently converted. 3D requires browser WebGL support.

## Read the code

Python and JavaScript declare the same interface. Initial sample rows and optional configuration are in the adjacent `_data.tytx` file, so generated data does not obscure the lesson. Open **Explanation** for the role of every declaration. Measurements are prepared upstream: the renderer does not calculate business totals or group records for you. All these examples work without a database.


## Continue with the original live reports

The configured server gallery also exposes **Charts · Live reports**: Australian sales, daily/monthly snapshots, state-to-suburb drilldown, the rolling sine stream and both Bag row representations. These use the original providers and examples; database and geography requirements are documented in that section.
