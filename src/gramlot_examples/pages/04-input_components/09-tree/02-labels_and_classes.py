from gramlot import Page as BasePage
from genro_bag import Bag


class Page(BasePage):
    title = "Tree labels and classes"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeStyle")
        main_content.h1("Labels and state classes")
        main_content.p("Open Documents and select a row. Caption classes change with opening and selection; the highlighted row uses a separate node class.")
        nodes = Bag({"documents": {"readme": "Welcome", "notes": "Notes"}, "status": "Ready"})
        nodes.get_node("documents").set_attr({"caption": "Documents", "labelClass": "caption-base", "labelClassOpened": "caption-open", "labelClassClosed": "caption-closed"})
        nodes.get_node("documents.notes").set_attr({"caption": "Meeting notes", "node_class": "attention-node"})
        nodes.get_node("status").set_attr({"caption": "Status", "labelClass": "caption-base"})
        main_content.dataSetter(".nodes", nodes)
        main_content.dataSetter(".selection", None)
        main_content.tree(storepath=".nodes", labelAttribute="caption", hideValues=True,
                  selectedPath="^.selection", selectedLabelClass="caption-selected",
                  id="styled-tree", class_="styled-tree")
        main_content.p("Selected path")
        main_content.code("^.selection", id="styled-selection")
        main_content.button("Rename notes", id="styled-rename", action="this.SET('.nodes.documents.notes?caption', 'Updated notes')")
        main_content.p("labelAttribute changes the caption, not the node key. Custom classes are also exposed as CSS parts for page styles.")
