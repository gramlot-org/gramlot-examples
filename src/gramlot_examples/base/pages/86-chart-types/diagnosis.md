# When a chart cannot be drawn

Take away a column that a chart needs and see what replaces it.

## Try it

Set **Close column** to None. The candlestick needs four measures: in place of the chart a notice says that it received three. Press **More info**: the dialog says what is wrong, what was expected, what was received and how to fix it, then lists the columns the candlestick reads.

Set **Bar measures** to None. A bar chart with no measures draws nothing, so it says so.

Set **Close column** to Volume. The chart is drawn again: the element only checks that each role has a column, not what the column means.

## Read the declarations

- `chartCandlestick(open=…, high=…, low=…, close='^.close')`: each measure is its own attribute. Here `close` follows a Data path, so the select changes it.
- `chartBar(measures='^.measures')`: a list of measures, comma separated.
- The Builder rejects an element without a required attribute. A value that arrives at run time, like an empty `close`, is checked when the chart is drawn.
- An error notice has a red icon; a notice that only informs, such as no data to display, has a grey one.

## What this teaches

A chart that is not drawn always says why. The explanation comes from the syntax that each chart type declares.
