from gramlot import Page as BasePage, endpoint
from genro_bag import Bag


class Page(BasePage):
    title = "Browse hierarchical Data with a tree"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeDemo")
        main_content.h1("Bag tree")
        main_content.p("Expand Documents or Catalog. Catalog loads its Bag through a resolver on first expansion. Select a row; the path below is bound to the same Data.")
        main_content.checkbox(value="^.hideValues", lbl="Hide scalar values", id="tree-hide-values", default=False)
        main_content.dataRemote(".nodes.catalog", "catalog_children", cacheTime=-1)
        main_content.tree(storepath=".nodes", hideValues="^.hideValues", labelAttribute="caption", selectedPath="^.selection",
                  id="example-tree", class_="example-bag-tree")
        main_content.p("Selected path")
        main_content.code("^.selection", id="tree-selected-path")
        actions = main_content.div(class_="tree-actions")
        actions.button("Select notes", id="tree-select-notes", action="this.SET('.selection', 'documents.notes')")
        actions.button("Add document", id="tree-add", action="this.SET('.nodes.documents.new_document', 'New text')")
        actions.button("Rename notes", id="tree-rename", action="this.SET('.nodes.documents.notes?caption', 'Meeting notes')")
        main_content.p("Rows, captions, icons, disclosure controls and selection expose CSS parts. This page styles the same tree used by the gallery navigation.")

    @endpoint
    def catalog_children(self):
        return Bag({"books": {"guide": "Guide", "reference": "Reference"}, "audio": {"interview": "Interview"}})
