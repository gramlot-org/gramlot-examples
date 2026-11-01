from gramlot import Page as BasePage


class Page(BasePage):
    title = "Customize tree labels and row styles"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeStyle")
        main_content.tree(storepath=".nodes", labelAttribute="caption", hideValues=True,
                  selectedPath="^.selection", selectedLabelClass="caption-selected",
                  id="styled-tree", class_="styled-tree")
        main_content.p("Selected path")
        main_content.code("^.selection", id="styled-selection")
        main_content.button("Rename notes", id="styled-rename", action="this.SET('.nodes.documents.notes?caption', 'Updated notes')")
