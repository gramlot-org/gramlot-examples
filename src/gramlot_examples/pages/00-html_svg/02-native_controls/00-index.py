from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Labels and boxes'

    def main(self, root):
        root.h1(self.title)
        root.p('Use labels and boxes with native HTML elements.')
