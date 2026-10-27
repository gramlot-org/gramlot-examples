"""Publish a customer key; receive the record and outcome through a binder."""
from genro_bag import Bag
from gramlot import Page as BasePage, PageStore as BasePageStore


class Page(BasePage):
    title = "Publish a customer request"

    def main(self, root):
        pane = root.div(datapath="view", style="padding:24px;max-width:720px;display:grid;gap:12px")
        pane.h1(self.title)
        pane.html_label("This page ID", for_="current-page-id")
        pane.input(id="current-page-id", value=self.page_id, readonly=True)
        pane.a("Open a connected copy", href="./02_customer_lookup", target="_blank",
               rel="opener", id="open-connected-copy")
        pane.p("Enter 1 or 2 and load the customer. Then try 99: the previous record stays visible.")
        pane.dataBinder(".customer", "customer")
        pane.html_label("Customer ID", for_="customer-key")
        pane.input(id="customer-key", value="^.requested_pkey", placeholder="1 or 2")
        pane.button("Load customer", id="load-customer", pkey="=.requested_pkey",
                    action="gramlot.publish({topic: 'load_customer', server: true}, {pkey});")
        pane.div("Status: ").span("^.customer?status", id="customer-status")
        pane.div("Loaded ID: ").span("^.customer?pkey", id="loaded-key")
        pane.div("Name: ").span("^.customer.record.name", id="customer-name")
        pane.div("Email: ").span("^.customer.record.email", id="customer-email")
        pane.div("Error: ").span("^.customer.error", id="customer-error")
        pane.div("Published by page: ").span("^.customer?sender_page_id", id="sender-page-id")
        pane.dataController(
            """
            this.SET('.notification.record', record);
            this.SET('.notification.pkey', pkey);
            this.SET('.notification.sender', _subscription_metadata.pageId);
            """,
            subscribe_customer_loaded=True,
        )
        pane.div("Server event — customer ID: ").span("^.notification.pkey", id="event-customer-key")
        pane.div("Server event — name: ").span("^.notification.record.name", id="event-customer-name")
        pane.div("Server event — PageStore ID: ").span("^.notification.sender", id="event-store-id")
        remote = pane.details(id="cross-page-controls")
        remote.summary("Publish to another page")
        remote.p("Copy the recipient's page ID here. Use the Customer ID above as the record to load there.")
        remote.html_label("Recipient page ID", for_="target-page-id")
        remote.input(id="target-page-id", value="^.target_page_id")
        remote.button(
            "Load on recipient page", id="load-on-recipient",
            pkey="=.requested_pkey", targetPageId="^.target_page_id",
            disabled="==!targetPageId",
            action="""
                gramlot.data.setItem('view.delivery', 'Sending');
                gramlot.publish(
                    {topic: 'load_customer', server: true, pageId: targetPageId},
                    {pkey}
                ).then(
                    () => gramlot.data.setItem('view.delivery', 'Accepted'),
                    error => gramlot.data.setItem('view.delivery', error.code + ': ' + error.message)
                );
            """,
        )
        remote.div("Publication: ").span("^.delivery", id="delivery-status")
        remote.p("Accepted confirms delivery acceptance. The business result appears in the recipient's Bag.")
        pane.p("The record arrives through the binder. The publication confirms acceptance, not completion.")


class PageStore(BasePageStore):
    def main(self, root):
        self.data.set_item("customer", Bag({"record": Bag(), "error": ""}),
                           _attributes={"status": "unset"})
        root.dataController(func="load_customer", subscribe_load_customer=True)

    def load_customer(self, node, pkey, *, _subscription_metadata):
        customer = self.data.get_node("customer")
        self.data.set_item("customer.error", "")
        customer.set_attr({"status": "loading", "sender_page_id": _subscription_metadata["pageId"]})
        try:
            record = self.read_customer(pkey)
        except LookupError as error:
            self.data.set_item("customer.error", str(error))
            customer.set_attr({"status": "error"})
            return
        self.data.set_item("customer.record", record)
        customer.set_attr({"pkey": pkey, "status": "loaded"})
        self.publish(
            "customer_loaded", {"pkey": pkey, "record": record},
            page_id=_subscription_metadata["pageId"],
        )

    def read_customer(self, pkey):
        # Fixed records keep this lesson independent of a database integration.
        records = {
            "1": {"name": "Mario Rossi", "email": "mario@example.com"},
            "2": {"name": "Anna Bianchi", "email": "anna@example.com"},
        }
        if pkey not in records:
            raise LookupError("Customer not found")
        return Bag(records[pkey])
