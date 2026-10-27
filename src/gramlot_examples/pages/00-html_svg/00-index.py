from gramlot import Page as BasePage

class Page(BasePage):
    title = 'HTML and SVG'
    def main(self, root):
        pane = root.main(class_="example-page stack", padding="24px")
        pane.h1(self.title)
        pane.p('Learn the underlying page vocabulary: text, links, lists, tables, native controls and SVG. Build up to complete page compositions.')
        pane.p('For ready-made input components start with Fields and input widgets. For application layout use Containers and layout.')
