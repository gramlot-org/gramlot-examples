"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'HTML basics'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Start with the structure of a page: text, links, lists, meaningful sections and tables. These examples show how Python declarations become familiar HTML elements.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Hello World')
        item.p('A heading and a paragraph: the smallest Gramlot page.')
        item = lessons.li()
        item.strong('Text and links')
        item.p('Headings, inline text, quotations, code and links.')
        item = lessons.li()
        item.strong('Lists')
        item.p('Ordered, unordered and nested lists, plus a glossary.')
        item = lessons.li()
        item.strong('Semantic page')
        item.p('A page composed from meaningful HTML landmarks.')
        item = lessons.li()
        item.strong('Tables')
        item.p('A catalogue with headings, rows and totals.')
