from gramlot.collections.tree import mygramlot as tree
from gramlot import Page as BasePage


class Page(BasePage):
    gramlots = [tree]
    title = "Tree callbacks, HTML and icons"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeLabels")
        main_content.h1("Computed labels and icons")
        main_content.p("Both trees share one Bag. The first uses labelCb; the second uses getLabel, custom icon and caption classes. Open Documents, select a row and toggle its rich caption.")
        main_content.h2("labelCb: computed text")
        main_content.tree(storepath=".nodes", hideValues=True, labelCb="plainCaption", id="text-callback-tree", class_="callback-tree")
        main_content.h2("getLabel: explicit text or HTML")
        main_content.tree(storepath=".nodes", hideValues=True, labelAttribute="caption", getLabel="richCaption",
                  getIconClass="rowIcon", getLabelClass="rowClass", selectedLabelClass="selected-caption",
                  selectedPath="^.selection", id="rich-callback-tree", class_="callback-tree")
        main_content.button("Toggle rich Documents", id="toggle-rich", action="this.SET('.nodes.documents?rich', !this.GET('.nodes.documents?rich'))")
        main_content.p("Selected path")
        main_content.code("^.selection", id="callback-selection")
        main_content.p("Callbacks are synchronous named Logic methods. HTML is explicit and sanitized; class names are available through CSS parts. No resolver is read to calculate a caption.")
