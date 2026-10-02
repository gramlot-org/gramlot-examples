from gramlot import Page as BasePage


class Page(BasePage):
    title = "Inline expressions"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="player")
        pane.h1("Inline expressions")
        form = pane.form(class_="card stack")
        for label, key in (("First name", "first"), ("Last name", "last")):
            form.html_label(label, for_=key)
            form.input(value=f"^.{key}", live=True, id=key)
        form.html_label("Score", for_="score")
        form.input(type="range", min=0, max=100, value="^.score", live=True, id="score")
        row = form.div()
        row.input(type="checkbox", value="^.accepted", id="accepted")
        row.html_label("I accept the rules", for_="accepted")

        result = pane.section(class_="card stack")
        result.h2("==first + ' ' + last", first="^.first", last="^.last", id="full-name")
        result.p("==score >= 50 ? 'Passed' : 'Not yet'", score="^.score", id="verdict",
                 class_="==score >= 50 ? 'status status--success' : 'status status--error'",
                 title="=='Score ' + score + ' of 100'")
        bar = result.svg(viewBox="0 0 300 20", role="img", aria_label="Score bar", class_="example-art")
        bar.rect(x=0, y=0, height=20, width="==score * 3", score="^.score", fill="var(--gramlot-action)", id="bar")
        result.button("Start", disabled="==!accepted", accepted="^.accepted", id="start",
                      action="this.SET('.started', true)")
        result.p("Started", visible="^.started", id="started", class_="muted")

        pane.dataSetter(".first", "Ada")
        pane.dataSetter(".last", "Lovelace")
        pane.dataSetter(".score", 40)
        pane.dataSetter(".accepted", False)
        pane.dataSetter(".started", False)
