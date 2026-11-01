from gramlot import Page as BasePage


class Page(BasePage):
    title = "Toggle buttons and selection state"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        fields = main_content.formlet(columns=1, max_width="26rem", lbl_position="L")
        fields.toggleButton("Enabled", id="toggle-command", value="^enabled", readonly="^readonly", disabled="^disabled", action="this.SET('result', this.GET('enabled') ? 'Enabled' : 'Disabled')", default=False)
        fields.checkbox(value="^enabled", lbl="Same Data", id="toggle-checkbox")
        fields.checkbox(value="^readonly", lbl="Read only", default=False)
        fields.checkbox(value="^disabled", lbl="Disabled", default=False)
        main_content.p("^result", id="toggle-result")
