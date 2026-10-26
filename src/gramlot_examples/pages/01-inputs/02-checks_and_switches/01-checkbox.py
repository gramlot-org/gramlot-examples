from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = "Checkbox: a boolean value"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("A boolean value")
        main_content.p("lbl names the field; label is the caption beside its checkbox.")
        fields = main_content.formlet(class_="card stack", width="100%", max_width="32rem")
        fields.checkbox(id="newsletter", value="^newsletter", lbl="Contact preferences",
                        label="Send me the newsletter", lbl_color="var(--gramlot-action)", disabled="^locked")
        fields.checkbox(id="newsletter-copy", value="^newsletter", lbl="Same preference",
                        label="Newsletter", disabled="^locked")
        options = main_content.details(max_width="32rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(value="^locked", lbl="State", label="Disable the preference", default=False)
        main_content.p("Subscribed", hidden="^newsletter:=!{}", id="subscribed")
        main_content.p("Not subscribed", hidden="^newsletter", id="not-subscribed")
