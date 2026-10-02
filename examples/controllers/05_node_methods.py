from gramlot import Page as BasePage

ACTIONS = (
    ("SET: add 1", "set", "this.SET('.value', this.GET('.value') + 1)"),
    ("PUT: add 10 silently", "put", "this.PUT('.value', this.GET('.value') + 10)"),
    ("FIRE 'now'", "fire", "this.FIRE('.ping', 'now')"),
    ("FIRE_AFTER 'later', 1 s", "fire-after", "this.FIRE_AFTER('.ping', 'later', 1000)"),
)


class Page(BasePage):
    title = "Node methods"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="methods")
        pane.h1("Node methods")
        actions = pane.div(class_="actions")
        for label, key, script in ACTIONS:
            actions.button(label, action=script, id=key)

        result = pane.section(class_="card stack")
        facts = result.dl()
        for label, pointer, key in (("value (^.value)", "^.value", "value"),
                                    ("Changes notified", "^.notified", "notified"),
                                    ("Pings received", "^.pings", "pings"),
                                    ("Last ping", "^.last", "last")):
            facts.dt(label)
            facts.dd(pointer, id=key)
        result.button("GET value", action="this.SET('.read', this.GET('.value'))", id="get")
        result.p("^.read", id="read", class_="muted")

        pane.dataController("this.SET('.notified', notified + 1)", value="^.value", notified="=.notified")
        pane.dataController("this.SET('.pings', pings + 1); this.SET('.last', ping)", ping="^.ping",
                            pings="=.pings")
        pane.dataSetter(".value", 0)
        pane.dataSetter(".notified", 0)
        pane.dataSetter(".pings", 0)
