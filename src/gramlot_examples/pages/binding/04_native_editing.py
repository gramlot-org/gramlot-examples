from gramlot import Page as BasePage

FIELDS = (("Text", "text", "text"), ("Number", "number", "number"), ("Range", "range", "range"),
          ("Date", "date", "date"), ("Color", "color", "color"))


class Page(BasePage):
    title = "Native editing"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="edit")
        pane.h1("Native editing")
        pane.html_label("Write at every keystroke (live)", for_="live")
        pane.input(type="checkbox", value="^.live", id="live")

        grid = pane.div(class_="grid")
        form = grid.form(class_="card stack")
        for label, key, kind in FIELDS:
            form.html_label(label, for_=key)
            form.input(type=kind, value=f"^.{key}", live="^.live", id=key)
        form.html_label("Note", for_="note")
        form.textarea(value="^.note", live="^.live", rows=3, id="note")
        form.html_label("Size", for_="size")
        size = form.select(value="^.size", id="size")
        for option in ("S", "M", "L"):
            size.option(option, value=option)
        form.html_label("Topics", for_="topics")
        topics = form.select(value="^.topics", multiple=True, size=3, id="topics")
        for option in ("HTML", "SVG", "Data"):
            topics.option(option, value=option.lower())

        values = grid.section(class_="card stack")
        values.h2("The Data")
        facts = values.dl()
        for label, key, _ in FIELDS:
            facts.dt(label)
            facts.dd(f"^.{key}", id=f"out-{key}")
        for label, key in (("Note", "note"), ("Size", "size"), ("Topics", "topics")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=f"out-{key}")

        pane.dataSetter(".live", False)
        pane.dataSetter(".text", "Edit me")
        pane.dataSetter(".number", 42)
        pane.dataSetter(".range", 30)
        pane.dataSetter(".date", "2026-09-30")
        pane.dataSetter(".color", "#456bc4")
        pane.dataSetter(".note", "Two\nlines")
        pane.dataSetter(".size", "M")
        pane.dataSetter(".topics", ["html", "data"])
