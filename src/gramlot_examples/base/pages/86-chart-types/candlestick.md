# Candlestick

Follow a share over twenty trading days.

## Try it

Edit a price in the grid. The candle of that day moves.

Empty a cell: the day disappears from the chart. An empty price is no price, it is never drawn as zero.

## Read the declarations

- Each row is one candle. `captionField='day'` is the category on the horizontal axis, in the order of the rows.
- `valueFields='open,high,low,close'` lists exactly four measures, in that order. Any other count shows an error that names the order.
- `upColor` and `downColor` in the `seriesOptions` of the first measure set the candle colors. Without them ECharts uses its own.
- The grid and the chart read the same `.rows` Bag, so an edit reaches both.
- Only the ECharts engine draws a candlestick.

## What this teaches

The order of `valueFields` carries the meaning of each measure. The chart type does not look at the column names.
