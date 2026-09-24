"""Python version of the application's Hello World page."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = "Hello World"

    def main(self, root):
        root.h1("Hello World")
