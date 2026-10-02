from gramlot import Page as BasePage


class Page(BasePage):
    title = "Demo"

    def main(self, root):
        root.h1("Demo", class_="demo")
