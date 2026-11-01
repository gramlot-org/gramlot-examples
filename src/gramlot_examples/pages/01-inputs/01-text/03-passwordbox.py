from gramlot import Page as BasePage


class Page(BasePage):
    title = "Password fields"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while editing", default=True)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Disable controls", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.passwordbox(id="secret", value="^secret", lbl="Sample password", live="^live",
                           disabled="^locked", placeholder="Use a sample value")
        fields.passwordbox(id="secret-copy", value="^secret", lbl="Same sample password",
                           live="^live", disabled="^locked")
