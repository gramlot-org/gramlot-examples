from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        options = root.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = root.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.colorpicker(id="color", value="^color", lbl="Accent color", live="^live",
                           disabled="^locked", default='#315fa8')
        fields.colorpicker(id="color-copy", value="^color", lbl="Same color", live="^live", disabled="^locked")
        root.div(background_color="^color", width="6rem", height="3rem", border="1px solid #888", aria_label="Color sample")
        root.p("^color", id="color-value")
