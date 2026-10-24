from gramlot import Page as BasePage

class Page(BasePage):
    title = 'Document and code editors'
    def main(self, root):
        pane = root.main(class_="example-page stack", padding="24px")
        pane.h1(self.title)
        pane.p('Edit a whole document rather than a single field: source code, HTML, Markdown and Typst. Compare source editing, preview and rich text while keeping one shared draft.')
        pane.p('The Python gallery also provides an IDE in Tools, with a sample document workspace. Saving requires Remote Edit on the host.')
