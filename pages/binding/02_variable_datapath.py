from gramlot import Page as BasePage

PEOPLE = {
    "ada": {"name": "Ada Lovelace", "field": "Mathematics", "born": 1815},
    "alan": {"name": "Alan Turing", "field": "Computer science", "born": 1912},
    "grace": {"name": "Grace Hopper", "field": "Programming languages", "born": 1906},
}


class Page(BasePage):
    title = "Variable datapath"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack")
        pane.h1("Variable datapath")
        pane.html_label("Record", for_="record")
        choice = pane.select(id="record", value="^current")
        for key, person in PEOPLE.items():
            choice.option(person["name"], value=f"people.{key}")

        card = pane.article(datapath="^current", class_="card stack")
        card.h2("^.name", id="name")
        card.p("^.field", id="field")
        card.p("^.born", id="born", class_="muted")
        card.html_label("Edit the name of this record", for_="name-field")
        card.input(value="^.name", id="name-field")
        pane.p("^current", id="current", class_="muted")

        pane.dataSetter("people", PEOPLE)
        pane.dataSetter("current", "people.ada")
