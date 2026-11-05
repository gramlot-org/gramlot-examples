from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        options = root.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = root.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.textBoxArea(id="notes", value="^notes", lbl="Notes", rows=4, cols=24,
                           placeholder="Write a few lines", live="^live", disabled="^locked")
        fields.textBoxArea(id="notes-copy", value="^notes", lbl="Same notes", rows=3, cols=24,
                           live="^live", disabled="^locked")
