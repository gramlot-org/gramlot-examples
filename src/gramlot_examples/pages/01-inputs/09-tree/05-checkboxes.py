from genro_bag import Bag
from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    title = "Tree checkboxes"

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="checks")
        main_content.dataRemote(".nodes.documents.catalog", "catalog_children", cacheTime=-1)
        main_content.tree(storepath=".nodes", checkedPaths="^.checked", checkChildren=True,
                  labelAttribute="caption", hideValues=True, id="checkbox-tree")
        main_content.button("Clear checks", action="this.SET('.checked', '')")
        main_content.div("Checked paths", class_="muted")
        main_content.code("^.checked", id="checked-paths")

    @endpoint
    def catalog_children(self):
        return Bag({"guide": None, "reference": None})
