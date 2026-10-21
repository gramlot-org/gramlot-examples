from gramlot import Page as BasePage
from datetime import time


class Page(BasePage):
    title = 'Time editing'
    locale = "it-IT"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1('Time editing')
        main_content.p('Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value.')
        controls = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while typing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = main_content.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.timeTextBox(id="time", value="^time", lbl="Departure", format="medium", live="^live", readonly="^locked", box_c_width="14rem")
        fields.timeTextBox(id="time-copy", value="^time", lbl="Same time, short display", format="short", readonly="^locked", box_c_width="14rem")
        main_content.p("^time", id="time-value", format="medium", dtype="H")
        main_content.dataSetter('time', time(9, 30))
        main_content.dataSetter("live", False)
        main_content.dataSetter("locked", False)
