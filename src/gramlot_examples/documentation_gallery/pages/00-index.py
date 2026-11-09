from gramlot import Page as BasePage


class Page(BasePage):
    title = "Documentation gallery"

    def main(self, root):
        pane = root.main(padding="24px")
        pane.h1("Documentation gallery")
        pane.p("Interactive examples accompanying the Gramlot developer manual.")
