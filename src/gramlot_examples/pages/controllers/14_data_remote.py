from gramlot import Page as BasePage
from gramlot import endpoint

MENUS = {"dishes": ("Soup", "Risotto", "Fish"), "drinks": ("Water", "Lemonade", "Coffee")}


class Page(BasePage):
    title = "Data remote"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="kitchen")
        pane.h1("Data remote")

        form = pane.form(class_="card stack")
        form.html_label("Table", for_="table")
        choice = form.select(value="^.table", id="table")
        for key in MENUS:
            choice.option(key.title(), value=key)

        result = pane.section(class_="card stack")
        result.h2("Menu, loaded by the server when it is read")
        result.p("^.menu", id="menu")

        pane.dataRemote(".menu", "load_menu", cacheTime=5, table="^.table")
        pane.dataSetter(".table", "dishes")

    @endpoint
    def load_menu(self, table=None, **kwargs):
        return ", ".join(MENUS[table])
