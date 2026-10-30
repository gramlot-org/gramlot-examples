<a id="ge-db-grid-02"></a>
# Database grid · resident customers

This is a real read-only PostgreSQL query against `gramlot_base_asqueel`, physical
table `invc.invc_customer`, accessed through Asqueel model `invc.customer`.
The maximum-records selector offers 100, 500, 1,000, 2,000, 5,000, 10,000,
20,000, 50,000 and 100,000. Changing it runs a new RPC; the default is 1,000.
The endpoint returns at most that many records, ordered by account name and ID.
The status bar distinguishes requested and actually loaded counts. With the
current 3,200-row table, requesting 5,000 or more returns 3,200 rows.
It uses the same existing connection configuration as the Base selector lessons.
No database data is generated or changed by this example.

The page starts a `dataRpc`, places the complete result in `.selection`, and binds
the Grid to `.selection.rows`. Reload from DB repeats the query. Scrolling only
changes the rendered slice of the resident Bag; sort and search operate locally
on all returned records. The floating frame has 5px insets and owns its search
and reload toolbar. Row heights and the ordinal column remain resizable.

- **Query**: elapsed time for query construction, execution and complete fetch.
- **Server**: elapsed time from endpoint entry through session release and Bag
  construction. Includes Query; it is not an additional duration to sum.
- Response serialization, network transfer and browser rendering are excluded.

Times use Python's monotonic `perf_counter`, are returned as numeric Data values,
and are formatted using the browser locale. Repeated loads may benefit from
connection and database caches; they are observations, not a benchmark guarantee.
A failed reload retains the last successful selection and reports failure.
