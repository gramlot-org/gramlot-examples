from gramlot import Page as BasePage


class Page(BasePage):
    title = "Typst and PDF"

    def main(self, root):
        main_content = root.main(datapath="typstDemo", padding="24px", class_="example-page stack")
        main_content.h1(self.title)
        split = main_content.div(class_="grid typst-workbench")
        split.codeMirror(value="^.content", language="typst", height="min(650px, 70dvh)")
        split.typstPreview(value="^.content", filename="gramlot-typst.pdf", height="min(650px, 70dvh)")
