from gramlot import Page as BasePage


class Page(BasePage):
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        actions = main_content.div(class_="card stack", max_width="26rem")
        dropdown = actions.dropDownButton("Export", id="export-command", icon="↓", persist=True, action="this.SET('result', 'Default export')")
        menu = dropdown.menu()
        menu.menuline(caption="Export CSV", code="csv", id="export-csv", action="this.SET('result', 'CSV export')")
        menu.menuline(caption="Export PDF", code="pdf", id="export-pdf", action="this.SET('result', 'PDF export')")
        menu.menuline("-")
        menu.menuline(caption="Unavailable", code="unavailable", disabled=True, action="this.SET('result', 'Unavailable')")
        main_content.p("^result", id="dropdown-result")
