# Two grids, independent views

The grids display the **same Bag nodes** through two independent collection views.
The first starts with Furniture only, ordered by Category ascending and Quantity
descending. The second starts with Quantity >= 2, ordered by Quantity descending
and Unit price ascending.

## Try it

- Search, sort or drag rows in one grid. The other keeps its own filter and order.
- Click **Toggle Linen chair quantity**. Both views see the same updated record:
  at zero it remains in Furniture and leaves the quantity-filtered view. Toggle
  again to bring it back. No record was copied or deleted by filtering.
- Resize a row: its height belongs to that grid, too.
- Clear one search: only that view reveals all rows, retaining its current order.

## Mixed ascending and descending order

1. Click **Category**: ascending, priority 1.
2. Shift-click **Quantity**: ascending, priority 2.
3. Shift-click **Quantity** again: descending, still priority 2.

The result is **Category ↑ 1, Quantity ↓ 2**. A plain click chooses a single
sort column; Shift-click preserves the others. Each active header shows its arrow
and priority number. Enter/Space on a focused header has the same behavior,
including Shift. Dragging a row switches only that view to manual order.

## Read the code

Both frameGrid declarations use `.rows`. Each grid Source owns a
`BagCollectionView`; the parent `BagCollectionStore` supplies the original nodes
and their change notifications. Sort indices and filters are not stored on the
shared business nodes. The grid struct remains ordinary Data.

`sortedBy` and `filter` are declarative requests. The example supplies different
initial values; reactive bindings can issue later requests by changing those
values. Current interactive criteria belong to the view and do not write back
to these parameters. Filter numeric/date parsing inherits the browser locale.

The cells remain read-only. The button uses a normal Logic method to change the
shared Bag. Reload restores the sample rows and the two initial views; there is
no database save or remote filtering in this example.
