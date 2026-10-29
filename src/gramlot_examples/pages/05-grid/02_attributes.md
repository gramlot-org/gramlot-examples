# Rows as attributes

Read the same kind of records from node attributes, with typed numeric and boolean cells.

## Try it

Inspect Data: the row value is empty and its fields are attributes. Zero and false remain visible.

## Read the code

`rowMode='attributes'` reads fields from each row node's attributes. `dtype='L'`, `dtype='N'` and `dtype='B'` declare integers, numbers and booleans. The price format changes display only: sort still uses the original number. Compare the zero quantity and the false availability flag with Data.

The adjacent `_data.tytx` supplies the sample rows. The cells are read-only. Use the
gallery Settings to compare themes and light/dark mode. Reloading restores the
sample Data; these examples do not save to a server.
