# Load and save a customer

The request key is bound to `request.pkey` on the PageStore. Its controller reads
`app.customer` through `self.db()` and puts the record in `customer.record`.
The customer node carries `pkey` and `status` attributes. Saving publishes
`save_customer`; its controller validates the draft, updates Asqueel and commits.

Try keys **1**, **2** and **99**. A failed lookup preserves the previous record
and loaded ID. Saving uses that loaded ID, not an unsuccessful requested key.
An empty name is rejected. On customer 1, try the email **anna@example.com**:
the database rejects the duplicate and the controller rolls back. Correct the
email and save again. The draft remains available after an error.

The publication acknowledges acceptance; `saved` in the Bag confirms the commit.
Reload reads the database again. This is a dedicated demonstration database, not
an application authorization or collaborative conflict-resolution framework.
