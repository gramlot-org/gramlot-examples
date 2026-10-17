from gramlot import Page as BasePage


class Page(BasePage):
    title = "Checkbox as a switch"
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("One boolean, two presentations")
        pane.p("Click a caption or focus the switch and press Space. Both controls share the same Data.")
        fields = pane.formlet(columns=1, max_width="26rem", lbl_position="L")
        fields.checkbox(id="notifications-switch", value="^enabled", lbl="Notifications", label="Email updates",
                        mode="switch", switch_color="^switch_color", readonly="^readonly", disabled="^disabled")
        fields.checkbox(id="notifications-check", value="^enabled", lbl="Same boolean", label="Email updates",
                        readonly="^readonly", disabled="^disabled")
        fields.checkbox(value="^readonly", lbl="Read only", mode="switch")
        fields.checkbox(value="^disabled", lbl="Disabled", mode="switch")
        pane.p("^enabled", id="enabled-value")
        for path, value in (("switch_color", "purple"), ("enabled", True), ("readonly", False), ("disabled", False)):
            pane.dataSetter(path, value)
