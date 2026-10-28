"""An intermediate Gramlot page for nested customer routing."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Nested SQLite customer'

    def main(self, root):
        pane = root.div(style='padding:12px')
        pane.h2(self.title)
        pane.iframe(src='./01_customer', title='Nested SQLite customer',
                    id='nested-customer', width='100%', height='760px')
