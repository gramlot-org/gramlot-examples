from gramlot import Page as BasePage


class Page(BasePage):
    title = "Hello, Gramlot"
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        page = root.main(class_="example-page stack")
        page.h1("Hello, Gramlot!")
        page.p("This heading and paragraph come from a Source tree.")
