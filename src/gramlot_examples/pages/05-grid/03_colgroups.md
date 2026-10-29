# Column groups and row heights

Group columns, display multiline notes and resize individual rows.

## Try it

Drag a column edge or a row-number edge. Move columns between visual positions: they keep their group membership.

## Read the code

`struct().colgroup(...)` declares named column groups. Colors use theme variables. The notes column uses `white_space='pre-wrap'`. `rowHeaders=True` generates row numbers; `rowResize=True` enables individual height changes. Drag a column edge to change its width in the Data struct, or drag a column to move it; its original group membership is retained. Drag the bottom edge of a row number to change height; double-click resets it.

The adjacent `_data.tytx` supplies the sample rows. The cells are read-only. Use the
gallery Settings to compare themes and light/dark mode. Reloading restores the
sample Data; these examples do not save to a server.
