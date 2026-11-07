# Boxplot

Compare the score distribution of five teams.

## Try it

Edit a statistic in the grid. The box of that team changes.

Make a row decrease, for example a Q1 above the median: the chart shows an error that names the team.

Empty a cell: the team disappears from the chart.

## Read the declarations

- Each row is one box. `captionField='group'` is the category on the horizontal axis.
- `chartBoxplot` takes one attribute per statistic: `min`, `q1`, `median`, `q3` and `max`. Here they name the columns `minimum`, `q1`, `median`, `q3` and `maximum`. All five are required.
- The chart does not compute statistics. Raw data is not accepted: the host supplies the five values per box.
- The grid and the chart read the same `.rows` Bag, so an edit reaches both.
- Only the ECharts engine draws a boxplot.

## What this teaches

A boxplot is drawn from summary values. Computing them from raw samples belongs upstream of the chart.
