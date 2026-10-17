from datetime import date
from gramlot import Page as BasePage


class Page(BasePage):
    devices = ("desktop", "tablet", "phone")
    title = "Date calendar"
    locale = "it-IT"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("One date, three editors")
        pane.p("Pick a day or type a date. The inline calendar, popup and text-only field share the same Data value.")
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.dateTextBox(id="date", value="^date", lbl="With popup",
                           readonly="^locked", box_c_width="14rem", box_c_max_width="100%")
        fields.dateTextBox(id="plain", value="^date", lbl="Text only", calendar=False,
                            readonly="^locked", box_c_width="14rem", box_c_max_width="100%")
        fields.dateCalendar(id="calendar", value="^date", lbl="Choose a day",  readonly="^locked", lbl_color="#4369c5",
                            box_c_max_width="100%")
        pane.p("^date", id="date-value", format="long", dtype="D")
        pane.dataSetter("date", date(2026, 10, 16))
        pane.dataSetter("locked", False)
