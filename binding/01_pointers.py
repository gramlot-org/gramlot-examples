from gramlot import Page as BasePage


class Page(BasePage):
    title = "Pointers"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack")
        pane.h1("^settings.caption", id="caption")
        pane.p("^settings.intro", class_="muted")

        settings = pane.section(datapath="settings", node_id="settings", class_="card stack")
        settings.h2("Relative pointers")
        settings.html_label("Caption", for_="caption-field")
        settings.input(value="^.caption", id="caption-field")
        settings.p("Inside datapath='settings', .caption means settings.caption.")
        settings.p("=.caption", id="first-caption", title="Read once with =: it does not follow the field.")

        person = pane.section(datapath="person", formId="person", class_="card stack")
        person.h2("Symbolic and attribute pointers")
        facts = person.dl()
        facts.dt("#settings.caption")
        facts.dd("^#settings.caption", id="symbolic")
        facts.dt("#FORM.name")
        facts.dd("^#FORM.name", id="form-name")
        facts.dt(".name?role")
        facts.dd("^.name?role", id="role")
        person.html_label("Role", for_="role-field")
        person.input(value="^.name?role", id="role-field")

        pane.dataSetter("settings.caption", "Pointers")
        pane.dataSetter("settings.intro", "Type in the fields: every ^ pointer follows the Data.")
        pane.dataSetter("person.name", "Ada Lovelace", role="Mathematician")
