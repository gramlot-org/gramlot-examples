from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1("Hello, Gramlot!")
        root.p("This heading and paragraph come from a Source tree.")
