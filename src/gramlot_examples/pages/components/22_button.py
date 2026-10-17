from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Button commands'
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("One shared command engine")
        pane.p("Confirm the action, or click the delayed command several times: only the last burst is delivered.")
        actions = pane.div(class_="card stack", max_width="26rem")
        actions.button("Confirm action", id="command-confirm", icon="✓", action="this.SET('result', 'Confirmed')", ask="Run this command?")
        actions.button("Delayed command", id="command-delay", _delay=300, action="this.SET('result', 'Delayed: ' + _counter)")
        actions.html_button("Plain HTML", type="button", id="command-native", connect_onclick="this.SET('result', 'Explicit HTML event')")
        pane.p("^result", id="command-result")
        pane.dataSetter("result", "No command yet")
