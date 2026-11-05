# Points and surfaces

Compare a numeric lattice as a surface, 3D points or 3D lines.

## Try it

Open **Chart** in the grid toolbar. Open **Chart settings** to choose compatible engines, types and measures. Search in the grid while the floating chart stays open: the chart follows the filtered rows. Clear search to restore them. Close and reopen the chart: your configuration is retained.

## Read the declarations

- `datapath="report"` gives this frame its own state scope. Its chart configuration is `report._chart`.
- `storepath=".rows"` reads the rows in that scope. `rowMode="values"` says each row is a Bag of field values.
- `searchOn=True` and `chart='surface'` create the shared toolbar controls. The example does not construct a search field or chart button.
- `chart_engine` and `chart_captionField` initialize the engine and category. Subsequent edits are held in `._chart`, not a separate application object.
- `frame.grid.struct()` and its columns describe how the same data appear in the grid. Numeric `dtype` declarations provide typed grid display and search.
- The adjacent TYTX contains the small dataset and initial measure selection. No database or bespoke RPC is needed.

## What this teaches

X and Y are numeric coordinates on a complete small lattice; Height is the supplied Z value. Compare Surface, Scatter 3D and Line 3D with Plotly or ECharts. Surface shows the provided samples, not a business aggregation.
