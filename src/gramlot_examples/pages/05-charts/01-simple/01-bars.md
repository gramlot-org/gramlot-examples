# Bars and live data

Change North revenue, open Chart and observe the same Data in the grid and chart.

## Try it

Open **Chart** in the grid toolbar. Open **Chart settings** to choose compatible engines, types and measures. Search in the grid while the floating chart stays open: the chart follows the filtered rows. Clear search to restore them. Close and reopen the chart: your configuration is retained.

## Read the declarations

- `datapath="report"` gives this frame its own state scope. Its chart configuration is `report._chart`.
- `storepath=".rows"` reads the rows in that scope. `rowMode="values"` says each row is a Bag of field values.
- `searchOn=True` and `chart='bar'` create the shared toolbar controls. The example does not construct a search field or chart button.
- `chart_engine` and `chart_captionField` initialize the engine and category. Subsequent edits are held in `._chart`, not a separate application object.
- `frame.grid.struct()` and its columns describe how the same data appear in the grid. Numeric `dtype` declarations provide typed grid display and search.
- The adjacent TYTX contains the small dataset and initial measure selection. No database or bespoke RPC is needed.

## Observe reactivity

Change **North revenue** before or after opening Chart. The input writes directly to `report.rows.north.revenue`; the chart updates without a redraw call. Use Inspector to change the same Data value or `report._chart.chartType`: both paths use the same subscriptions.

## What this teaches

Bars compare prepared category values. Change the selected measures or choose horizontal/stacked bars in the shared settings. Vega supports basic bars; unsupported choices are not proposed.
