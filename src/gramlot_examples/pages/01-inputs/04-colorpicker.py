from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Choose and bind a color"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Choose a color, update every view')
        main_content.p('Choose a color in either picker. Both controls and the swatch follow the same Data value.')
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.colorpicker(id="color", value="^color", lbl="Accent color", live="^live",
                           disabled="^locked", default='#315fa8')
        fields.colorpicker(id="color-copy", value="^color", lbl="Same color", live="^live", disabled="^locked")
        main_content.div(background_color="^color", width="6rem", height="3rem", border="1px solid #888", aria_label="Color sample")
        main_content.p("^color", id="color-value")
