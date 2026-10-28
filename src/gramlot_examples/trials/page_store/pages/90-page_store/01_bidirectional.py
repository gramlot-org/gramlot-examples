"""Two client copies bound to one server order."""
from decimal import Decimal
from genro_bag import Bag
from gramlot import Page as BasePage, PageStore as BasePageStore


class Page(BasePage):
    title = "Bidirectional Bag binding"

    def main(self, root):
        pane = root.div(datapath="view", style="padding:24px;max-width:720px;display:grid;gap:12px")
        pane.h1(self.title)
        pane.p("Edit either quantity and leave the field. Both copies update; the server calculates the total.")
        pane.dataBinder(".order", "order")
        pane.dataBinder(".mirror", "order")
        pane.html_label("First client copy", for_="quantity")
        pane.input(id="quantity", type="number", value="^.order.quantity")
        pane.html_label("Second client copy", for_="mirror-quantity")
        pane.input(id="mirror-quantity", type="number", value="^.mirror.quantity")
        pane.div("Unit price: ").span("^.order.unit_price")
        pane.div("Server total: ").span("^.order.total", id="total")
        pane.div("Status: ").span("^.order.status", id="status")
        pane.p("Try -1, then a positive quantity. Errors and calculated values are ordinary Bag data.")


class PageStore(BasePageStore):
    def main(self, root):
        self.data.set_item("order", Bag(dict(quantity="2", unit_price=Decimal("12.50"),
                                            total=Decimal("25.00"), status="Ready")))
        root.dataController(func="calculate", quantity="^order.quantity")

    def calculate(self, node, quantity):
        try:
            amount = int(quantity)
            if amount < 0:
                raise ValueError
        except (TypeError, ValueError):
            self.data.set_item("order.status", "Enter a non-negative whole quantity")
            return
        self.data.set_item("order.total", amount * self.data.get_item("order.unit_price"))
        self.data.set_item("order.status", "Calculated on the server")
