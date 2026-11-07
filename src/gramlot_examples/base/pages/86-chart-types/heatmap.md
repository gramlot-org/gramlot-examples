# Heatmap

Show activity by weekday and hour.

## Try it

Edit a number in **Events**. The cell of that day and hour changes color, and the color scale follows the new minimum and maximum of the data.

Empty a cell: that square stays blank, never colored as zero.

## Read the declarations

- `captionField='day'` is the X category and `secondCaptionField='hour'` is the Y category. Both come from the rows.
- The single measure `events` is the color of the cell. The scale runs from the smallest to the largest value present.
- The color of the scale comes from the `color` of the measure in `seriesOptions`.
- Two rows with the same day and hour are an error shown in the chart area. Prepare one row per pair.
- Only the ECharts engine draws a heatmap.

## What this teaches

The grid lists one row per cell; the chart arranges them in two dimensions. No pivot is computed.
