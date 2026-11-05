from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        options = root.details(max_width="36rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.html_label("Columns (1–3): ", for_="columns").span("^columns", id="columns-value")
        controls.input(id="columns", type="range", min=1, max=3, value="^columns", live=True,
                       width="16rem", max_width="100%", default=3)
        fields = root.formlet(class_="card stack", width="100%", max_width="36rem")
        choices = "standard:Standard,express:Express,pickup:Pick up"
        fields.radioButtonText(id="shipping", value="^shipping", values=choices,
                               lbl="Delivery", cols="^columns",
                               lbl_color="var(--gramlot-action)")
        fields.radioButtonText(id="alternative", value="^alternative", values=choices,
                               lbl="Alternative delivery", cols=3)
        facts = root.dl()
        facts.dt("Delivery code")
        facts.dd("^shipping", id="shipping-value")
        facts.dt("Alternative code")
        facts.dd("^alternative", id="alternative-value")
