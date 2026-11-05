# Local Australian sales insights

This Python composition receives aggregated invoice data and a GeoJSON value.
It uses shared ChartPane, FrameGrid, Data Bags and standard bindings. It owns
no database connection, transport, browser DOM or rendering implementation.

The host supplies `sales_insights(root, dataset, geojson)`:

- `summary`: invoices, total, customers, first_date, last_date;
- `rows`: complete invoice-line count;
- `monthly`: month (YYYY-MM), revenue, invoices;
- `states`: territory (full name), revenue, invoices, customers;
- `state_year`: year, territory, revenue, invoices;
- `products`: top ten code, product, revenue, units, ordered by revenue descending.

The local 2026-11-04 snapshot reads all 410,429 lines and 60,179 invoices in
`gramlot_base_asqueel` under a read-only repeatable-read transaction. Invoice
totals, line totals, monthly totals, state totals and year/state totals reconcile
exactly at source decimal precision. Chart amounts are rounded to millions for
display; the map shows invoice counts in thousands. Source currency is not
asserted. No customer details, credentials or snapshot data are committed.

The page provides monthly evolution, Australian territory volumes, state totals,
top products with a detail grid, and a year/state grid feeding grouped 3D bars.
The latter follows the grid's standard search filter. Each chart uses the shared
configuration drawer. This is a snapshot, not live database querying or a public
catalogue entry. The host must reread the database to refresh it.

Natural Earth 1:50m administrative boundaries supply the geography (public domain).
Full state names match properties.name. Jervis Bay has no matching invoice rows;
it is not assigned invented sales. The shared renderer's automatic 3D framing
and geographic label contrast remain limitations; this page adds no local fixes.

Verified locally in Chromium and WebKit: all charts load without runtime errors,
the year filter updates the grid and shared chart, and the configurator changes
chart type. No publication or deployment.


## 2D choropleth comparison — 2026-11-04

The Australian map now defaults to the shared 2D map. Map measure selects 2025
billed total, 2025 distinct customers, billed per 2025 distinct customer, or
percentage change against 2024. The host supplies per-state/year distinct-customer
counts in state_year; territory_measures calculates each ratio from explicit annual
totals. Missing/zero comparison bases and zero customer denominators are rejected,
not presented as zero change. Other charts retain the full 2022–2025 period.

The map uses state abbreviations as labels, full names for matching and tooltips,
a numeric color legend, contrasting borders and preserved proportions. Signed
measures use a zero-centered red/white/blue scale. Ratios use Individual rows,
not a sum of ratios. map3D and its multi-measure grid remain available separately;
choosing a 2D measure does not rewrite that grid's selections.
