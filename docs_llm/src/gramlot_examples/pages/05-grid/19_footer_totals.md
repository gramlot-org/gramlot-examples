# Footer totals

A footer row sums columns. `footer='Totals'` shows the row with a caption, and
`totalize=True` on a column sums its field.

## Try it

- Read the footer: the total quantity and the order total, formatted with
  `footer_format='0.00'`.
- Below the grid, **Order total** is a page element reading the same sum from
  `^.totalize.total` in Data.
- Search for `lamp`. The grid shows two rows, but the footer and the page total
  do not change: totals cover every row of the store, not only the displayed ones.
- Open Inspector and find `sample.totalize`. The grid writes one path for each
  totalized column.

## Read the code

```python
frame = main_content.frameGrid(
    storepath='.rows', rowMode='attributes', footer='Totals', searchOn=True, height='340px')
s.column('quantity', dtype='L', totalize=True)
s.column('total', dtype='N', formula='quantity * price', calculated=True,
         totalize=True, footer_format='0.00')
main_content.div().span('^.totalize.total', dtype='N', format='0.00')
```

`footer=True` shows the row without a caption. `totalize=True` publishes the sum to
`.totalize.<field>` relative to the grid Source. A text value, `totalize='.summary.done'`,
gives another Data path. Totals are published also when no footer row is shown.
Booleans count as 0 and 1.

`footer_value` sets a fixed footer text for a column. A total that cannot be
computed is published as null and shown as a dash with the error as tooltip.
Totals of filtered rows are not published.
