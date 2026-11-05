from gramlot import Page as BasePage


class Page(BasePage):
    title = 'HTML basics'

    def main(self, root):
        root.h1(self.title)
        root.p('Declare elements, children and style attributes.')
