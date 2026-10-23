from gramlot import Page as BasePage

class Page(BasePage):
    title = "Code editors"
    css = ("/themes/gramlot-base/theme.css",)
    def main(self, root):
        pane = root.main(class_="example-page stack", padding="24px")
        pane.h1("Code editors")
        pane.p("CodeMirror binds a text document to Data. Try the base control, or open the options composition for a configurable editor with its own drawer.")
