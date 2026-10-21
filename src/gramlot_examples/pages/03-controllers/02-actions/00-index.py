"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Actions and commands'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Turn a user command into a page action. Explore controller buttons, confirmation questions, references and delayed commands.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Button controller')
        item.p('A button with a nested controller, click counter, modifiers and fire.')
        item = lessons.li()
        item.strong('Actions, confirmations and references')
        item.p('Core 0.2.18: action, conditional ask and explicit Source/DOM references.')
        item = lessons.li()
        item.strong('Plain and delayed buttons')
        item.p('Core 0.2.19: native html_button and grouped clicks with _delay.')
