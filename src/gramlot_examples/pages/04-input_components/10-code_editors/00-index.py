from gramlot import Page as BasePage

class Page(BasePage):
    title = "Code editors"
    def main(self, root):
        main_content = root.main(class_="example-page stack", padding="24px")
        main_content.h1("Code editors")
        main_content.p("CodeMirror binds a text document to Data. Try the base control, or open the options composition for a configurable editor with its own drawer.")
