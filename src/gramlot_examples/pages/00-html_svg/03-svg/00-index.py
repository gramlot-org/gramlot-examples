from gramlot import Page as BasePage


class Page(BasePage):
    title = 'SVG drawing'

    def main(self, root):
        root.h1(self.title)
        root.p('Declare SVG shapes in the same Source tree.')
