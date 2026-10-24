from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Checkbox group: select several values"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("Several choices, one value")
        main_content.p("Choose several notification channels. Two groups share the same comma-separated codes; clearing all choices writes null.")
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.html_label("Columns (1–3): ", for_="columns").span("^columns", id="columns-value")
        controls.input(id="columns", type="range", min=1, max=3, value="^columns", live=True, width="16rem", max_width="100%", default=2)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.checkBoxText(id="channels", value="^channels", values="^choices", lbl="Notifications", cols="^columns", readonly="^locked", box_padding="8px")
        fields.checkBoxText(id="channels-copy", value="^channels", values="^choices", lbl="Same channels", cols=1, readonly="^locked", box_padding="8px")
        main_content.p("Selected codes:")
        main_content.p("^channels", id="channels-value")
