"""A connected child window publishes to another same-owner page's store."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Publish to another page"

    def main(self, root):
        pane = root.div(style="padding:24px;display:grid;gap:16px")
        pane.a("Open sender window", href="./02_customer_lookup", target="_blank",
               rel="opener", id="open-sender")
        pane.h2("Recipient page")
        pane.iframe(src="./02_customer_lookup", id="recipient-page",
                    title="Recipient customer page", width="100%", height="650px")
