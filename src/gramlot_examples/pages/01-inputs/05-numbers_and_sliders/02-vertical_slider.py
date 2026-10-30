from gramlot import Page as BasePage


class Page(BasePage):
    title = "Vertical slider: orientation and values"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Vertical slider')
        main_content.p('Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.')
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.verticalSlider(id="level", value="^level", lbl="Vertical level", min=0, max=100, step=5,
                              live="^live", disabled="^locked", default=50)
        fields.horizontalSlider(id="level-copy", value="^level", lbl="Same level horizontally", min=0, max=100, step=5,
                                live="^live", disabled="^locked")
        main_content.p("^level", id="level-value")
