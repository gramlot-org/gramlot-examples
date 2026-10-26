from gramlot import Page as BasePage
from gramlot import endpoint

SHOW_ERROR = "this.SET('.error', error.code + ': ' + error.message)"


class OutOfStock(Exception):
    """The endpoint refuses the reservation; the class name reaches the page as error.remoteName."""


class Page(BasePage):
    title = "Call the server from a button"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="stock")
        pane.h1("Call on click")
        pane.p("Reserve the unavailable item, then try the protected action. The error messages distinguish an application error from missing authentication.")

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

        auth = pane.section(class_="card stack")
        auth.h2("Authorization and visibility")
        auth.p("Source-auth marker", auth="admin", id="protected-source")
        auth.p("Hidden marker is still delivered", hidden=True, id="hidden-source")
        auth.p("Without an authorized identity, the protected paragraph is omitted from Source.")


    @endpoint
    def reserve(self, item, **kwargs):
        raise OutOfStock(f"{item} is out of stock")

    @endpoint(auth="admin")
    def cancel(self, item, **kwargs):
        return False
