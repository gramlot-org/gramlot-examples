from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1('Maps')
        root.p('Match territory names to prepared GeoJSON. Geography is input data, not a database dependency.')
