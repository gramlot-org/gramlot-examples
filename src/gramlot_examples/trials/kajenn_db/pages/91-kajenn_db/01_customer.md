# Load and save a customer

The request key is bound to `request.pkey` on the PageStore. Its controller reads
`app.customer` through `self.db()` and puts the record in `customer.record`.
The customer node carries `pkey` and `status` attributes. Saving publishes
`save_customer`; its controller validates the draft, updates Asqueel and commits.

On the public gallery, copy a customer ID from **Asqueel selectors**. The host
maps `app.customer` to `invc.invc_customer` in **test_invoice_pg_xl**; `name`
maps to `account_name`. These are invented demonstration records shared with
the database grids. Saving changes that customer's name and email.

A failed lookup preserves the previous record and loaded ID. Saving uses that
loaded ID, not an unsuccessful requested key. An empty name or email is rejected.
Correct it and save again: the draft remains available after an error.

The optional standalone SQLite runner seeds IDs **1** and **2**. That is a local
fixture, not the database used by the public gallery.

The publication acknowledges acceptance; `saved` in the Bag confirms the commit.
Reload reads the database again. This is a dedicated demonstration database, not
an application authorization or collaborative conflict-resolution framework.

Load the same customer in another frame or connected window. Save here, then reload
there: both use the same database, while each PageStore retains its own draft. The last
successful save wins.
