from gramlot import Page as BasePage
from gramlot_examples.documentation_gallery.triangle import triangle


class Page(BasePage):
    title = "Many triangles"

    def main(self, root):
        root.h2("One description", class_="demo-title")
        cards = root.div(class_="triangle-grid")

        examples = (
            ("first", 8, 4, "#417bda"),
            ("second", 4, 8, "#23a5a2"),
            ("third", 7, 7, "#ed9d2d"),
        )
        for name, base, height, color in examples:
            card = cards.section(class_="triangle-card")
            card.div(class_="window-bar").span("●  ●  ●")
            pane = card.div(datapath=f"triangles.{name}", class_="triangle-body")
            triangle(pane, base, height, color)
            card.div(f"triangles.{name}", class_="path-label")
