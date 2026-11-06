<a id="ge-db-grid-03"></a>
# Grid on a database query

> **What you learn** — Put the result of a server query in Data and show it in a grid: `dataRpc` → `.selection` → grid bound to `.selection.rows`.

The page reads `invc.invoice_row` from the read-only copy of `test_invoice_pg_xl`
(60,179 invoices, 410,429 invoice rows) through the existing Asqueel model.

## Three steps

1. **`dataRpc`** calls the endpoint `load_rows` when the page starts, when
   **Max rows** changes (`limit="^.limit"`) and when **Reload** fires `.reload`.
   The endpoint runs one query and returns a Bag: `rows`, `count` and `requested`.
2. **`.selection`** receives that Bag (`result_path=".selection"`). The status bar
   binds to `.selection.requested` and `.selection.count`.
3. **The grid** is a `frameGrid` with `storepath=".selection.rows"`. Each record is
   one row whose fields are node attributes (`rowMode="attributes"`).

The columns come from relations of the invoice row: customer name and state follow
`@invoice_id.@customer_id`, invoice number and date follow `@invoice_id`, product
code and description follow `@product_id`. Quantity, unit price and total are the
stored invoice-row values.

## Resident data

All returned rows stay in the browser. Scrolling renders only the visible slice;
search and multi-column sort work on every loaded row without a new query. Choose
100 to 100,000 rows (default 1,000) to see how the size of the selection changes
loading and searching. A failed reload reports the error and keeps the last
selection.

## Read the code

`main` connects `dataRpc` to `.selection` and the grid to its rows; `searchOn=True`
puts the search field in the grid toolbar. `status_bar` declares the status,
**Max rows** and **Reload** below the grid; `columns` declares the columns.
`load_rows` is the endpoint; `read_records` in `gramlot_examples/base/selection_trial.py`
holds the query and validates the limit.
