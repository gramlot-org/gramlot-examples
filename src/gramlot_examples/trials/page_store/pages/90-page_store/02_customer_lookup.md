# Publish a customer request

The browser publishes load_customer with a named pkey argument. Omitting pageId selects its own PageStore. subscribe_load_customer=True activates the named server controller.

1. Load key 1: Mario Rossi appears and status becomes loaded.
2. Load key 2: Anna Bianchi replaces the record and loaded ID becomes 2.
3. Load key 99: status becomes error, with Customer not found. Anna and her loaded ID remain visible.
4. Load key 1 again: the error clears and the record changes.

customer.record contains the record. customer?pkey and customer?status are node attributes; customer.error contains the business error. dataBinder maps that branch to view.customer. The client reacts through ordinary bindings.

Publication ok acknowledges validation and acceptance before subscribers execute; it is not the lookup result. Expected errors are explicitly caught by the controller and written into Data; unexpected exceptions are logged by the server. There is no implicit error path or completion response.

The fixed records keep the example runnable without a database. Replace read_customer with application database access. Controllers currently run synchronously; loading can be too brief to see.


On success the PageStore publishes customer_loaded to the validated sender page_id.
The browser's subscribe_customer_loaded dataController writes the notification
branch shown as **Server event**. In cross-page use this appears in the sender,
while the binder updates the recipient. Acceptance and this event are independent.

The browser controller also reads _subscription_metadata.pageId and displays
**Server event — PageStore ID**. The server provides the source store identity
separately from the application payload; it is not the browser recipient ID.
