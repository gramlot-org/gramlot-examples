from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Fundamentals'

    def main(self, root):
        root.h1(self.title)
        root.p('Build a page from HTML and SVG, style its elements, add labels and boxes, connect values and attributes to the Data store, and inspect Data and Source.')
