from gramlot import Page as BasePage


class Page(BasePage):
    title = "Checkbox group"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("Several choices, one value")
        pane.p("Choose several notification channels. Two groups share the same comma-separated codes; clearing all choices writes null.")
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.html_label("Columns (1–3): ", for_="columns").span("^columns", id="columns-value")
        controls.input(id="columns", type="range", min=1, max=3, value="^columns", live=True, width="16rem", max_width="100%")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.checkBoxText(id="channels", value="^channels", values="^choices", lbl="Notifications", cols="^columns", readonly="^locked", box_padding="8px")
        fields.checkBoxText(id="channels-copy", value="^channels", values="^choices", lbl="Same channels", cols=1, readonly="^locked", box_padding="8px")
        pane.p("Selected codes:")
        pane.p("^channels", id="channels-value")
        pane.dataSetter("choices", "email:Email,sms:SMS,push:Push")
        pane.dataSetter("channels", "email,push")
        pane.dataSetter("columns", 2)
        pane.dataSetter("locked", False)
