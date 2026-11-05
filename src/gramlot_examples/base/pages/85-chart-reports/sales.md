# Australian sales

> **What you learn** — Compare live annual sales in a grid, map and bar chart.

The host supplies `SalesCharts` and Australian state geometry. `load_report` delegates to that existing provider; its annual query computes totals and comparisons on the server. Search the grid to filter both charts. Select a year, then Reload. An empty year leaves configuration intact; a failed comparison preserves the last successful report. The loaded period belongs to the returned data, not merely the selector.

`ChartReportPage` is shared by this page and the two row-representation examples. Its implementation is in `gramlot_examples/base/chart_report.py`; this reuse is intentional.
