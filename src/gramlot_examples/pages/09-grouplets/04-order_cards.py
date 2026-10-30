from gramlot import Page as BasePage, source


class Page(BasePage):
    title = "Order review: work with grouplet cards"

    def main(self, root):
        main_content = root.main(class_="grouplet-demo", datapath="order")
        main_content.p("ORDER SO-1042 · 12 WORKSHOP LIGHTS", class_="eyebrow")
        main_content.h1("Review the customer, invoice and delivery together")
        main_content.p("Each card keeps one part of the order together. Edit the fields, mark a section as reviewed using its header checkbox, and fold completed sections. The dispatch briefing stays visible below.", class_="demo-intro")
        main_content.dataFormula(".reviewed", "(customer ? 1 : 0) + (billing ? 1 : 0) + (shipping ? 1 : 0)", customer="^.customer.ui.checked", billing="^.billing.ui.checked", shipping="^.shipping.ui.checked", _init=True)
        main_content.dataFormula(".progress", "reviewed + ' of 3 sections reviewed'", reviewed="^.reviewed", _init=True)
        toolbar = main_content.div(class_="demo-toolbar")
        toolbar.button("Reload order cards", id="reload-cards", action="this.SET('.revision', this.GET('.revision') + 1)")
        toolbar.checkbox(value="^.shipping.ui.closed", lbl="Fold delivery", lbl_position="R", id="fold-delivery")
        toolbar.checkbox(value="^.shipping.ui.checked", lbl="Delivery reviewed", lbl_position="R", id="review-delivery")
        toolbar.span("^.progress", id="review-progress", class_="demo-badge")
        main_content.groupletCard(id="order-card", title="^.reference", collapsible=True, collapsed="^.ui.closed", remote="order_cards", remote_revision="^.revision")
        summary = main_content.section(class_="demo-panel demo-summary")
        summary.h2("Dispatch briefing")
        summary.strong("^.customer.name", id="order-customer-summary")
        summary.p("^.customer.email", id="order-email-summary")
        summary.p("Invoice recipient")
        summary.strong("^.billing.recipient", id="order-billing-summary")
        summary.p("^.billing.city", id="order-billing-city-summary")
        summary.p("Delivery destination")
        summary.strong("^.shipping.address.recipient", id="order-shipping-summary")
        summary.p("^.shipping.address.street", id="order-street-summary")
        summary.p("^.shipping.address.city", id="order-city-summary")
        summary.p("^.shipping.window", id="order-window-summary")
        summary.p("^.shipping.instructions", id="order-instructions-summary")
        main_content.div("Try it: change the workshop city and delivery instructions, mark Delivery reviewed, fold the address inside that card, then reload the order cards. Your edits, review marks and fold states stay in this page. Expanding or folding a card makes no server request.", class_="demo-task")
        main_content.p("Review marks are a local checklist. This lesson does not save or validate a database order.", class_="demo-caption")

    @source
    def order_cards(self, root, revision):
        root.p(f"Order sections loaded · revision {revision}", id="order-revision", class_="demo-caption")
        customer = root.groupletCard(id="customer-card", datapath=".customer", title="^.name", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed", class_="order-section")
        customer.p("Contact details · the title follows the customer name as you edit it.", class_="demo-caption")
        fields = customer.formlet(col_min_width="15rem")
        for name, label in [("name", "Customer name"), ("contact", "Contact person"), ("email", "Email"), ("phone", "Phone")]:
            fields.textbox(value=f"^.{name}", lbl=label, id=f"order-customer-{name}", live=True)
        root.groupletCard(id="billing-card", datapath=".billing", title="^.title", chromeSide="left", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed", remote="order_address_fields", remote_slot="billing", class_="order-section")
        root.groupletCard(id="delivery-card", datapath=".shipping", title="^.title", chromeSide="right", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed", remote="order_delivery_fields", class_="order-section")

    @source
    def order_address_fields(self, root, slot):
        fields = root.formlet(col_min_width="15rem")
        for name, label in [("recipient", "Recipient"), ("street", "Street and number"), ("city", "City"), ("zip", "Postal code"), ("country", "Country"), ("reference", "Reference")]:
            fields.textbox(value=f"^.{name}", lbl=label, id=f"order-{slot}-{name}", live=True)

    @source
    def order_delivery_fields(self, root):
        root.p("The address card below folds independently of the delivery card around it.", class_="demo-caption")
        root.textbox(value="^.window", lbl="Delivery window", id="order-delivery-window", live=True)
        root.textbox(value="^.instructions", lbl="Unloading instructions", id="order-delivery-instructions", live=True)
        root.groupletCard(id="workshop-card", datapath=".address", title="^.title", collapsible=True, collapsed="^.ui.closed", remote="order_address_fields", remote_slot="shipping", class_="order-section")
