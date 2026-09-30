from gramlot import Page as BasePage
from gramlot import source


class Page(BasePage):
    title = "End-to-end story"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="story")
        pane.h1("^.settings.caption", id="caption")

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
        later.h2("A later branch")
        notes = later.ul(node_id="notes", id="notes")
        for text in ("Setters live here too", "This note can be removed under freeze"):
            notes.li(text)
        actions = later.div(class_="actions")
        for label, method in (("Load extras", "loadExtras"), ("Freeze", "freeze"),
                              ("Remove a note", "removeNote"), ("Thaw", "thaw")):
            actions.button(label, id=method).dataController(func=method)
        later.section(node_id="extras", id="extras").p("No extras yet.", class_="muted")
        later.dataSetter(".settings.caption", "The story of a page")
        later.dataSetter(".size", {"small": True, "large": False})
        later.dataSetter(".gift", False)
        later.dataSetter(".live", False)

    @source
    def extras(self, root):
        branch = root.div(datapath="extras", class_="stack")
        branch.h3("^.title", id="extras-title")
        branch.p("^.items", id="extras-items")
        branch.dataSetter(".title", "Extras from the server")
        branch.dataSetter(".items", "Ribbon, card, envelope")
