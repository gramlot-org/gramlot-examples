from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Formlet and shared labels"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("One layout, shared label settings")
        main_content.p("Change the columns. The fields keep their values and their own label overrides.")
        controls = main_content.formlet(class_="card stack", max_width="24rem")
        controls.html_label("Columns", for_="columns")
        select = controls.select(id="columns", value="^columns", width="6rem", default='2')
        select.option("One", value="1")
        select.option("Two", value="2")
        fields = main_content.formlet(id="fields", columns="^columns:=Number({})", datapath="customer",
                                      lbl_position="L", lbl_text_align="right",
                                      box_c_width="100%", max_width="44rem", gap="10px 16px")
        fields.textbox(id="first-name", value="^.name", lbl="Name")
        fields.textbox(value="^.surname", lbl="Surname")
        fields.textbox(value="^.city", lbl="City")
        fields.checkbox(value="^.enabled", lbl="Active", default=True)
        fields.textBoxArea(value="^.notes", lbl="Notes (override)", lbl_position="TL", rows=2)
        main_content.p("^customer.name", id="accepted-name")
