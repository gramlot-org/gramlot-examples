# Treemap

Show a company budget, department > team > cost item, as nested rectangles.

## Try it

Pick a parent in the selector. The grid shows the children of that parent. Edit an **Amount** of a cost item: its rectangle and the rectangle of every parent above it change.

Empty an amount: that cost item is left out. A team whose items are all empty is left out too.

Pick **Engineering** and type an amount on a team row. The chart area shows an error that names the team: the value of a parent is the sum of its children, so a parent cannot carry the measure. Empty the cell and the chart returns.

Click a rectangle to drill down. The breadcrumb at the bottom walks back up.

## Read the declarations

- `rowMode='attributes'` is required. Each node carries `name` and `amount` as attributes. `rowMode='values'` shows an error.
- A node whose value is a Bag is a parent and its nested nodes are its children, at any depth. Any other node is a leaf.
- `measure='amount'` names the one measure. Only the leaves carry it. A negative leaf shows an error.
- The top-level nodes take one color each and their descendants inherit it.
- The chart reads the whole nested Bag. A change at any depth redraws it.
- Only the ECharts engine draws a treemap.

## What this teaches

A hierarchy is one nested Bag. The chart sums the branches. The grid edits one branch at a time, so each branch has its own grid and the selector shows one of them.
