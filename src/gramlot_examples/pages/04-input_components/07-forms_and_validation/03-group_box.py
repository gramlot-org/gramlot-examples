from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "GroupBox and typed copy"
    devices = ("desktop", "tablet", "phone")
    locale = "it-IT"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("A group with its own Data scope")
        main_content.p("The copy icon writes TYTX. Use the arrow beside it to choose JSON instead.")
        group = main_content.groupBox(id="customer-group", lbl="Customer", datapath="customer", copy=True, max_width="44rem")
        fields = group.formlet(col_min_width="18rem", lbl_position="L", box_c_width="100%")
        fields.textbox(value="^.name", lbl="Name")
        fields.dateTextBox(value="^.date", lbl="Date", format="short")
        fields.numberTextBox(value="^.amount", lbl="Exact amount", dtype="N")
        fields.checkbox(value="^.enabled", lbl="Active", default=True)
        other = main_content.groupBox(lbl="Outside the copied group", datapath="other", lbl_variant="underline", max_width="24rem")
        other.textbox(value="^.note", lbl="Note", box_c_width="100%")
        main_content.p("JSON is values-only: use TYTX when types and Bag node attributes must survive the round trip.")
