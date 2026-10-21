"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Native HTML controls'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Explore the browser controls available directly in HTML: forms, input fields and expandable sections. These lessons introduce native elements before the richer input components.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Forms')
        item.p('Native fields, choices, buttons and a slider.')
        item = lessons.li()
        item.strong('Native disclosure')
        item.p('Expandable questions and native progress indicators.')
