from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Dropdown commands and persistence'
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("Execute, or execute and remember")
        pane.p("Click a menu entry to execute it. Hold Shift while selecting it to also change the main action and caption. Reload to verify persistence.")
        actions = pane.div(class_="card stack", max_width="26rem")
        dropdown = actions.dropDownButton("Export", id="export-command", icon="↓", persist=True, action="this.SET('result', 'Default export')")
        menu = dropdown.menu()
        menu.menuline("Export CSV", code="csv", id="export-csv", action="this.SET('result', 'CSV export')")
        menu.menuline("Export PDF", code="pdf", id="export-pdf", action="this.SET('result', 'PDF export')")
        menu.menuline("-")
        menu.menuline("Unavailable", code="unavailable", disabled=True, action="this.SET('result', 'Unavailable')")
        pane.p("^result", id="dropdown-result")
        pane.dataSetter("result", "No command yet")
