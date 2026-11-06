# Row tools · add, duplicate and delete

Three more switches of `frameGrid` change the rows of the store Bag:
`addrow`, `duprow` and `delrow`. They need an editable column, and `duprow` and
`delrow` also need a selection mode. `gridsemaphore` shows the editing status.

## Try it

- Select **Add row**. A row appears at the end with the description `New item` and
  quantity 1, the values of `addrow_defaults`. Double-click a cell to edit it.
- Select two rows (Ctrl/Cmd+click) and choose **Duplicate**. Each selected row is
  copied to a new row with a new identity.
- Select a row and choose **Delete**. The selected rows are removed.
- Watch the **Errors** and **Changes** counters at the end of the toolbar. Adding,
  duplicating or deleting a row increments **Changes**; an invalid value in an edited
  cell increments **Errors**.

## Read the code

```python
frame = main_content.frameGrid(
    datapath='sample', storepath='.rows', rowMode='attributes',
    selectionMode='multi', addrow=True,
    addrow_defaults={'description': 'New item', 'quantity': 1},
    duprow=True, delrow=True, gridsemaphore=True, height='340px')
```

Each tool is a toolbar command of the `grid` namespace: `grid:addrow`,
`grid:duprow` and `grid:delrow`. They change the row Bag, so formulas, totals and the
editing session see the new rows like any other change.

`gridsemaphore=True` adds an `editingStatus` to the toolbar. The frame becomes the
form whose session the grid uses, so the frame needs its own `datapath`; here it is
`sample`. Without an editable column, or without a selection mode for `duprow` and
`delrow`, the grid reports an error when it configures. Reloading the example restores
the sample Data: nothing is saved to a database.
