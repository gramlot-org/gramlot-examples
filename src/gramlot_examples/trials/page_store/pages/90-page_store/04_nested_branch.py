"""An intermediate page delegates a nested customer's traffic to its parent."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Nested customer branch"

    def main(self, root):
        pane = root.div(style="padding:12px;display:grid;gap:12px")
        pane.h2(self.title)
        pane.p("This frame has a child of its own. The child uses the same publish API and needs no knowledge of the parent chain.")
        pane.a("Open a window from this branch", href="./02_customer_lookup",
               target="_blank", rel="opener", id="open-branch-window")
        pane.iframe(src="./02_customer_lookup", title="Nested customer page",
                    id="nested-customer", width="100%", height="560px")
