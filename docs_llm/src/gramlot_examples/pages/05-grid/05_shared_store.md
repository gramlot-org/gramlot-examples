# Two grids, one collection store

Two grids share the indexed order while keeping independent row heights.

## Try it

Sort or drag in either grid: both orders change. Resize one row: only that grid changes height.

## Read the code

Both grids use the same `.rows` Bag, so the runtime supplies the same resident collection store. Their column structures and row layouts are distinct. Sort Quantity in either grid or drag a row: both render the same new indexed order. Drag one row-number edge: the corresponding row in the other grid keeps its own height. Sorting by Category in the first grid also orders the second even though it does not display Category. This demonstrates a shared store, not independently ordered child stores.

The adjacent `_data.tytx` supplies the sample rows. The cells are read-only. Use the
gallery Settings to compare themes and light/dark mode. Reloading restores the
sample Data; these examples do not save to a server.
