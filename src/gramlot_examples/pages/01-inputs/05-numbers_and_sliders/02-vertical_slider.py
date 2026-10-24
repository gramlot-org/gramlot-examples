from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Vertical slider: orientation and values"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Vertical slider')
        main_content.p('Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.verticalSlider(id="level", value="^level", lbl="Vertical level", min=0, max=100, step=5,
                              live="^live", disabled="^locked", box_padding="8px", default=50)
        fields.horizontalSlider(id="level-copy", value="^level", lbl="Same level horizontally", min=0, max=100, step=5,
                                live="^live", disabled="^locked")
        main_content.p("^level", id="level-value")
