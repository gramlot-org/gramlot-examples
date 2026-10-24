from gramlot import Page as BasePage


class Page(BasePage):
    title = "Attribute projection"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="projection")
        pane.h1("Attribute projection")
        pane.h2("0.2.0: one value, several projections")
        pane.html_label("Name", for_="name")
        pane.input(value="^.name", live=True, id="name")
        pane.p("^.name", mask="Hello, {}", id="greeting")
        pane.div("Hover to read the title", customer="^.name", title="^.name:Customer: {customer}", id="card")
        pane.p("The pointer template reads customer from Source; the customer attribute remains projected.")
        pane.h2("0.2.3: a separate HTML preview")
        pane.html_label("Preview HTML", for_="html")
        pane.textarea(value="^.html", live=True, id="html")
        pane.iframe(srcdoc="^.html", title="Sandboxed preview", id="preview")
        pane.p("Data-bound srcdoc receives an empty sandbox; this preview only displays content.")
