from gramlot import Page as BasePage
from gramlot import source

RECORDS = {"lamp": ("Lamp", 3), "desk": ("Desk", 0), "chair": ("Chair", 12)}


class Page(BasePage):
    title = "Remote"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="catalog")
        pane.h1("Remote")

        form = pane.form(class_="card stack")
        form.html_label("Record", for_="record")
        choice = form.select(value="^.record_id", id="record")
        for key, (name, _stock) in RECORDS.items():
            choice.option(name, value=key)

        details = pane.section("Waiting for the server", class_="card stack", id="details")
        details.remote("details", record_id="^.record_id")

        pane.dataSetter(".record_id", "lamp")

    @source
    def details(self, root, record_id, **kwargs):
        name, stock = RECORDS[record_id]
        root.h2(name, id="name")
        root.p(f"{stock} in stock", id="stock")
