"""A filesystem navigation page for the gallery."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Nested child page'

    def main(self, root):
        main_content = root.main(padding="24px", class_="gallery-directory-page")
        main_content.h1(self.title)
        main_content.p('This is an ordinary page inside a nested directory. Switch between its tab and the directory tab to keep both pages open.')
