from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout

from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = 'Number editing'
    locale = "it-IT"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Number editing')
        main_content.p('Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while typing", default=False)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.numberTextBox(id="amount", value="^amount", lbl="Amount (0–100)", format="0.00", min=0, max=100, live="^live", readonly="^locked", box_c_width="14rem")
        fields.numberTextBox(id="amount-copy", value="^amount", lbl="Same amount", format="0.00", readonly="^locked", box_c_width="14rem")
        fields.numberTextBox(id="quantity", value="^quantity", lbl="Integer", dtype="L", readonly="^locked", box_c_width="10rem")
        fields.numberTextBox(id="exact", value="^exact", lbl="Exact Decimal", dtype="N", format="0.00", readonly="^locked", box_c_width="16rem")
        main_content.p("^amount", id="amount-value", format="0.00", dtype="R")
        main_content.p("^exact", id="exact-value", format="0.00", dtype="N")
