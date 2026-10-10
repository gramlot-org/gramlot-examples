from gramlot import Page as BasePage
from gramlot import endpoint

SHOW_ERROR = "this.SET('.error', error.code + ': ' + error.message)"


class Page(BasePage):
    title = "Call on click"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="stock")
        pane.h1("Call on click")

        calls = pane.section(class_="card stack")
        calls.h2("A dataRpc nested in the button")
        reserve = calls.button("Reserve the item", id="reserve")
        reserve.dataRpc("reserve", result_path=".reserved", item="=.item", _onError=SHOW_ERROR)
        cancel = calls.button("Cancel the order (auth)", id="cancel")
        cancel.dataRpc("cancel", result_path=".reserved", item="=.item", _onError=SHOW_ERROR)
        facts = calls.dl()
        for label, key in (("Item", "item"), ("Reserved", "reserved"), ("Error", "error")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        pane.dataSetter(".item", "Lamp")

    @endpoint
    def reserve(self, item, **kwargs):
        raise LookupError(f"{item} is out of stock")

    @endpoint(auth="admin")
    def cancel(self, item, **kwargs):
        return False
