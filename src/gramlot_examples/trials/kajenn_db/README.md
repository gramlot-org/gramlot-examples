# Kajenn and Asqueel customer gallery

This optional Python catalogue demonstrates real customer reads and saves in a
dedicated SQLite file. It requires the matching development versions of Gramlot,
gramlot-py-server and gramlot-examples, with Kajenn and `kajenn-db[asqueel]`.
It is not part of the standard cross-environment or hosted gallery.

From the gramlot-py-server checkout, with those packages installed:

```sh
python scripts/serve_kajenn_db_gallery.py --database /absolute/path/demo/customers.sqlite --port 8768
```

Open `http://127.0.0.1:8768/py/`, expand **Kajenn and Asqueel**, and choose
**Load and save a customer** or **Customer editing across windows**.
The first launch creates customers 1 (Mario Rossi) and 2 (Anna Bianchi).
Subsequent launches preserve the database, including saved changes and deletions.
Use a dedicated demonstration file; an existing file must already have this model.
The model and pages belong here; host configuration and startup belong to the adapter.

## Data flow

Changing `view.request.pkey` and leaving the field sends its change through
`dataBinder` to `request.pkey` in that page's PageStore. Its controller sets
`customer?status` to `loading`, reads with `self.db().table('app.customer')`,
then sets `customer.record`, `customer?pkey` and status `loaded`.
A missing customer sets `error` and preserves the last loaded record and ID.

The Save button publishes `save_customer` to its own PageStore. The subscribed
controller validates name/email, sets `saving`, updates through Asqueel and
explicitly commits before setting `saved`. Failure rolls back, keeps the draft,
and puts the error in Data. The publication acknowledgement is not a save result;
the binder carries the outcome. The save targets the last loaded ID, including
after an unsuccessful lookup. Reload discards the draft and reads the requested ID.

Try customer 99, an empty name, or `anna@example.com` on customer 1. The last case
violates SQLite's unique email constraint; reload confirms the saved record is unchanged.

## Frames and connected windows

The family page includes a direct customer iframe and a nested one. Its link
opens a connected customer window, which can open another connected window.
All use their own PageStore and the primary gallery's one WebSocket. A parent
window closes its descendants. Each draft is independent: save in one window,
then reload in another to read the committed record. There is no automatic
cross-draft synchronization or optimistic concurrency check; the last successful
save wins. This is a database authoring example, not collaborative editing.

Controllers are synchronous and use Kajenn's native worker execution and database
lifetime. The separate async cancellation issue is tracked in Kajenn #89 and is
not exercised or resolved by this example.

## Verification

The adapter's `scripts/verify_kajenn_db_gallery.mjs` runs the real gallery in a
browser against a temporary SQLite database. It covers reads, saves, missing IDs,
validation, transaction rollback and recovery, direct/nested iframes, descendant
windows, one physical WebSocket and cascading closure. The adapter's
`tests/kajenn/test_kajenn_db_gallery.py` checks that startup never reseeds existing data.
