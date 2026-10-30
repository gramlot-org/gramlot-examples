<a id="ge-db-grid-03"></a>
# Database grid · resident invoice rows

The Base copy comes from `test_invoice_pg_xl`: 60,179 invoices and 410,429 invoice
rows. This page queries `invc.invoice_row` through the existing Asqueel model.
The grid shows customer name and state, invoice number and date, product code
and description, quantity, unit price and total. Customer fields follow the
invoice relation; product fields follow the product relation. Prices and totals
are the stored invoice-row values, not the current product price or a recalculation.
The row ID remains in the data for identity and deterministic server ordering.

Choose 100, 500, 1,000, 2,000, 5,000, 10,000, 20,000, 50,000 or 100,000 records.
The default is 1,000. Changing the maximum starts a typed JSONL request and replaces the complete
resident Bag only after successful completion. Requested and loaded counts are displayed
separately. The table has enough rows to actually load 100,000 records.
Scrolling virtualizes the DOM only; search and multi-column sort use the full
resident selection. This is not partial database loading.

- Query measures query construction, execution, joins and complete fetch.
- Encode measures server-side TYTX/JSONL record encoding.
- Ready measures the request through transfer, decoding and client Bag creation,
  before Data publication and rendering.

The floating pane retains its title bar. Its FrameGrid, inset by 5px, owns the
search/limit/reload toolbar and the timing footer. Resizing, variable row heights
and per-grid sort/filter are provided by the existing shared components.
The database connection is read-only. A failed reload reports an error and retains
the last successful selection. Model definitions live in gramlot-py-server;
`gramlot_examples/base/model.json` specifies the common physical subset.


Current loading path — owner, 2026-10-30: complete resident selections use typed
JSONL, sharing the loader/query with the JSONL lesson. Query, Encode and Ready
replace the previous whole-endpoint timing. Ready excludes final rendering.
Reload and a changed limit cancel/supersede the previous request; only a complete
valid selection replaces the visible Bag. The floating layout, row geometry,
local filtering and sorting are retained.
