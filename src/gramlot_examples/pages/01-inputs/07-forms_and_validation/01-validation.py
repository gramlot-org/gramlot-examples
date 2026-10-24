from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    devices = ("desktop", "tablet", "phone")
    title = "Validate required values and text length"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("The draft and the accepted value")
        main_content.p("Try one letter, more than eight, or an empty name. The draft stays in the field; the Data below keeps the last valid value.")
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Timing", label="Validate while typing", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.textbox(id="name", value="^name", lbl="Name (2–8 characters)", live="^live",
                       validate_notnull=True, validate_len="2:8",
                       validate_notnull_error="Please enter a name.",
                       validate_len_error="Use between 2 and 8 characters.", box_c_width="16rem", box_c_max_width="100%")
        fields.p("Last accepted name:")
        fields.p("^name", id="accepted-name")
        fields.textbox(id="name-copy", value="^name", lbl="Another view of the Data", readonly=True,
                       box_c_width="16rem", box_c_max_width="100%")
        notes = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        notes.textBoxArea(id="notes", value="^notes", lbl="Optional note (up to 20 characters)", rows=2,
                          validate_len=":20", live="^live", box_c_width="18rem", box_c_max_width="100%")
        notes.p("^notes", id="accepted-notes")
        numbers = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        numbers.numberTextBox(id="quantity", value="^quantity", lbl="Required quantity — zero is valid",
                              validate_notnull=True, box_c_width="10rem", box_c_max_width="100%")
        numbers.p("^quantity", id="accepted-quantity")
