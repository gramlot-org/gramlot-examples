# Sankey

Show a monthly budget as flows between nodes.

## Try it

Change an **Amount**. The link widens or narrows. Rename a **To** value: the node is renamed or a new node appears.

Make a loop, for example set **To** of the `Savings` → `Pension` row to `Salary`. The chart area shows an error naming the cycle. Undo the change and the chart returns.

Empty an amount: that link is left out, never drawn as zero.

## Read the declarations

- `captionField='source'` is the origin of a link and `secondCaptionField='target'` its destination. The single measure `amount` is its width.
- The nodes are the distinct names found in both columns. They are not declared anywhere else.
- A cycle cannot be drawn by a sankey. The chart reports it instead of staying blank.
- A negative amount is also an error.
- Only the ECharts engine draws a sankey.

## What this teaches

A chart can be built from rows that describe relations. The grid edits the relations and the chart derives the nodes.
