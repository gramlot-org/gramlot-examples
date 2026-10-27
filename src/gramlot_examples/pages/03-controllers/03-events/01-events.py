from gramlot import Page as BasePage


class Page(BasePage):
    title = "Handle browser and component events"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="events")
        pane.h1("Events")
        pane.p("Click a chip, type in the field and move over the pointer area. The visible readouts show which event reached each declaring Source node.")

        clicks = pane.section(class_="card stack", id="click-area",
                              connect_onclick="this.SET('.clicked', event.target.id || event.target.localName)")
        clicks.h2("connect_onclick on a section")
        clicks.p("Click anywhere in this card, or on one of the chips.")
        chips = clicks.div(class_="actions event-chips")
        for name in ("red", "green", "blue"):
            chips.span(name, id=f"chip-{name}", class_="status")
        clicks.p("^.clicked", id="clicked", class_="muted")

        typing = pane.section(class_="card stack")
        typing.h2("connect_oninput and connect_onkeydown")
        typing.html_label("Type here", for_="typing")
        typing.input(id="typing", connect_oninput="this.SET('.length', event.target.value.length)",
                     connect_onkeydown="this.SET('.key', event.key)")
        facts = typing.dl()
        for label, key in (("Length", "length"), ("Last key", "key")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        hover = pane.section(class_="card stack")
        hover.h2("connect_onmouseover and connect_onmouseout")
        hover.div("Move the pointer over this box", id="hover-box", class_="^.hover_class",
                  connect_onmouseover="this.SET('.hover_class', 'card status status--success')",
                  connect_onmouseout="this.SET('.hover_class', 'card')")
