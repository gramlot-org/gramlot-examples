"""A connected child window publishes to another same-owner page's store."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Publish to another page"

    def main(self, root):
        pane = root.div(style="padding:24px;display:grid;gap:16px")
        pane.h1(self.title)
        pane.p("Open the sender window. Copy This page ID from the recipient below into Publish to another page in the sender.")
        pane.p("Enter customer 1 or 2 in the sender and click Load on recipient page. The recipient's record changes; the sender's own record stays unchanged.")
        pane.p("The recipient's PageStore publishes customer_loaded back to the sender. Its subscribed dataController shows the returned customer under Server event, separately from its own bound record.")
        pane.a("Open sender window", href="./02_customer_lookup", target="_blank",
               rel="opener", id="open-sender")
        pane.h2("Recipient page")
        pane.iframe(src="./02_customer_lookup", id="recipient-page",
                    title="Recipient customer page", width="100%", height="650px")
        pane.p("Authorization uses the server's owner, not the page ID alone. An unknown, closed or foreign-owner page is refused without closing the shared connection.")
