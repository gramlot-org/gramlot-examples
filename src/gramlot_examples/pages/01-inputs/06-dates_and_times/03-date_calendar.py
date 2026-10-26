from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    devices = ("desktop", "tablet", "phone")
    title = "Inline and popup calendars"
    locale = "it-IT"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("One date, three editors")
        main_content.p("Pick a day or type a date. The inline calendar, popup and text-only field share the same Data value.")
        options = main_content.details(max_width="24rem")
        options.summary("Options · change the behavior")
        controls = options.formlet(class_="stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.dateTextBox(id="date", value="^date", lbl="With popup",
                           readonly="^locked", box_c_width="14rem", box_c_max_width="100%")
        fields.dateTextBox(id="plain", value="^date", lbl="Text only", calendar=False,
                            readonly="^locked", box_c_width="14rem", box_c_max_width="100%")
        fields.dateCalendar(id="calendar", value="^date", lbl="Choose a day",  readonly="^locked", lbl_color="var(--gramlot-action)",
                            box_c_max_width="100%")
        main_content.p("^date", id="date-value", format="long", dtype="D")
