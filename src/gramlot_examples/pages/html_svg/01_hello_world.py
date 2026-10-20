from gramlot import Page as BasePage


class Page(BasePage):
    title = "Hello, Gramlot"

    def main(self, root):
        main_content = root.main(class_="example-page stack")
        main_content.h1("Hello, Gramlot!")
        main_content.p("This heading and paragraph come from a Source tree.")
