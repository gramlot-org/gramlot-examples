"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Editing bound values'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Connect native controls to Data. Try text fields, boolean choices and a small form to see when edits become shared values and how other controls follow them.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Native editing')
        item.p('Text, number, range, select, date and color fields bound both ways.')
        item = lessons.li()
        item.strong('Checkbox and radio')
        item.p('Booleans in the Data, one per checkbox and radio button.')
        item = lessons.li()
        item.strong('Forms with binding')
        item.p('The native form of example 06, bound to a record.')
