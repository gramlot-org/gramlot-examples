from gramlot.collections.inputs import mygramlot as inputs
from gramlot.collections.layout import mygramlot as layout
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [inputs, layout]
    title = 'Date editing'
    locale = "it-IT"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Date editing')
        main_content.p('Enter a calendar date or a word such as oggi or domani. Two fields share one civil date.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while typing", default=False)
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only", default=False)
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.dateTextBox(id="date", value="^date", lbl="Appointment", format="long",  live="^live", readonly="^locked", box_c_width="16rem")
        fields.dateTextBox(id="date-copy", value="^date", lbl="Same date, short display", calendar=False, format="short",  readonly="^locked", box_c_width="14rem")
        main_content.p("^date", id="date-value", format="long", dtype="D")
