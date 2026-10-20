from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Vertical slider'

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Vertical slider')
        main_content.p('Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.verticalSlider(id="level", value="^level", lbl="Vertical level", min=0, max=100, step=5,
                              live="^live", disabled="^locked", box_padding="8px")
        fields.horizontalSlider(id="level-copy", value="^level", lbl="Same level horizontally", min=0, max=100, step=5,
                                live="^live", disabled="^locked")
        main_content.p("^level", id="level-value")
        for path, value in (('level', 50), ('locked', False), ('live', True)):
            main_content.dataSetter(path, value)
