# Charts · Live reports

> **What you learn** — Use the existing server reports with the shared chart configurator. Both configuration and displayed rows live in Data: changes reach the charts through ordinary bindings.

## Start here

- **Australian sales:** annual database totals, one grid and two charts observing its filtered view. Compare revenue, distinct customers, per-customer revenue and annual change.
- **Sales over time:** server-prepared daily or monthly snapshots with stable playback axes. Temporal navigation selects snapshots; it does not aggregate business records in the renderer.
- **States and suburbs:** click a state, inspect ABS suburb boundaries, then return to Australia. Year, measure and grid search remain selected.
- **Attribute rows / Value rows:** the same report contract with both Bag row representations, including empty results and failed requests.

## Engines and reactivity

ECharts provides 2D, 3D and geographic views; Plotly provides 2D, numeric 3D and geographic views; Vega supports the implemented bars, lines and pies; uPlot handles numeric/time line signals. Engines load when used. The configurator offers supported combinations. 3D requires WebGL.

A chart reads the rows Bag and its configuration Bag. Changing either updates the view. Filtering the grid changes the shared view without deleting source rows. Independent charts keep independent configuration over that same store.

## Server prerequisites

The sales pages use the existing read-only PostgreSQL/Asqueel provider, Australian state geometry and ABS SAL 2021 locality files. These are the original database reports, not replacement fixtures. The two explicitly named row fixtures are deterministic qualification examples. No invoice application is included.

The common **Charts** section introduces the components with smaller lessons. These live reports extend that section with the original end-to-end cases. Detach Example, Explanation and Code to inspect them side by side.
