from gramlot import Page as BasePage


class Page(BasePage):
    title = "Controller"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="demo")
        pane.h1("Controller")

        check = pane.section(class_="card stack")
        check.h2("React to a value")
        check.html_label("Name", for_="name")
        check.input(value="^.name", live=True, id="name")
        check.p("The name is empty", id="warning", class_="status status--warning", visible="^.invalid")
        check.dataController("this.SET('.invalid', !name.trim())", name="^.name", _init=True)

        fired = pane.section(class_="card stack")
        fired.h2("React to a fired path")
        fired.button("Send a request", fire=".request", id="request")
        fired.p("^.requests", id="requests")
        fired.dataController("this.SET('.requests', requests + 1)", _fired="^.request", requests="=.requests")

        delayed = pane.section(class_="card stack")
        delayed.h2("Wait for a pause (_delay)")
        delayed.html_label("Search", for_="query")
        delayed.input(value="^.query", live=True, id="query")
        delayed.p("^.searched", id="searched")
        delayed.dataController("this.SET('.searched', 'Searching for ' + query)", query="^.query", _delay=400)

        timed = pane.section(class_="card stack")
        timed.h2("Run at start and at intervals (_onStart, _timing)")
        timed.html_label("Interval in seconds", for_="interval")
        interval = timed.select(value="^.interval", id="interval")
        for seconds in (0, 1, 5):
            interval.option(str(seconds), value=str(seconds))
        timed.p("^.ticks", id="ticks")
        timed.dataController("this.SET('.ticks', (ticks ?? 0) + 1)", ticks="=.ticks", _timing="^.interval",
                             _onStart=True)

        pane.dataSetter(".name", "Ada")
        pane.dataSetter(".requests", 0)
        pane.dataSetter(".interval", "1")
