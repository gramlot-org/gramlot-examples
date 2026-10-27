from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Horizontal slider: range and steps"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Horizontal slider')
        main_content.p('Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.')
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.horizontalSlider(id="level", value="^level", lbl="Level", min=0, max=100, step=5,
                                live="^live", disabled="^locked", default=50)
        fields.horizontalSlider(id="level-copy", value="^level", lbl="Same level", min=0, max=100, step=5,
                                live="^live", disabled="^locked")
        main_content.p("^level", id="level-value")
