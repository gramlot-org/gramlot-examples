from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        fields = root.formlet(class_="card stack", width="100%", max_width="32rem")
        fields.checkbox(id="newsletter", value="^newsletter", lbl="Contact preferences",
                        label="Send me the newsletter", lbl_color="var(--gramlot-action)", disabled="^locked")
        fields.checkbox(id="newsletter-copy", value="^newsletter", lbl="Same preference",
                        label="Newsletter", disabled="^locked")
        options = root.details(max_width="32rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(value="^locked", lbl="State", label="Disable the preference", default=False)
        root.p("Subscribed", hidden="^newsletter:=!{}", id="subscribed")
        root.p("Not subscribed", hidden="^newsletter", id="not-subscribed")
