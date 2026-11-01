from gramlot import Page as BasePage, source

class Page(BasePage):
    title = "Customer handover: guides beside the fields"

    def main(self, root):
        main = root.main(class_="grouplet-demo", datapath="order")
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

    @source
    def guided_cards(self, root, revision):
        root.p(f"Guided cards loaded · revision {revision}", id="guide-revision", class_="demo-caption")
        customer = root.groupletCard(id="guide-customer", datapath=".customer", title="^.name", doc="^.guide", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed")
        fields = customer.formlet(col_min_width="22rem")
        for name, label in [("name", "Customer name"), ("contact", "Contact person"), ("email", "Email"), ("phone", "Phone")]:
            fields.textbox(value=f"^.{name}", lbl=label, live=True, id=f"guide-customer-{name}")
        root.groupletCard(id="guide-delivery", datapath=".shipping", title="Delivery plan", doc="^.guide", collapsible=True, collapsed="^.ui.closed", checkbox="^.ui.checked", checkboxLabel="Reviewed", remote="guided_delivery", class_="order-section")

    @source
    def guided_delivery(self, root):
        fields = root.formlet(col_min_width="22rem")
        fields.textbox(value="^.window", lbl="Delivery window", live=True, id="guide-window")
        fields.textbox(value="^.instructions", lbl="Unloading instructions", live=True, id="guide-instructions")
        root.groupletCard(id="guide-address", datapath=".address", title="Workshop address", doc="^.guide", chromeSide="left", collapsible=True, collapsed="^.ui.closed", remote="guided_address", class_="order-section")

    @source
    def guided_address(self, root):
        fields = root.formlet(col_min_width="15rem")
        for name, label in [("recipient", "Recipient"), ("street", "Street and number"), ("city", "City"), ("zip", "Postal code"), ("country", "Country"), ("reference", "Access reference")]:
            fields.textbox(value=f"^.{name}", lbl=label, live=True, id=f"guide-address-{name}")
