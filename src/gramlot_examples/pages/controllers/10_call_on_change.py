from gramlot import Page as BasePage
from gramlot import endpoint


class Page(BasePage):
    title = "Call on change"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="quote")
        pane.h1("Call on change")

        form = pane.form(class_="card stack")
        form.html_label("Quantity", for_="quantity")
        form.input(type="number", min=0, value="^.quantity", live=True, id="quantity")

        result = pane.section(class_="card stack")
        result.h2("Quote")
        facts = result.dl()
        for label, key in (("Total", "total"), ("Status", "status")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        pane.dataRpc("quote", result_path=".total", quantity="^.quantity", _delay=500, _init=True,
                     _onCalling="this.SET('.status', 'Asking the server for ' + quantity)",
                     _onResult="this.SET('.status', 'Answered ' + result + ' for ' + quantity)")
        pane.dataSetter(".quantity", 1)

    @endpoint
    def quote(self, quantity, **kwargs):
        quantity = quantity or 0
        return quantity * (8 if quantity >= 10 else 10)
