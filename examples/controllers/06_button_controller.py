from gramlot import Page as BasePage

KEYS = ("[button_shift && 'Shift', button_ctrl && 'Ctrl', button_alt && 'Alt', button_meta && 'Meta']"
        ".filter(Boolean).join('+') || 'none'")


class Page(BasePage):
    title = "Button controller"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="buttons")
        pane.h1("Button controller")

        nested = pane.section(class_="card stack")
        nested.h2("A controller nested in the button")
        button = nested.button("Press me, also with Shift or Alt", id="press")
        button.dataController(f"this.SET('.clicks', button_counter); this.SET('.keys', {KEYS})")
        facts = nested.dl()
        for label, key in (("button_counter", "clicks"), ("Modifier keys", "keys")):
            facts.dt(label)
            facts.dd(f"^.{key}", id=key)

        fired = pane.section(class_="card stack")
        fired.h2("fire and fire_<name>")
        fired.button("Save (fire)", fire=".saved", id="save")
        fired.p("^.saved_with", id="saved-with")
        fired.button("Save and close (fire_save, fire_close)", fire_save=".command", fire_close=".command",
                     id="save-close")
        fired.p("^.log", id="log")

        pane.dataController("this.SET('.saved_with', 'fired with ' + saved)", saved="^.saved")
        pane.dataController("this.SET('.log', (log ? log + ', ' : '') + command)", command="^.command", log="=.log")
        pane.dataSetter(".clicks", 0)
