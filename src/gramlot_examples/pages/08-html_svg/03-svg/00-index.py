"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'SVG drawing'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Draw shapes and combine them into a scene. SVG elements belong to the same Source tree as the surrounding HTML, so diagrams and page content can be composed together.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('SVG shapes')
        item.p('The basic SVG vocabulary inside an HTML page.')
        item = lessons.li()
        item.strong('SVG composition')
        item.p('A scene assembled with groups, paths and repeated objects.')
