# Basic grid · Bag values

Start with three columns and a Bag whose row values are Bags.

## Try it

Compare each visible row with the sample Data. This is the smallest grid: storepath, rowMode and a declared struct.

## Read the code

`rowMode='values'` reads each field from the row's nested Bag. `storepath='.rows'` is relative to `datapath='sample'`. Three `struct().column(...)` calls declare the visible fields. No frame, toolbar or application event handler is needed.

The adjacent `_data.tytx` supplies the sample rows. The cells are read-only. Use the
gallery Settings to compare themes and light/dark mode. Reloading restores the
sample Data; these examples do not save to a server.
