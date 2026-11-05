from gramlot import Page as BasePage


class Page(BasePage):
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeDrag")
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
