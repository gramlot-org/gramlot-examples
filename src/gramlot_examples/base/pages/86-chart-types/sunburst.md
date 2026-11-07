# Sunburst

Show a company budget, department > team > cost item, as concentric rings.

## Try it

Pick a parent in the selector. The grid shows the children of that parent. Edit an **Amount** of a cost item: its arc and the arcs of every parent above it change.

Empty an amount: that cost item is left out. A team whose items are all empty is left out too.

Pick **Engineering** and type an amount on a team row. The chart area shows an error that names the team: the value of a parent is the sum of its children, so a parent cannot carry the measure. Empty the cell and the chart returns.

Click an arc to zoom into it. Click the center to go back.

## Read the declarations

- `rowMode='attributes'` is required. Each node carries `name` and `amount` as attributes. `rowMode='values'` shows an error.
- A node whose value is a Bag is a parent and its nested nodes are its children, at any depth. Any other node is a leaf.
- `measure='amount'` names the one measure. Only the leaves carry it. A negative leaf shows an error.
- The top-level nodes take one color each and their descendants inherit it. The top level is the first ring, the center holds the root.
- The chart reads the whole nested Bag. A change at any depth redraws it.
- Only the ECharts engine draws a sunburst.

## What this teaches

The same nested Bag draws a treemap or a sunburst: only the element changes, `chartTreemap` or `chartSunburst`. The hierarchy belongs to the data, not to the chart.
