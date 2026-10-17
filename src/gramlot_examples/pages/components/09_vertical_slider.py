from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Vertical slider'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Vertical slider')
        pane.p('Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.verticalSlider(id="level", value="^level", lbl="Vertical level", min=0, max=100, step=5,
                              live="^live", disabled="^locked", box_padding="8px")
        fields.horizontalSlider(id="level-copy", value="^level", lbl="Same level horizontally", min=0, max=100, step=5,
                                live="^live", disabled="^locked")
        pane.p("^level", id="level-value")
        for path, value in (('level', 50), ('locked', False), ('live', True)):
            pane.dataSetter(path, value)
