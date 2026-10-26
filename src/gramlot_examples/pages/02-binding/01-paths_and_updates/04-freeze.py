from gramlot import Page as BasePage


class Page(BasePage):
    title = "Defer structural updates with freeze"

    def main(self, root):
        pane = root.div(class_="example-page stack", datapath="board")
        pane.h1("Freeze")
        pane.p("Freeze the branch, increment the count and remove an item. The count updates immediately; item removal appears only after Thaw.")
        actions = pane.div(class_="actions")
        for label, method in (("Freeze", "freeze"), ("Increment Data count", "add"),
                              ("Remove last item", "removeLast"), ("Thaw", "thaw")):
            actions.button(label, id=method).dataController(func=method)
        pane.p("^.frozen", id="frozen", mask="Structural updates frozen: {}", class_="muted")

        board = pane.section(nodeId="board", class_="card stack")
        board.h2("A branch that can be frozen")
        board.p("^.count", id="count")
        items = board.ul(nodeId="items", id="items")
        for number in (1, 2, 3):
            items.li(f"Item {number}")
