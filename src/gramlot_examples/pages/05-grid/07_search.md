# Search · text, numbers and dates

One FrameGrid, eight sample products and one search control. The rounded field
contains the column selector, search icon and an internal clear button. The clear
button appears only while there is text. The column label has a separate subtle
background; focus uses a neutral border without an outer halo. Click the circled
information icon for instructions suited to the selected column.

## Try it

| Choose | Type | Result |
| --- | --- | --- |
| All columns | `lamp` | Brass lamp and Desk lamp |
| Product | `lamp\|desk` | Brass lamp, Oak desk and Desk lamp |
| Category | `^Furniture$` | The four furniture records |
| Quantity | `> 2` | Four products with more than two units |
| Quantity | `= 0` | Pendant light |
| Unit price | `<= 100` | Brass lamp, Desk lamp and Wall light |
| Updated | `>= 2026-10-15` | Five products updated on or after October 15 |

Text is a case-insensitive regular expression. A plain word searches anywhere;
`^` and `$` anchor its start/end, and `|` means either alternative. **All columns**
searches their displayed text. A selected number/date column compares its raw Bag
value, using `=`, `>`, `>=`, `<`, `<=` or `!` (not equal).

Use decimal punctuation and local dates from your browser locale; ISO dates are
also accepted. No locale is forced by this page. The input stays visually empty until you type. Click **Search instructions** (the
circled i) for the syntax of the selected column; click outside or press Escape
to dismiss the instructions.

Type `>` alone in Quantity: an explanation appears and the last valid result
stays visible. Finish the comparison to apply it. The internal **×** or **Escape**
clears the input and restores all rows. Switching columns clears the old query.
Sorting a header, searching and then clearing preserves the current sort.

## Read the code

```python
frame = pane.frameGrid(
    storepath='.rows', rowMode='attributes', searchOn=True, height='330px')
s = frame.grid.struct()
s.column('description', name='Product')
s.column('quantity', name='Quantity', dtype='L')
s.column('price', name='Unit price', dtype='N')
s.column('updated', name='Updated', dtype='D')
```

`searchOn=True` enables All columns plus the declared columns. Use
`searchOn='Product:description,Stock:quantity'` for a restricted menu with your
own captions, or `searchOn='*LRN'` for numeric columns only.

The accepted filter and derived `filtered` positions belong to this grid's
collection view. The original Bag records are shared and unchanged. Search is
resident and does not send a query to a server. The adjacent `_data.tytx` stores
the sample data; Python and JavaScript author equivalent Source. The lesson adds
no application-local filtering, event handlers or duplicate component styling.
