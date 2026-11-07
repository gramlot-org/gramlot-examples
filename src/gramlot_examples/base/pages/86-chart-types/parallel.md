# Parallel coordinates

Compare cars on five numeric axes.

## Try it

Edit a value in the grid. The line of that car bends at the axis of that column. Drag along an axis in the chart to brush the lines that pass through that range.

Empty a cell: the line has no point on that axis, never a zero.

## Read the declarations

- Each row is one polyline. `captionField='car'` is its name in the tooltip.
- Each measure in `measures` is one vertical axis, named by its caption in `seriesOptions`.
- `seriesOptions` may carry `min` and `max` for a measure; otherwise the axis follows the data.
- The chart and the grid read the same `.rows` Bag.
- Only the ECharts engine draws parallel coordinates.

## What this teaches

Axes with different units sit side by side because each one has its own scale. The chart shows how rows compare, not how large a total is.
