"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Binding the presentation'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Let Data control how a page looks: visibility, styles and SVG attributes. These examples connect a changing value to more than the text displayed on screen.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Style and visibility')
        item.p('visible, class, style and reactive style shortcuts.')
        item = lessons.li()
        item.strong('Bound SVG')
        item.p('SVG geometry and paint follow range and color fields.')
        item = lessons.li()
        item.strong('SVG shapes with binding')
        item.p('The six shapes of example 08, resized and recolored by controls.')
