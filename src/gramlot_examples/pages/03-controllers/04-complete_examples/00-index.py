"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Putting page logic together'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Combine values, formulas, validation and commands into a small working task. These longer examples connect the individual controller lessons to an end-to-end page.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('End-to-end story')
        item.p('First the local 0.2.0 story; return after the endpoint lessons for a separate 0.2.14 quote, error and recovery step.')
        item = lessons.li()
        item.strong('Plan your stay')
        item.p('Room, guests and nights drive seven chained formulas, validation and a click summary.')
