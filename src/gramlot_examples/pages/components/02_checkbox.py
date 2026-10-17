from gramlot import Page as BasePage


class Page(BasePage):
    title = "Checkbox and labelbox"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("A boolean value")
        pane.p("lbl names the field; label is the caption beside its checkbox.")
        fields = pane.formlet(class_="card stack", width="100%", max_width="32rem")
        fields.checkbox(id="newsletter", value="^newsletter", lbl="Contact preferences",
                        label="Send me the newsletter", lbl_color="#315fa8", box_padding="8px", disabled="^locked")
        fields.checkbox(id="newsletter-copy", value="^newsletter", lbl="Same preference",
                        label="Newsletter", disabled="^locked")
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(value="^locked", lbl="State", label="Disable the preference")
        pane.p("Subscribed", hidden="^newsletter:=!{}", id="subscribed")
        pane.p("Not subscribed", hidden="^newsletter", id="not-subscribed")
        for path, value in (("newsletter", False), ("locked", False), ):
            pane.dataSetter(path, value)
