# Load and save a customer

The request key is bound to `request.pkey` on the PageStore. Its controller reads
`app.customer` through `self.db()` and puts the record in `customer.record`.
The customer node carries `pkey` and `status` attributes. Saving publishes
`save_customer`; its controller validates the draft, updates Asqueel and commits.

The page opens with a customer already loaded. When the PageStore starts, its
`_onStart` controller reads the first 20 customers by key, offers them by name in
**Customer to load**, and puts the first name's key in `request.pkey`. Choose
another name to load it, or type a key in **Customer ID to load**.

On the public gallery the host maps `app.customer` to `invc.invc_customer` in
**test_invoice_pg_xl**; `name` maps to `account_name`. Keys are 22-character
strings such as `UOoM_JZuPLyFcrTUxRxEIQ`. These are invented demonstration
records shared with the database grids. Saving changes that customer's name and email.

A failed lookup preserves the previous record and loaded ID. Saving uses that
loaded ID, not an unsuccessful requested key. An empty name or email is rejected.
Correct it and save again: the draft remains available after an error.

The optional standalone SQLite runner seeds keys **1** and **2**. That is a local
fixture, not the database used by the public gallery.

The publication acknowledges acceptance; `saved` in the Bag confirms the commit.
Reload reads the database again. This is a dedicated demonstration database, not
an application authorization or collaborative conflict-resolution framework.

Load the same customer in another frame or connected window. Save here, then reload
there: both use the same database, while each PageStore retains its own draft. The last
successful save wins.
