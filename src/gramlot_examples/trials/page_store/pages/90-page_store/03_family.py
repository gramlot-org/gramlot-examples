"""A page family shares one socket while each customer page owns a PageStore."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Publish from a page family"

    def main(self, root):
        pane = root.div(style="padding:24px;display:grid;gap:16px")
        pane.h1(self.title)
        pane.p("Each customer page publishes to its own PageStore. Try different keys in the frames and connected windows.")
        pane.p("Inside the gallery, the gallery is the primary and owns the only WebSocket. This lesson and all its descendants use that connection.")
        pane.a("Open a connected customer window", href="./02_customer_lookup",
               target="_blank", rel="opener", id="open-family-window")
        pane.h2("Direct iframe")
        pane.iframe(src="./02_customer_lookup", title="Direct customer page",
                    id="direct-customer", width="100%", height="560px")
        pane.h2("Nested iframe")
        pane.iframe(src="./04_nested_branch", title="Intermediate page with a customer iframe",
                    id="customer-branch", width="100%", height="700px")
        pane.p("Every customer page can open a connected copy. Close a parent window to close its descendants.")
