# Multicolumn sort and row drag

Sort raw Bag values with multiple criteria, then set a manual row order.

## Try it

Click Category, then Shift-click Quantity. Compare equal categories. Drag a row to switch to manual order; the sort indicators clear.

## Read the code

Numbers sort as raw Bag numbers, including 2 and 12. Sorting computes an index keyed by the original nodes in this grid's collection view; it never reorders or annotates the business Bag. Drag a row before or after another: `selfDragRows=True` asks the same view to update its index and clear its active sort. Another grid over the same Bag keeps its own index and criteria.

The adjacent `_data.tytx` supplies the sample rows. The cells are read-only. Use the
gallery Settings to compare themes and light/dark mode. Reloading restores the
sample Data; these examples do not save to a server.

For mixed directions: click Category (ascending), Shift-click Quantity (ascending),
then Shift-click Quantity again (descending). Header arrows show direction and
numbers show priority. These requests affect only this grid view.
