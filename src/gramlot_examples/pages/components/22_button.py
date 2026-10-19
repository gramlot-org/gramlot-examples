from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Button commands'
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("One shared command engine")
        main_content.p("Confirm the action, or click the delayed command several times: only the last burst is delivered.")
        actions = main_content.div(class_="card stack", max_width="26rem")
        actions.button("Confirm action", id="command-confirm", icon="✓", action="this.SET('result', 'Confirmed')", ask="Run this command?")
        actions.button("Delayed command", id="command-delay", _delay=300, action="this.SET('result', 'Delayed: ' + _counter)")
        actions.html_button("Plain HTML", type="button", id="command-native", connect_onclick="this.SET('result', 'Explicit HTML event')")
        main_content.p("^result", id="command-result")
        main_content.dataSetter("result", "No command yet")
