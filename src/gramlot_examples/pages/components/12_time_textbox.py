from gramlot import Page as BasePage
from datetime import time


class Page(BasePage):
    title = 'Time editing'
    locale = "it-IT"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1('Time editing')
        pane.p('Edit a civil time with hours, minutes and optional seconds. The two fields keep the same typed value.')
        controls = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        controls.checkbox(id="live", value="^live", lbl="Editing", label="Update while typing")
        controls.checkbox(id="locked", value="^locked", lbl="State", label="Read only")
        fields = pane.formlet(class_="card stack", width="100%", max_width="24rem")
        fields.timeTextBox(id="time", value="^time", lbl="Departure", format="medium", live="^live", readonly="^locked", box_c_width="14rem")
        fields.timeTextBox(id="time-copy", value="^time", lbl="Same time, short display", format="short", readonly="^locked", box_c_width="14rem")
        pane.p("^time", id="time-value", format="medium", dtype="H")
        pane.dataSetter('time', time(9, 30))
        pane.dataSetter("live", False)
        pane.dataSetter("locked", False)
