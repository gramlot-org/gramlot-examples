from gramlot import Page as BasePage
from gramlot_examples.documentation_gallery.triangle import triangle


class Page(BasePage):
    def main(self, root):
        pane = root.div(datapath="example", class_="triangle-body")
        triangle(pane, 8, 6, "#3366cc")
