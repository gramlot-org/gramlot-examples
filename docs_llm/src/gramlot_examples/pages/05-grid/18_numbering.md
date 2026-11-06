# Numbering and running sums

Three formulas are not stored in the rows. Each grid computes them on its own visible
rows, in its own order:

- `#` is the row number, from 1.
- `+=total` is the running sum of `total`.

`%=total` is different: it is each row's percentage of the column total over every
row, and it is written into the row Bag like a normal formula.

## Try it

- Read the **#** column and the **Running** column: the running sum grows
  row by row and ends at the order total.
- Sort Unit price descending. The numbers restart from 1 in the new order and the
  running sum accumulates in that order.
- Type `lamp` in the search field. The two visible rows are numbered 1 and 2 and the
  running sum restarts. The cells of these two columns take a different
  background: they number the visible rows only. The row-header numbers of a
  grid with `rowHeaders=True` behave the same way.
- Clear the search. The numbers return to 1..8 and the background disappears.
- **% of total** does not change with the search: it covers every row.

Sorting or searching by `#` or by the running sum is an error, because these values
derive from the order and are not stored fields; clicking their headers does not sort.

## Read the code

```python
s.column('position', name='#', formula='#')
s.column('total', dtype='N', formula='quantity * price', calculated=True)
s.column('running', dtype='N', formula='+=total')
s.column('share', dtype='N', formula='%=total', calculated=True)
```

A formula that depends on a view value is also a view value. The distinct background
is the theme color `--gramlot-grid-filtered-numbering-background`. Two grids on the
same rows would each show their own numbering.
