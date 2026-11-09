from gramlot import Page as BasePage
from gramlot.collections.typst import mygramlot as typst


class Page(BasePage):
    gramlots = [typst]

    def main(self, root):
        main_content = root.main(datapath="typstDemo", padding="24px", class_="example-page stack")
        split = main_content.div(class_="grid typst-workbench")
        split.codeMirror(value="^.content", language="typst", height="min(650px, 70dvh)")
        split.typstPreview(value="^.content", filename="gramlot-typst.pdf", height="min(650px, 70dvh)")
