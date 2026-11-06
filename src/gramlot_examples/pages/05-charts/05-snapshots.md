# Charts and time

`chartPane` builds the shared chart and its settings. `storepath` identifies the
original rows Bag; `configpath` identifies its configuration Bag. Both live in Data.
The adjacent TYTX supplies prepared monthly sales and the initial configuration,
so the page contains only the component declaration. No database is required.

Open **Chart settings** to change the engine, chart type, category, selected
measures, colors and axes. Only types implemented by that engine are offered.
External engines load when selected. Configuration and rows are not copied into
an application-owned chart implementation.

The initial category is Region and the measure is Revenue. In Temporal animation,
choose Month and use Play, Pause, Previous, Next or the slider. Rows are already
prepared by month: the chart does not calculate business aggregates. Axes retain
stable ranges while playing. Off shows the full selection.

Compare ECharts, Plotly and Vega. For uPlot choose Lines and Rank as the category:
uPlot requires a numeric X axis. An unsupported configuration remains visible
with an explanatory error; it is not silently converted.

The chart retains its configuration when the Data Bag changes. This example
teaches chart configuration and temporal playback; geographic data preparation
and database queries belong to their separate host examples.
