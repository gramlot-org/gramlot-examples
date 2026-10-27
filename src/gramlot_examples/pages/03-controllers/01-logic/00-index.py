"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Formulas and page logic'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Start with derived values and reactive controllers, then organize behavior in named Logic methods. Compare expressions, Source node methods and pointer transformations in small examples.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Formula')
        item.p('dataFormula computes a result path from its parameters.')
        item = lessons.li()
        item.strong('Controller')
        item.p('dataController reacts to Data, to a fired path and to time.')
        item = lessons.li()
        item.strong('Named logic')
        item.p('Formula and controller bodies in class Logic of 03_named_logic.js.')
        item = lessons.li()
        item.strong('Inline expressions')
        item.p('== expressions in text and attributes, and inline scripts.')
        item = lessons.li()
        item.strong('Node methods')
        item.p('SET, GET, PUT, FIRE and FIRE_AFTER from button actions.')
        item = lessons.li()
        item.strong('Pointer templates and expressions')
        item.p('Core 0.2.20: revisit CSS lengths, boolean state and formatted text with attribute pointer transforms.')
