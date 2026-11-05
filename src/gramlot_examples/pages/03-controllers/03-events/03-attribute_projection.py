from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="projection")
        pane.h2("One value, several presentations")
        pane.html_label("Name", for_="name")
        pane.input(value="^.name", live=True, id="name")
        pane.p("^.name", mask="Hello, {}", id="greeting")
        pane.div("Hover to read the title", customer="^.name", title="^.name:Customer: {customer}", id="card")
        pane.h2("A separate HTML preview")
        pane.html_label("Preview HTML", for_="html")
        pane.textarea(value="^.html", live=True, id="html")
        pane.iframe(srcdoc="^.html", title="Sandboxed preview", id="preview")
