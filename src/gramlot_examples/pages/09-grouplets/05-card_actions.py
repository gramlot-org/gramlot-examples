from gramlot import Page as BasePage, source


class Page(BasePage):
    title = "Shipping desk: card actions and scoped Clear"

    def main(self, root):
        main_content = root.main(class_="grouplet-demo", datapath="order")
        main_content.p("SHIPPING DESK · SO-1042", class_="eyebrow")
        main_content.h1("Change delivery arrangements without losing the order")
        main_content.p("North Workshop ordered 12 workshop lights. Use Actions on the delivery card to arrange a morning delivery or prepare a contact note. Clear starts a new delivery draft while keeping the order and invoice details.", class_="demo-intro")
        main_content.dataFormula(".shipping.canClear", "!invoiced", invoiced="^.invoiced", _init=True)
        main_content.dataFormula(".lockMessage", "invoiced ? 'Invoiced: Clear is locked on both cards.' : 'Draft order: Clear is available after confirmation.'", invoiced="^.invoiced", _init=True)
        toolbar = main_content.div(class_="demo-toolbar")
        toolbar.checkbox(value="^.invoiced", lbl="Order invoiced — lock Clear", lbl_position="R", id="actions-invoiced")
        toolbar.button("Reload shipping cards", id="actions-reload", action="this.SET('.revision', this.GET('.revision') + 1)")
        main_content.p("^.lockMessage", id="actions-lock", class_="demo-badge")
        overview = main_content.section(class_="demo-panel demo-summary")
        overview.h2("Order and invoice — retained by Clear")
        overview.strong("^.reference", id="actions-order-summary")
        overview.p("^.customer.name")
        overview.p("^.billing.recipient")
        overview.p("^.billing.street")
        overview.p("^.billing.city", id="actions-billing-summary")
        main_content.grouplet(remote="shipping_card", remote_revision="^.revision", id="shipping-workbench")
        briefing = main_content.section(class_="demo-panel demo-summary")
        briefing.h2("Live dispatch briefing")
        briefing.p("^.shipping.status", id="actions-status")
        briefing.strong("^.shipping.address.recipient", id="actions-recipient-summary")
        briefing.p("^.shipping.address.street", id="actions-street-summary")
        briefing.p("^.shipping.address.city", id="actions-city-summary")
        briefing.p("^.shipping.window", id="actions-window-summary")
        briefing.p("^.shipping.instructions", id="actions-instructions-summary")
        briefing.p("Tracking reference (not an editable card field)")
        briefing.strong("^.shipping.tracking", id="actions-tracking-summary")
        main_content.div("Try it: choose Morning delivery from Actions; mark Reviewed; fold the address. Cancel Clear once, then confirm it. The nested address and delivery fields empty, but order, invoice, tracking and review/fold states remain. Tick Order invoiced and inspect the disabled Clear entries. Reload to verify that the draft is retained.", class_="demo-task")
        main_content.p("All actions change this page's Data only. Preparing a contact note does not send a message; Clear does not delete a database order.", class_="demo-caption")

    @source
    def shipping_card(self, root, revision):
        root.p(f"Shipping editor loaded · revision {revision}", id="actions-revision", class_="demo-caption")
        card = root.groupletCard(id="actions-delivery", datapath=".shipping", title="Delivery arrangements", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed", delitem="^.canClear")
        menu = card.menu()
        menu.menuline(caption="Morning delivery", id="actions-morning", action="this.SET('.window', 'Tuesday, 09:00–12:00'); this.SET('.instructions', 'Call 30 minutes before arrival. Use gate B.'); this.SET('.status', 'Morning delivery requested — confirm with the carrier.')")
        menu.menuline(caption="Prepare contact note", id="actions-contact-note", action="this.SET('.status', 'Contact ' + (this.GET('.contact') || 'the recipient') + ' on ' + (this.GET('.phone') || 'a phone number to be entered') + ' to confirm access.')")
        card.p("Clear in this header empties delivery fields and the nested address. Use Clear on Address only to replace just the destination.", class_="demo-caption")
        fields = card.formlet(col_min_width="15rem")
        for name, label in [("contact", "Delivery contact"), ("phone", "Phone"), ("window", "Delivery window"), ("instructions", "Unloading instructions")]:
            fields.textbox(value=f"^.{name}", lbl=label, live=True, id=f"actions-{name}")
        fields.textbox(value="^order.reference", lbl="Order reference — outside this card's data", live=True, id="actions-order-reference")
        card.groupletCard(id="actions-address", datapath=".address", title="Delivery address", chromeSide="left", collapsible=True, collapsed="^.ui.closed", delitem="^order.shipping.canClear", remote="shipping_address", class_="order-section")

    @source
    def shipping_address(self, root):
        fields = root.formlet(col_min_width="15rem")
        for name, label in [("recipient", "Recipient"), ("street", "Street and number"), ("city", "City"), ("zip", "Postal code"), ("country", "Country"), ("reference", "Access reference")]:
            fields.textbox(value=f"^.{name}", lbl=label, live=True, id=f"actions-address-{name}")
