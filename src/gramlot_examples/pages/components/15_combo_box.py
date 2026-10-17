from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Combo box'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Combo box')
        pane.p('Choose a suggested city or enter a different one. Two fields share the same text; suggestions do not restrict what you can write.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.comboBox(id="choice", value="^choice", values="^choices", lbl="City", readonly="^locked", box_c_width="16rem", placeholder="Choose or type a city")
        fields.comboBox(id="choice-copy", value="^choice", values="^choices", lbl="Same city", readonly="^locked", box_c_width="16rem")
        pane.dataSetter("choices", "Rome,Paris,Berlin")
        pane.dataSetter("choice", "Rome")
        pane.p("Stored text:")
        pane.p("^choice", id="choice-value")
        pane.dataSetter("locked", False)
