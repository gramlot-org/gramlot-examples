from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Toggle button with LED'
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("A boolean command with an LED")
        fields = main_content.formlet(columns=1, max_width="26rem", lbl_position="L")
        fields.toggleButton("Enabled", id="toggle-command", value="^enabled", readonly="^readonly", disabled="^disabled", action="this.SET('result', this.GET('enabled') ? 'Enabled' : 'Disabled')")
        fields.checkbox(value="^enabled", lbl="Same Data", id="toggle-checkbox")
        fields.checkbox(value="^readonly", lbl="Read only")
        fields.checkbox(value="^disabled", lbl="Disabled")
        main_content.p("^result", id="toggle-result")
        for path, value in (("enabled", False), ("readonly", False), ("disabled", False), ("result", "No command yet")):
            main_content.dataSetter(path, value)
