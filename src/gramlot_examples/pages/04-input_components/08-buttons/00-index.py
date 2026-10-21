"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Buttons and commands'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Run a command, toggle a state or choose an action from a dropdown. These examples distinguish the button presentation from the behavior it invokes.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Button commands')
        item.p('Compare the Gramlot command button with plain HTML. Try confirmation and a delayed command.')
        item = lessons.li()
        item.strong('Toggle button with LED')
        item.p('A command button and a checkbox share a boolean. The LED and aria-pressed follow Data.')
        item = lessons.li()
        item.strong('Dropdown commands and persistence')
        item.p('The main surface executes; the arrow opens the menu. Shift-select a command to run it and make it the default.')
