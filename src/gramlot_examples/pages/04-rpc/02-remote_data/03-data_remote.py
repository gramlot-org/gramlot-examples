from gramlot import Page as BasePage
from gramlot import endpoint

MENUS = {"dishes": ("Soup", "Risotto", "Fish"), "drinks": ("Water", "Lemonade", "Coffee")}


class Page(BasePage):
    title = "Fetch Data with dataRemote"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="kitchen")
        pane.h1("Data remote")
        pane.p("Compare the live menu with Read current value. Changing the table updates the bound view; the explicit snapshot stays unchanged until you read again.")

        form = pane.form(class_="card stack")
        form.html_label("Table", for_="table")
        choice = form.select(value="^.table", id="table")
        for key in MENUS:
            choice.option(key.title(), value=key)

        result = pane.section(class_="card stack")
        result.h2("Menu, loaded by the server when it is read")
        result.p("^.menu", id="menu")

        result.button("Read current value", id="read-menu").dataController(func="readMenu")
        result.p("Snapshot returned by the explicit read:", class_="muted")
        result.p("^.read_value", id="read-value")

        pane.dataRemote(".menu", "load_menu", cacheTime=5, table="^.table")

    @endpoint
    def load_menu(self, table, **kwargs):
        return ", ".join(MENUS[table])
