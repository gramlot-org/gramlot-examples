"""A filesystem navigation page for the gallery."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Nested directory'

    def main(self, root):
        main_content = root.main(padding="24px", class_="gallery-directory-page")
        main_content.h1(self.title)
        main_content.p('This directory has its own index page. Expand its arrow to load the child page; selecting this label opens the directory page independently.')
