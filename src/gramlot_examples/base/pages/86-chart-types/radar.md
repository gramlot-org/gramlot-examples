# Radar

Compare products on five criteria.

## Try it

Edit a score in the grid. The polygon of that product moves on the axis of that criterion.

Each axis ends at the largest score in its column. **Speed** is different: its maximum is fixed at 10 in the series options, so lowering every speed score does not rescale it.

Empty a cell: the product loses its polygon. A polygon needs a value on every axis, and an empty vertex would sit at the center like a zero.

## Read the declarations

- Each row is one polygon. `captionField='product'` names it in the legend and the tooltip.
- Each measure is one axis. `measures` lists the criteria; the caption in `seriesOptions` is the axis name.
- `seriesOptions` may carry `min` and `max` for a measure. Without them the axis follows the data.
- The grid and the chart read the same `.rows` Bag, so an edit reaches both.
- Only the ECharts engine draws a radar.

## What this teaches

The measure columns decide the shape of the chart. Adding a numeric column to `measures` adds an axis.
