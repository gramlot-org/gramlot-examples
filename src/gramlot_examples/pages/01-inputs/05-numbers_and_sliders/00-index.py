"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Numbers and sliders'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Enter a number directly or adjust it with a horizontal or vertical slider. Explore ranges and steps while keeping the value in shared Data.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Horizontal slider')
        item.p('Two horizontal sliders share a numeric level. Drag or use the arrow keys; switch live editing to compare immediate and committed updates.')
        item = lessons.li()
        item.strong('Vertical slider')
        item.p('Vertical and horizontal sliders share the same level. The vertical minimum is at the bottom and the maximum at the top.')
        item = lessons.li()
        item.strong('Number editing')
        item.p('Try a comma decimal, an integer and an exact Decimal. Invalid text stays in the field without changing Data.')
