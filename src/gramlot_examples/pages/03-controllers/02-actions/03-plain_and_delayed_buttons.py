from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="clicks")
        form = main_content.form(class_="card stack")
        form.html_label("Native value", for_="native-value")
        form.input(id="native-value", value="Original")
        form.html_button("Native reset", type="reset", width="fit-content", id="native-reset")
        main_content.button("Immediate action", id="immediate",
                            action="this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)")
        main_content.button("Delayed action", id="delayed", _delay=600,
                            action="this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)")
        main_content.button("Delayed controller", id="delayed-controller", _delay=600).dataController(func="countBurst")
        main_content.button("Delayed confirmation", id="delayed-ask", _delay=600,
                            action="this.SET('.count', _counter); this.SET('.runs', this.GET('.runs') + 1)",
                            ask="Run this group of clicks?")
        main_content.html_label("Clicks", for_="count")
        main_content.output("^.count", id="count")
        main_content.html_label("Executions", for_="runs")
        main_content.output("^.runs", id="runs")
