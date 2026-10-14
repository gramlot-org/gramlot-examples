from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    title = "End-to-end story"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="story")
        pane.h1("^.settings.caption", id="caption")
        pane.h2("0.2.0 · Local page")

        form = pane.form(class_="card stack", node_id="form")
        form.html_label("Caption", for_="caption-field")
        form.input(value="^.settings.caption", live="^.live", id="caption-field")
        row = form.div()
        row.input(type="checkbox", value="^.live", id="live")
        row.html_label("live", for_="live")
        form.html_label("Quantity", for_="quantity")
        form.input(type="number", min=0, value="^.quantity", default=2, id="quantity")
        form.dataSetter(".settings.caption", "A first caption")
        sizes = form.fieldset()
        sizes.legend("Size")
        for key, label in (("small", "Small"), ("large", "Large")):
            sizes.input(type="radio", group="size", value=f"^.size.{key}", id=key)
            sizes.html_label(label, for_=key)
        gift = form.div()
        gift.input(type="checkbox", value="^.gift", id="gift")
        gift.html_label("Gift wrap", for_="gift")

        result = pane.section(class_="card stack")
        result.p("^.total", id="total")
        # Optional: the same local total also drives an SVG projection.
        drawing = result.svg(viewBox="0 0 200 200", role="img", aria_label="Total as a circle", class_="example-art")
        drawing.circle(cx=100, cy=100, r="^.radius", fill="^.color", id="circle")
        result.button("Press, also with Shift", id="press").dataController(func="press")
        result.p("^.presses", id="presses")
        result.p("^.modifiers", id="modifiers", class_="muted")

        pane.dataFormula(".total", "quantity * (large ? 3 : 1) + (gift ? 5 : 0)", quantity="^.quantity",
                         large="^.size.large", gift="^.gift", _init=True)
        pane.dataFormula(".radius", "Math.min(20 + total * 4, 90)", total="^.total", _init=True)
        pane.dataController(func="paint", total="^.total", _init=True)

        later = pane.section(class_="card stack", node_id="later")
        later.h2("0.2.0 · Optional freeze exercise")
        notes = later.ul(node_id="notes", id="notes")
        for text in ("Setters live here too", "This note can be removed under freeze"):
            notes.li(text)
        actions = later.div(class_="actions")
        for label, method in (("Freeze", "freeze"), ("Remove a note", "removeNote"), ("Thaw", "thaw")):
            actions.button(label, id=method).dataController(func=method)
        later.dataSetter(".settings.caption", "The story of a page")
        later.dataSetter(".size", {"small": True, "large": False})
        later.dataSetter(".gift", False)
        later.dataSetter(".live", False)

        # Return here after c09/c11: the original local stage above remains independent.
        quotes = pane.section(class_="card stack")
        quotes.h2("0.2.14 · Ask the server for a quote")
        quotes.p("The local total follows edits. The server quote changes only after a request.")
        quotes.button("Request quote", type="button", id="request-quote").dataRpc(
            "quote", result_path=".quote", quantity="=.quantity",
            large="=.size.large", gift="=.gift",
            _onResult="this.SET('.quote_error', null)",
            _onError="this.SET('.quote_error', error.code + ': ' + error.message)")
        facts = quotes.dl()
        for label, key, element_id in (("Server quote", "quote", "quote"),
                                       ("Request error", "quote_error", "quote-error")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=element_id)
        quotes.p("Try quantity 0: the server refuses it and the previous quote remains. Then use 3 and request again.",
                 class_="muted")

    @endpoint
    def quote(self, quantity, large, gift, **kwargs):
        if quantity is None or quantity < 1:
            raise ValueError("Choose at least one item")
        return quantity * (3 if large else 1) + (5 if gift else 0)
