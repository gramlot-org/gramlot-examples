from gramlot.collections.layout import mygramlot as layout
from gramlot.collections.editors import mygramlot as editors
from gramlot.collections.typst import mygramlot as typst
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [layout, editors, typst]
    title = "Edit Typst and generate a PDF"

    def main(self, root):
        main_content = root.main(datapath="typstDemo", padding="24px", class_="example-page stack")
        main_content.h1(self.title)
        main_content.p("Edit a self-contained Typst document. The SVG preview and downloadable PDF are generated locally, including offline. This first example uses bundled fonts; project includes and external packages are not loaded.")
        split = main_content.borderContainer(height="650px")
        split.contentPane(region="left", width="50%", splitter=True).codeMirror(value="^.content", language="typst", height="100%")
        split.contentPane(region="center").typstPreview(value="^.content", filename="gramlot-typst.pdf", height="100%")
