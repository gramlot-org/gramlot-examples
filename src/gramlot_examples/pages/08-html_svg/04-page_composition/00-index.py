"""Introduction to a gallery lesson group."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Composing complete pages'

    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1(self.title)
        main_content.p('Combine small HTML and SVG elements into cards, reports and a complete page. Start with the visible result, then compare the declarations in Code.')
        main_content.p('Expand this group in the navigation and choose a lesson. Each lesson includes a working example, an explanation and its source code.')
        lessons = main_content.ul()
        item = lessons.li()
        item.strong('Cards with icons')
        item.p('HTML cards with SVG icons and live Source removal.')
        item = lessons.li()
        item.strong('Static report')
        item.p('A summary, chart, legend and table from the same data.')
        item = lessons.li()
        item.strong('Complete page')
        item.p('An event page with a programme, speakers, map and FAQ.')
