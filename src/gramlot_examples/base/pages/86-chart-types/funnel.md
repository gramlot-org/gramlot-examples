# Funnel

Show the stages of a sales pipeline as a funnel.

## Try it

Edit a number in the **Deals** column: double-click the cell, type, press Enter. The funnel redraws with the new width. Empty a cell: that stage disappears from the funnel; it is never drawn as zero. Type `0` to draw a zero.

The stages keep the order of the rows. The chart does not sort them.

## Read the declarations

- `frameGrid(storepath='.rows', rowMode='values')` and `chartFunnel(storepath='.rows', rowMode='values')` read the same Data Bag. A cell edit writes that Bag and both redraw.
- `chartFunnel` takes `captionField` as the stage name and one measure: `measure='deals'` names it.
- `seriesOptions='^.options'` holds the caption of the measure (`Deals`) shown in the tooltip.
- A negative value is an error shown in the chart area.
- Only the ECharts engine draws a funnel.

## What this teaches

A chart type changes how the same rows are drawn. The data, the grid and the bindings stay the same.
