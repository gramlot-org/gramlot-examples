from gramlot import Page as BasePage, source

CUSTOMER_GUIDE = """### Who should receive order updates?

Use the **customer name** for the organisation placing the order. The delivery recipient may be different.

1. Enter a named **contact person** who can approve changes.
2. Use an **email** monitored by the purchasing team.
3. Enter a **phone number** with its country prefix, so the carrier can call from another region.

### Before marking Reviewed

Read the name, email and phone back to your contact. A review mark is a local checklist; it does not send a message or save the order.

You can fold the card after reviewing it and still reopen this guide from its header."""
ADDRESS_GUIDE = """### Describe the entrance the driver should use

- **Recipient:** the receiving team or named person, not necessarily the billing customer.
- **Street and number:** the actual delivery entrance. Include a unit number when needed.
- **City, postal code and country:** complete all three so the carrier can distinguish similar addresses.
- **Access reference:** a gate, reception desk or loading-bay reference that will still make sense on delivery day.

### Example

For a workshop with a separate goods entrance, use `Gate B · Goods in` as the access reference and put unloading restrictions in the Delivery plan card.

Changing the delivery address does not change the invoice address. Folding this card retains your draft."""

class Page(BasePage):
    title = "Customer handover: guides beside the fields"

    def main(self, root):
        main = root.main(class_="grouplet-demo", datapath="order")
        main.p("CUSTOMER HANDOVER · ORDER SO-1042", class_="eyebrow")
        main.h1("Prepare a delivery with guidance at the point of entry")
        main.p("A new operator is taking over North Workshop's order for twelve lights. Each information button explains the fields in that card. The delivery guide also names the current customer, destination and contact.", class_="demo-intro")
        main.dataFormula(".shipping.guide", "enabled ? '### Delivery for ' + customer + '\\n\\n**Current destination:** ' + (city || 'enter a city') + ', ' + (country || 'enter a country') + '.\\n\\n**Contact to confirm access:** ' + (contact || 'enter a contact') + '.\\n\\n### Before booking the carrier\\n\\n1. Agree a delivery window with the receiving team.\\n2. Check that the selected entrance is open during that window.\\n3. Describe unloading restrictions and who the driver should call.\\n\\nThe address card has a separate guide for the destination fields. These instructions follow the current draft, even while the card is folded.' : ''", enabled="^.showGuide", customer="^.customer.name", city="^.shipping.address.city", country="^.shipping.address.country", contact="^.customer.contact", _init=True)
        bar = main.div(class_="demo-toolbar")
        bar.button("Reload guided cards", id="guide-reload", action="this.SET('.revision', this.GET('.revision') + 1)")
        bar.checkbox(value="^.showGuide", lbl="Show delivery guide", lbl_position="R", id="guide-visible")
        main.grouplet(remote="guided_cards", remote_revision="^.revision")
        summary = main.section(class_="demo-panel demo-summary")
        summary.h2("Handover summary")
        summary.strong("^.customer.name", id="guide-customer-summary")
        summary.p("^.customer.contact", id="guide-contact-summary")
        summary.p("^.customer.email")
        summary.p("^.shipping.address.recipient")
        summary.p("^.shipping.address.street")
        summary.p("^.shipping.address.city", id="guide-city-summary")
        summary.p("^.shipping.window")
        summary.p("^.shipping.instructions")
        main.div("Try it: open the customer guide, review the contact fields, then open the delivery guide. Change the contact or destination city: the guide follows the draft. Fold Delivery plan and open its guide again. Open the nested address guide for field-by-field instructions. Hide and restore the delivery guide, then reload: edits and review/fold states remain.", class_="demo-task")
        main.p("Guides are read-only Markdown supplied by this page. The example does not provide a shared document archive, edit notes or save customer records.", class_="demo-caption")

    @source
    def guided_cards(self, root, revision):
        root.p(f"Guided cards loaded · revision {revision}", id="guide-revision", class_="demo-caption")
        customer = root.groupletCard(id="guide-customer", datapath=".customer", title="^.name", doc=CUSTOMER_GUIDE, collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed")
        fields = customer.formlet(col_min_width="22rem")
        for name, label in [("name", "Customer name"), ("contact", "Contact person"), ("email", "Email"), ("phone", "Phone")]:
            fields.textbox(value=f"^.{name}", lbl=label, live=True, id=f"guide-customer-{name}")
        root.groupletCard(id="guide-delivery", datapath=".shipping", title="Delivery plan", doc="^.guide", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed", remote="guided_delivery", class_="order-section")

    @source
    def guided_delivery(self, root):
        fields = root.formlet(col_min_width="22rem")
        fields.textbox(value="^.window", lbl="Delivery window", live=True, id="guide-window")
        fields.textbox(value="^.instructions", lbl="Unloading instructions", live=True, id="guide-instructions")
        root.groupletCard(id="guide-address", datapath=".address", title="Workshop address", doc=ADDRESS_GUIDE, chromeSide="left", collapsible=True, collapsed="^.ui.closed", remote="guided_address", class_="order-section")

    @source
    def guided_address(self, root):
        fields = root.formlet(col_min_width="15rem")
        for name, label in [("recipient", "Recipient"), ("street", "Street and number"), ("city", "City"), ("zip", "Postal code"), ("country", "Country"), ("reference", "Access reference")]:
            fields.textbox(value=f"^.{name}", lbl=label, live=True, id=f"guide-address-{name}")
