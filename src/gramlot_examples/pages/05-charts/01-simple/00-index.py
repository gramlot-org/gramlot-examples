from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.h1('Simple charts')
        root.p('Compare values, trends, shares and relationships. Start with the grid, open Chart and change data or configuration.')
