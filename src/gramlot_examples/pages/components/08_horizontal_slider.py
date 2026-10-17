from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Horizontal slider'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Horizontal slider')
        pane.p('Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.horizontalSlider(id="level", value="^level", lbl="Level", min=0, max=100, step=5,
                                live="^live", disabled="^locked", box_padding="8px")
        fields.horizontalSlider(id="level-copy", value="^level", lbl="Same level", min=0, max=100, step=5,
                                live="^live", disabled="^locked")
        pane.p("^level", id="level-value")
        for path, value in (('level', 50), ('locked', False), ('live', True)):
            pane.dataSetter(path, value)
