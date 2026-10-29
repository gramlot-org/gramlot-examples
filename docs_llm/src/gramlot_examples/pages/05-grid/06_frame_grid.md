# FrameGrid

The frame joins a read-only grid to ordinary command bars. Change the theme,
colors or light/dark mode in the **gallery Settings**: the page follows the
gallery without its own theme selector.

## Try it

- Click a column header to sort; Shift-click adds criteria with visible priorities.
- Drag a row to set manual order. This changes store indices and clears the sort,
  while the physical Bag node order remains unchanged.

- Scroll horizontally through Order details, Delivery and Alternatives. The
  scrollbar belongs to the rows, below the headers.
- Use **Update first price**: the command reaches the central grid and updates
  its first row in the Data Bag. **Remove last row** also updates the count.
- Narrow the preview. The shared toolbar moves its action group into overflow.
- Drag a column header to move it. It keeps its original group: the colored band
  splits into contiguous runs and joins again when its columns become adjacent.
- Drag a header's right edge to resize; Escape cancels the preview. Arrow keys on
  the resize handle adjust width; Alt+Arrow on the header moves the column.
- Notes use the legacy `white_space='pre-wrap'` property. Group `background` and
  `color` use palette variables, so the bands follow the gallery theme.
- Drag the bottom edge of a row number to adjust that individual row height.
  Double-click or Home restores automatic height; ArrowUp/Down adjust it and
  Escape cancels an active drag. Other rows and grids keep their own heights.
- Open Code to compare the short `main`, the column structure and the bars.

## Read the code

`frameGrid(...)` returns an ordinary frame. `frame.grid.struct()` declares the
columns; `frame.top` and `frame.bottom` hold `menu(presentation='bar')`. Groups,
spacers and command routing are the same mechanisms as the other toolbar lessons.

The adjacent `_data.tytx` contains twelve sample orders as row attributes.
`rowMode='attributes'` makes this explicit. The amounts are sample fields; `rowHeaders=True` generates the row numbers
with the shared header style and keeps them in sequence after removal. The small update handler recalculates its sample amounts;
this does not introduce a general grid formula engine.

The struct is ordinary Data: `view_0.rows_0` holds the ordered cell nodes and
`info.columnsets` holds group definitions. Each cell retains its `columnset`
reference; resizing writes its `width`. The nested Python declaration is consumed
by the data setter into this legacy representation. There is no separate order
array, and changes are visible in the gallery Inspector.

`rowResize=True` enables these gestures. Manual heights belong to this grid
instance and reset when the example is reloaded; the shared data is unchanged.

The row values are not directly editable. Selection, frozen columns, filters and a configurator
are not part of this first version. Reloading the example restores its sample
Data; the buttons do not save to a database.
