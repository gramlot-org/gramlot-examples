from gramlot import Page as BasePage


class Page(BasePage):
    title = "Formlet and shared labels"
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("One layout, shared label settings")
        pane.p("Change the columns. The fields keep their values and their own label overrides.")
        controls = pane.formlet(class_="card stack", max_width="24rem")
        controls.html_label("Columns", for_="columns")
        select = controls.select(id="columns", value="^columns", width="6rem")
        select.option("One", value="1")
        select.option("Two", value="2")
        fields = pane.formlet(id="fields", columns="^columns:=Number({})", datapath="customer",
                              lbl_position="L", lbl_text_align="right",
                              box_c_width="100%", max_width="44rem", gap="10px 16px")
        fields.textbox(id="first-name", value="^.name", lbl="Name")
        fields.textbox(value="^.surname", lbl="Surname")
        fields.textbox(value="^.city", lbl="City")
        fields.checkbox(value="^.enabled", lbl="Active")
        fields.textBoxArea(value="^.notes", lbl="Notes (override)", lbl_position="TL", rows=2)
        pane.p("^customer.name", id="accepted-name")
        for path, value in (("columns", "2"), ("customer.name", "Ada"), ("customer.surname", "Lovelace"),
                            ("customer.city", "London"), ("customer.enabled", True), ("customer.notes", "A shared layout")):
            pane.dataSetter(path, value)
