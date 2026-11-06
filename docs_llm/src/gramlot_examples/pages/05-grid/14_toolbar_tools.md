# Toolbar tools · export, print and line numbers

One FrameGrid over eight order lines. Three Boolean switches add toolbar tools:
`export=True`, `printRows=True` and `advancedTools=True`. Each tool is a toolbar
command that reaches the grid of its frame.

## Try it

- Type `lamp` in the search field. Two rows remain.
- Open the download icon (its tooltip is **Export**) and choose **CSV**. The browser downloads `grid.csv` with the two
  visible rows in view order, the column captions first and the values as the grid
  shows them.
- Sort Unit price in descending order, clear the search and export **JSON**. The file
  is an array of objects keyed by field, with raw values, in the sorted order.
- Export **TYTX**, **XML** and **Excel**. TYTX and XML keep the row labels. Excel
  writes numbers as numeric cells.
- Select **Print**. The browser prints the visible rows as a plain table.
- Open the **…** menu (**Advanced tools**) and select **Line numbers**. The row numbers appear;
  select it again to hide them. The menu repeats Export and Print.

## Read the code

```python
frame = main_content.frameGrid(
    storepath='.rows', rowMode='attributes', searchOn=True,
    export=True, printRows=True, advancedTools=True, height='340px')
```

`export=True` offers CSV, JSON, TYTX, XML and Excel. A list such as
`export='csv,json'` restricts the formats. The file name is the grid label plus the
format extension. Only visible rows and visible columns are exported, so a search,
a sort or a column filter changes the file.

`printRows` and `advancedTools` follow the same pattern as `searchOn`: a switch on
the frame composes a toolbar `menuline` whose command belongs to the `grid`
namespace. `grid:lineNumbers` toggles `rowHeaders`. A literal value changes the
grid Source; a `^` pointer writes Data instead.

The sample rows are in the adjacent `_data.tytx`, with exact Decimal prices.
Nothing is sent to a server.
