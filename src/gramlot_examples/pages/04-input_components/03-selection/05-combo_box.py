from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = 'Combo box'

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Combo box')
        main_content.p('Choose a suggested city or enter a different one. Two fields share the same text; suggestions do not restrict what you can write.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.comboBox(id="choice", value="^choice", values="^choices", lbl="City", readonly="^locked", box_c_width="16rem", placeholder="Choose or type a city")
        fields.comboBox(id="choice-copy", value="^choice", values="^choices", lbl="Same city", readonly="^locked", box_c_width="16rem")
        main_content.p("Stored text:")
        main_content.p("^choice", id="choice-value")
