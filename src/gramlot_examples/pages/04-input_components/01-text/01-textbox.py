from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    devices = ("desktop", "tablet", "phone")
    title = "Textbox and labelbox"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("One value, two textboxes")
        main_content.p("Type in either field. Both share the same Data value.")
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.html_label("Label position", for_="position")
        position = controls.select(id="position", value="^position", width="8rem", max_width="100%", default='TL')
        for code in ("TL", "TC", "TR", "L", "R", "BL", "BC", "BR"):
            position.option(code, value=code)
        controls.checkbox(value="^live", lbl="Editing", label="Update while typing", default=True)
        controls.checkbox(value="^readonly", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="32rem")
        fields.textbox(id="customer", value="^customer", lbl="Customer",
                       lbl_position="^position", live="^live", readonly="^readonly",
                       placeholder="Enter a name", lbl_color="#315fa8",
                       box_padding="8px", box_l_padding="4px", box_c_width="240px")
        fields.textbox(id="customer-copy", value="^customer", lbl="Same customer",
                       live="^live", readonly="^readonly")
        main_content.h2("The Data")
        main_content.p("^customer", id="customer-value")
