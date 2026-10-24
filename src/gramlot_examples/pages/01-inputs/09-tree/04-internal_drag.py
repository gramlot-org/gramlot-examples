from gramlot.collections.tree import mygramlot as tree
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [tree]
    title = "Reorder tree nodes with drag and drop"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeDrag")
        main_content.h1("Drag a document into a folder")
        main_content.p("Drag a document from the left tree onto Inbox or Projects. Locked archive refuses it. Open the folder to see the copied item; the source stays unchanged.")
        columns = main_content.div(class_="drag-columns")
        origin = columns.section(class_="drag-panel")
        origin.h2("Documents")
        origin.tree(storepath=".documents", hideValues=True, labelAttribute="caption", draggable=True,
                    dragTags="document", effectAllowed="copy", onDrag="prepareDocument", onDragEnd="dragFinished", id="drag-documents")
        target = columns.section(class_="drag-panel")
        target.h2("Folders")
        target.tree(storepath=".folders", hideValues=True, labelAttribute="caption", dropTargetCb="acceptDocument",
                    dropTypes="app/document", dropTags="document", dropEffect="copy", onDrop="copyDocument", id="drop-folders")
        main_content.p("^.lastDrop", id="last-drop")
        main_content.p("^.lastEnd", id="last-drag-end")
        main_content.p("Logic writes only to the destination Bag. The tree renders the change. Copying the same document again updates its existing entry. This lesson supports gestures inside this page; other browser windows are a later increment.")
