"""Introduction to the PageStore gallery lessons."""
from gramlot import Page


class Page(Page):
    title = "PageStore and WebSocket"

    def main(self, root):
        pane = root.div(style="padding:24px;max-width:720px")
        pane.h1(self.title)
        pane.p("A client page can bind part of its Data to a server Bag and publish events to server controllers.")
        pane.h2("Bidirectional Bag binding")
        pane.p("Edit either client copy and observe the calculation performed by the server.")
        pane.h2("Publish a customer request")
        pane.p("Send a key and receive the record, status and error through Data.")
        pane.h2("Publish from a page family")
        pane.p("Use direct and nested iframes and connected windows, each with its own PageStore and one shared socket.")
        pane.h2("Publish to another page")
        pane.p("Choose another same-owner page ID from a child window: the recipient's controller updates its Bag.")
        pane.p("Choose a lesson in the navigation tree. Each page has its own store; all share the primary gallery connection.")
