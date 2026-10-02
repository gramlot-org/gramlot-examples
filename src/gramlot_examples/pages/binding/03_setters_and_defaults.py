from gramlot import Page as BasePage


class Page(BasePage):
    title = "Setters and defaults"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="order")
        pane.h1("Setters and defaults")
        pane.p("Every value below was in the Data before the first render.", class_="muted")

        form = pane.form(class_="card stack")
        form.html_label("Customer", for_="customer")
        form.input(value="^.customer", id="customer")
        form.html_label("Quantity (default 1)", for_="quantity")
        form.input(type="number", value="^.quantity", default=1, id="quantity")
        form.html_label("Note (default_value wins over default)", for_="note")
        form.input(value="^.note", default_value="No note", default="Never used", id="note")
        form.html_label("Price", for_="price")
        form.input(type="number", value="^.price", attr_currency="EUR", id="price")

        summary = pane.section(class_="card stack")
        summary.h2("The Data")
        facts = summary.dl()
        for label, pointer, key in (("Customer", "^.customer", "out-customer"),
                                    ("Quantity", "^.quantity", "out-quantity"),
                                    ("Note", "^.note", "out-note"),
                                    ("Price", "^.price", "out-price"),
                                    ("Currency (price?currency)", "^.price?currency", "out-currency"),
                                    ("Shipping city", "^.shipping.city", "out-city")):
            facts.dt(label)
            facts.dd(pointer, id=key)

        pane.dataSetter(".customer", "Ada Lovelace")
        pane.dataSetter(".price", 12.5)
        later = pane.section(class_="muted")
        later.p("This section holds the second setters: a descendant writes after its ancestors.")
        later.dataSetter(".customer", "Grace Hopper")
        later.dataSetter(".shipping", {"city": "London", "zone": "EU"})
