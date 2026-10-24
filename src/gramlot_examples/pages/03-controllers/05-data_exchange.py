from gramlot import Page as BasePage


class Page(BasePage):
    title = "Data exchange"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="exchange")
        pane.h1("Data exchange")
        form = pane.section(class_="card stack", datapath=".record")
        form.html_label("Name", for_="name")
        form.input(value="^.name", id="name")
        form.html_label("Seats", for_="seats")
        form.input(type="number", value="^.seats", id="seats")
        form.html_label("Confirmed", for_="confirmed")
        form.input(type="checkbox", value="^.confirmed", id="confirmed")
        form.p("The record also contains a null note and a nested address.")
        actions = pane.div(class_="actions")
        for label, method in (("Inspect types", "inspect"), ("Save TYTX", "save"),
                              ("Restore TYTX", "restore"), ("Export JSON", "exportJson"),
                              ("Export XML", "exportXml"), ("Preview email text", "previewMail")):
            actions.button(label, type="button", id=method).dataController(func=method)
        pane.p("^.status", id="status")
        pane.pre("^.types", id="types")
        pane.pre("^.mail", id="mail")
