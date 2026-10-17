from gramlot import Page as BasePage
from decimal import Decimal


class Page(BasePage):
    title = 'Number editing'
    locale = "it-IT"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Number editing')
        pane.p('Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while typing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.numberTextBox(id="amount", value="^amount", lbl="Amount (0–100)", format="0.00", min=0, max=100, live="^live", readonly="^locked", box_c_width="14rem")
        fields.numberTextBox(id="amount-copy", value="^amount", lbl="Same amount", format="0.00", readonly="^locked", box_c_width="14rem")
        fields.numberTextBox(id="quantity", value="^quantity", lbl="Integer", dtype="L", readonly="^locked", box_c_width="10rem")
        fields.numberTextBox(id="exact", value="^exact", lbl="Exact Decimal", dtype="N", format="0.00", readonly="^locked", box_c_width="16rem")
        pane.p("^amount", id="amount-value", format="0.00", dtype="R")
        pane.p("^exact", id="exact-value", format="0.00", dtype="N")
        pane.dataSetter('amount', 12.5)
        pane.dataSetter('quantity', 3)
        pane.dataSetter('exact', Decimal('9007199254740993.25'))
        pane.dataSetter("live", False)
        pane.dataSetter("locked", False)
