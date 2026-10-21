"""A filesystem navigation page for the gallery."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Example gallery'

    def main(self, root):
        main_content = root.main(padding="24px", class_="gallery-directory-page")
        main_content.h1(self.title)
        main_content.p('Choose a section in the navigation tree. Expand a folder to load its children, or select its label to open its own page when present.')
