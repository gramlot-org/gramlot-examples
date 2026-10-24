from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Checkbox as a switch"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("One boolean, two presentations")
        main_content.p("Click a caption or focus the switch and press Space. Both controls share the same Data.")
        fields = main_content.formlet(columns=1, max_width="26rem", lbl_position="L")
        fields.checkbox(id="notifications-switch", value="^enabled", lbl="Notifications", label="Email updates",
                        mode="switch", switch_color="^switch_color", readonly="^readonly", disabled="^disabled", default=True, default_switch_color='purple')
        fields.checkbox(id="notifications-check", value="^enabled", lbl="Same boolean", label="Email updates",
                        readonly="^readonly", disabled="^disabled")
        fields.checkbox(value="^readonly", lbl="Read only", mode="switch", default=False)
        fields.checkbox(value="^disabled", lbl="Disabled", mode="switch", default=False)
        main_content.p("^enabled", id="enabled-value")
