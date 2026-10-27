# Publish to another page

The sender is a connected child window. The recipient is a sibling iframe with
its own PageStore. Both belong to the same owner and share the gallery's socket.

1. Open **Open sender window**.
2. Copy **This page ID** from the recipient iframe into the sender's
   **Publish to another page → Recipient page ID** field.
3. In the sender, enter customer 1 and click **Load on recipient page**.
   The recipient shows Mario Rossi. The sender shows **Accepted**, but its own
   record and status stay unchanged.
   **Published by page** in the recipient shows the sender window's page ID.
4. Send key 99: the publication is accepted, while the recipient's controller
   writes **Customer not found** into its Bag and preserves the previous record.
5. Replace the recipient ID with a nonexistent ID: the sender shows a refusal.
   Restore the valid ID and send key 2 to verify that the connection remains usable.

The existing descriptor selects the remote store:

```javascript
gramlot.publish(
    {topic: 'load_customer', server: true, pageId: targetPageId},
    {pkey}
);
```

The transport preserves the sender's pageId separately from targetPageId.
The acceptance/error response returns to the sender; record/status/error changes
reach the recipient through its binder. The server checks ownership before
dispatching the publication.

The subscribed controller receives the validated sender separately from payload:

```python
def load_customer(self, node, pkey, *, _subscription_metadata):
    sender_page_id = _subscription_metadata["pageId"]
    customer = self.data.get_node("customer")
    customer.set_attr({"status": "loading", "sender_page_id": sender_page_id})
    # Read the record and write the result to customer.record.
```

The example displays customer?sender_page_id through its ordinary binder.
The metadata identifies the child that published, not its primary window or
the recipient. A client payload cannot replace this server-supplied context.

The recipient input is an explicit teaching aid, not an owner credential.
The owner boundary also applies across independent primary connections.
Unknown, expired and unowned destinations share the same refusal to avoid
revealing the existence of another owner's page.


After loading the record, the server controller publishes back to the sender:

```python
self.publish(
    "customer_loaded", {"pkey": pkey, "record": record},
    page_id=_subscription_metadata["pageId"],
)
```

The sender has an ordinary browser controller subscribed to that topic:

```python
pane.dataController(
    """
    this.SET('.notification.record', record);
    this.SET('.notification.pkey', pkey);
    this.SET('.notification.sender', _subscription_metadata.pageId);
    """,
    subscribe_customer_loaded=True,
)
```

**Server event** shows this separate notification branch. The sender's bound
customer record remains untouched. This event is independent of the initial
acceptance and the recipient's binder updates; it uses the same primary socket.
Key 99 emits no customer_loaded event, so the previous notification remains.
The reverse publication enqueues delivery; it does not wait for browser subscribers.


**Server event — PageStore ID** in the child window must match **This page ID**
of the recipient iframe. The server generates metadata.pageId from the PageStore
that executes publish; the event's outer pageId remains the browser destination.
The controller reads _subscription_metadata, independently of payload fields.
