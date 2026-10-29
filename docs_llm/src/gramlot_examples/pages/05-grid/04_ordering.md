# Multicolumn sort and row drag

Sort raw Bag values with multiple criteria, then set a manual row order.

## Try it

Click Category, then Shift-click Quantity. Compare equal categories. Drag a row to switch to manual order; the sort indicators clear.

## Read the code

Click Category, then Shift-click Quantity: each category has its own ascending quantities. Click again to reverse direction. Numbers sort as numbers, including 2 and 12. A sort computes `rowidx` on the Bag nodes; it does not reorder the physical Bag. Drag a row before or after another: `selfDragRows=True` asks the same store to update indices and clear the active sort. In Inspector, compare physical node order, `rowidx`, and the containing node's `sortedBy` attribute.

The adjacent `_data.tytx` supplies the sample rows. The cells are read-only. Use the
gallery Settings to compare themes and light/dark mode. Reloading restores the
sample Data; these examples do not save to a server.
