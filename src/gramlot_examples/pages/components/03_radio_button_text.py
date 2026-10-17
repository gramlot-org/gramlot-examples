from gramlot import Page as BasePage


class Page(BasePage):
    title = "RadioButtonText and labelbox"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("One code for each group")
        pane.p("Choose a delivery option: the Data stores its code, not its caption. "
               "The second group has its own value. Arrow keys move between options.")
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.html_label("Columns (1–3): ", for_="columns").span("^columns", id="columns-value")
        controls.input(id="columns", type="range", min=1, max=3, value="^columns", live=True,
                       width="16rem", max_width="100%")
        fields = pane.formlet(class_="card stack", width="100%", max_width="36rem")
        choices = "standard:Standard,express:Express,pickup:Pick up"
        fields.radioButtonText(id="shipping", value="^shipping", values=choices,
                               lbl="Delivery", cols="^columns",
                               lbl_color="#315fa8", box_padding="8px")
        fields.radioButtonText(id="alternative", value="^alternative", values=choices,
                               lbl="Alternative delivery", cols=3, box_padding="8px")
        facts = pane.dl()
        facts.dt("Delivery code")
        facts.dd("^shipping", id="shipping-value")
        facts.dt("Alternative code")
        facts.dd("^alternative", id="alternative-value")
        for path, value in (("shipping", "standard"), ("alternative", "pickup"),
                            ("columns", 3)):
            pane.dataSetter(path, value)
