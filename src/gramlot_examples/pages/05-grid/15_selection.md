# Selection · none, single and multi

A grid selects rows according to `selectionMode`. The radio group above the grid
writes the mode to Data, and the grid reads it. The list below the grid shows what
the grid publishes.

## Try it

- Choose **Multi** (the default). Click a row, then Ctrl/Cmd+click another to toggle
  it, and Shift+click to select the range from the first one. Ctrl/Cmd+A selects
  every visible row.
- Read **selectedPkeys**: the identities of the selected rows, in the order of the
  selection. **selectedId** is the current row. **selected_description** lists the
  distinct descriptions. **selectionLength** counts the selected rows.
- Choose **Single**. A click selects one row and Up/Down move the current row.
  The rows already selected stay selected until the next click.
- Choose **None**. The selection is cleared, clicks select nothing and the list
  stays empty.
- Sort a header, or search with a filter that excludes a selected row: a sort keeps
  the selection, while a row that leaves the view leaves the selection.

## Read the code

```python
frame = main_content.frameGrid(
    storepath='.rows', rowMode='attributes', rowHeaders=True,
    selectionMode='^.mode', selectedId='^.id', selectedPkeys='^.keys',
    selected_description='^.names', height='300px')
```

The identity of a row is its node label (`r1`, `r2`, ...). A publication path is
written only when the grid declares it: `selectedId`, `selectedPkeys` and the
family `selected_<field>` are given here. `selectionLength` is always written, next
to the other grid paths. Other paths such as `selectedIndex`, `selectedRowidx`,
`selectedNodes` and `selectedRowData` work the same way.

The grid declares `selectionMode` and `selected_<field>`, so `frameGrid` routes
them to the grid without a prefix. The paths are relative to the container
`datapath`, so the page below the grid reads them with `^.id`, `^.keys`, `^.names`
and `^.selectionLength`. Selection is never counted as an editing change.
