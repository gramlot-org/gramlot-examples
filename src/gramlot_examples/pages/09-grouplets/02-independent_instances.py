from gramlot import Page as BasePage, source


class Page(BasePage):
    title = "Order addresses: reuse one editor twice"

    def main(self, root):
        main_content = root.main(class_="grouplet-demo", datapath="order")
        main_content.p("ORDER SO-1042 · STUDIO NORTH", class_="eyebrow")
        main_content.h1("Invoice the office. Deliver to the workshop.")
        main_content.p("Both address editors are built by the same server method. Each edits a different part of this order, so changing the delivery address leaves billing untouched.", class_="demo-intro")
        columns = main_content.div(class_="demo-addresses")
        for slot, title in [("billing", "Billing address"), ("shipping", "Delivery address")]:
            columns.grouplet(id=f"{slot}-editor", datapath=f".{slot}", remote="address_fields", remote_slot=slot, remote_title=title, class_="demo-panel")
        summary = main_content.section(class_="demo-panel")
        summary.h2("Order routing preview")
        rows = summary.div(class_="demo-addresses")
        for slot, title in [("billing", "Send the invoice to"), ("shipping", "Deliver the goods to")]:
            block = rows.div(datapath=f".{slot}", class_="demo-summary")
            block.h3(title)
            block.strong("^.recipient", id=f"{slot}-recipient-summary")
            block.p("^.street", id=f"{slot}-street-summary")
            block.p("^.city", id=f"{slot}-city-summary")
            block.p("^.country")
        main_content.div("Try it: change only the delivery street and city. Compare the two routing previews and the billing fields above. All edits are a local draft.", class_="demo-task")

    @source
    def address_fields(self, root, slot, title):
        root.h2(title)
        root.textbox(value="^.recipient", lbl="Recipient / company", id=f"{slot}-recipient", live=True)
        root.textbox(value="^.street", lbl="Street and number", id=f"{slot}-street", live=True)
        fields = root.formlet(columns=2)
        for name, label in [("city", "City"), ("zip", "Postal code"), ("region", "Region"), ("country", "Country")]:
            fields.textbox(value=f"^.{name}", lbl=label, id=f"{slot}-{name}", live=True)
        root.textbox(value="^.instructions", lbl="Delivery / invoice instructions", id=f"{slot}-instructions", live=True)
