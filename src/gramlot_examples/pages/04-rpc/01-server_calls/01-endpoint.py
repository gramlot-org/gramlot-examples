from math import floor

from gramlot import Page as BasePage
from gramlot import endpoint


class Page(BasePage):
    title = "Define and call a server endpoint"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="invoice")
        pane.h1("Endpoint")
        pane.p("The page sends price and VAT rate once at startup. The server returns the gross amount, which appears below through a Data binding.")

        result = pane.section(class_="card stack")
        result.h2("Total with VAT, computed by the server")
        facts = result.dl()
        for label, key in (("Price", "price"), ("VAT rate (%)", "rate"), ("Total with VAT", "gross")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        pane.dataRpc("with_vat", result_path=".gross", price="=.price", rate="=.rate", _init=True)

    @endpoint
    def with_vat(self, price, rate, **kwargs):
        # Half up to the cent. Python round() rounds half to even, so both twins use floor(x + 0.5).
        return floor(price * (100 + rate) + 0.5) / 100
