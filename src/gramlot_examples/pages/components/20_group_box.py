from datetime import date
from gramlot import Page as BasePage


class Page(BasePage):
    title = "GroupBox and typed copy"
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)
    locale = "it-IT"

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("A group with its own Data scope")
        pane.p("The copy icon writes TYTX. Use the arrow beside it to choose JSON instead.")
        group = pane.groupBox(id="customer-group", lbl="Customer", datapath="customer", copy=True, max_width="44rem")
        fields = group.formlet(col_min_width="18rem", lbl_position="L", box_c_width="100%")
        fields.textbox(value="^.name", lbl="Name")
        fields.dateTextBox(value="^.date", lbl="Date", format="short")
        fields.numberTextBox(value="^.amount", lbl="Amount")
        fields.checkbox(value="^.enabled", lbl="Active")
        other = pane.groupBox(lbl="Outside the copied group", datapath="other", lbl_variant="underline", max_width="24rem")
        other.textbox(value="^.note", lbl="Note", box_c_width="100%")
        pane.p("JSON is values-only: use TYTX when types and Bag node attributes must survive the round trip.")
        for path, value in (("customer.name", "Ada"), ("customer.date", date(2026, 10, 17)),
                            ("customer.amount", 1234.5), ("customer.enabled", True),
                            ("other.note", "This text is not copied")):
            pane.dataSetter(path, value)
