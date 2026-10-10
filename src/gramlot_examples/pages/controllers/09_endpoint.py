from gramlot import Page as BasePage
from gramlot import endpoint


class Page(BasePage):
    title = "Endpoint"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="invoice")
        pane.h1("Endpoint")

        result = pane.section(class_="card stack")
        result.h2("Total with VAT, computed by the server")
        facts = result.dl()
        for label, key in (("Price", "price"), ("VAT rate (%)", "rate"), ("Total with VAT", "gross")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        pane.dataRpc("with_vat", result_path=".gross", price="=.price", rate="=.rate", _init=True)
        pane.dataSetter(".price", 12.5)
        pane.dataSetter(".rate", 22)

    @endpoint
    def with_vat(self, price, rate, **kwargs):
        return round(price * (100 + rate)) / 100
