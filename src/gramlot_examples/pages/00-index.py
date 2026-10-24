"""A filesystem navigation page for the gallery."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Explore Gramlot by task'

    def main(self, root):
        main_content = root.main(padding="24px", class_="gallery-directory-page")
        main_content.h1(self.title)
        main_content.p('Start with Fields and input widgets. Continue with Data and bindings, Logic and events, or RPC. Document editors, layout and tools have separate sections. Select a section title for an introduction; expand its arrow to choose a working example.')
