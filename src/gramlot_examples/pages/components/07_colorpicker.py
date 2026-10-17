from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Color and labelbox'
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Color and labelbox')
        pane.p('Choose a color in either picker. Both controls and the swatch follow the same Data value.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.colorpicker(id="color", value="^color", lbl="Accent color", live="^live",
                           disabled="^locked", box_padding="8px")
        fields.colorpicker(id="color-copy", value="^color", lbl="Same color", live="^live", disabled="^locked")
        pane.div(background_color="^color", width="6rem", height="3rem", border="1px solid #888", aria_label="Color sample")
        pane.p("^color", id="color-value")
        for path, value in (('color', '#315fa8'), ('locked', False), ('live', True)):
            pane.dataSetter(path, value)
