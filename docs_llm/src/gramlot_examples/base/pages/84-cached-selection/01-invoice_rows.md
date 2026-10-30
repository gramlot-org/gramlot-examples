<a id="ge-db-grid-cached-01"></a>
# Asqueel only · cached invoice rows

The grid reads invoice rows joined to customers, invoices and products from the
XL local Base copy. Choose up to 500,000 rows; the fixture contains 410,429.

Up to the configured threshold (default 1,000 actual rows), the selection loads
completely. Above it, Asqueel materializes a numbered snapshot in its cache schema.
The browser normally retains only 200 rows. Scroll requests another window;
replies replace the small Bag. Headers and row numbers describe the server total.

Click a column header to sort; click again to reverse it. Shift-click another
header adds a criterion. Arrows and numbers show direction and priority. Search
requires all words to occur across the text columns; it runs on the server and
is different from typed numeric/date searchOn. Both reset the scroll to the start.

Timings show count, materialization, first window ready, server window read,
scroll-to-ready, server search, search-to-ready and server sort. Client ready
excludes paint; search total includes the 200 ms debounce. First-window latency
is not full-selection transfer time. The JSONL lesson remains available for complete resident selections.

The cache is per page and cleaned on close; Reload rebuilds the snapshot. An
abrupt server exit requires explicit cache cleanup. Unloaded row heights are
estimated. This experiment disables manual row resize/reorder and has no edits.
