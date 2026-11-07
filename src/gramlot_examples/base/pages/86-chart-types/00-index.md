# Charts · Value and chart types

> **What you learn** — Show one value, or a shape of data other than rows, with a chart element that has its own parameters.

## Start here

- **Gauges:** one value on a needle dial, a progress ring or a half-circle arc. Change the value, the range, the thresholds, the mask and the presentation, and watch the same Data drive every gauge.
- **Funnel:** pipeline stages in one measure, in the order of the rows.
- **Radar:** one polygon per row, one axis per measure.
- **Parallel coordinates:** one polyline per row, one vertical axis per measure.
- **Heatmap:** two categories and one measure as cell color.
- **Sankey:** links from a source column to a target column, with cycle detection.
- **Candlestick:** one candle per row from open, high, low and close.
- **Boxplot:** one box per row from min, q1, median, q3 and max.

The last seven are chart types of `chartView` (ECharts engine). Each page puts an editable grid beside the chart on the same Data Bag, so editing a cell updates the chart.

## How the gauge differs from `chartView`

`chartView` and `chartPane` draw the rows of a store. The gauge draws the Data they point at: the node value is the value, written as a Data pointer such as `^.cpu.load` or `^.cpu.load?percent`. It writes nothing back.

This family is experimental. Everything here is in the `charts` collection of the core, which the server provides to every page.
