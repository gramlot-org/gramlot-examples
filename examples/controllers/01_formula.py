from gramlot import Page as BasePage


class Page(BasePage):
    title = "Formula"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="order")
        pane.h1("Formula")
        form = pane.form(class_="card stack")
        for label, key in (("Price", "price"), ("Quantity", "quantity"), ("VAT rate", "vat")):
            form.html_label(label, for_=key)
            form.input(type="number", step="any", value=f"^.{key}", live=True, id=key)

        result = pane.section(class_="card stack")
        result.h2("Results")
        facts = result.dl()
        for label, key in (("Total (price × quantity)", "total"), ("Gross (total × (1 + VAT), = vat)", "gross"),
                           ("Size (_if / _else)", "size")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        pane.dataFormula(".total", "price * quantity", price="^.price", quantity="^.quantity", _init=True)
        pane.dataFormula(".gross", "Math.round(total * (1 + vat) * 100) / 100", total="^.total", vat="=.vat",
                         _init=True)
        pane.dataFormula(".size", "'large order'", total="^.total", _if="total > 100", _else="'small order'",
                         _init=True)
        pane.dataSetter(".price", 12.5)
        pane.dataSetter(".quantity", 4)
        pane.dataSetter(".vat", 0.2)
