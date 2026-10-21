"""A filesystem navigation page for the gallery."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'HTML and SVG'

    def main(self, root):
        main_content = root.main(padding="24px", class_="gallery-directory-page")
        main_content.h1(self.title)
        main_content.p('Explore the HTML and SVG examples, or open the nested directory to try filesystem navigation with lazy children.')
