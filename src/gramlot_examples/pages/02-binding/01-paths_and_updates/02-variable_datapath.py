from gramlot import Page as BasePage

OPTIONS = (("ada", "Ada Lovelace"), ("alan", "Alan Turing"), ("grace", "Grace Hopper"))


class Page(BasePage):
    title = "Variable datapath"

    def main(self, root):
        pane = root.div(class_="example-page stack")
        pane.h1("Variable datapath")
        pane.html_label("Record", for_="record")
        choice = pane.select(id="record", value="^current", default='people.ada')
        for key, caption in OPTIONS:
            choice.option(caption, value=f"people.{key}")

        card = pane.article(datapath="^current", class_="card stack")
        card.h2("^.name", id="name")
        card.p("^.field", id="field")
        card.p("^.born", id="born", class_="muted")
        card.html_label("Edit the name of this record", for_="name-field")
        card.input(value="^.name", id="name-field")
        pane.p("^current", id="current", class_="muted")
