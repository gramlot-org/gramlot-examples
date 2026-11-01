from gramlot import Page as BasePage


class Page(BasePage):
    title = "Tree icons and computed captions"
    devices = ("desktop", "tablet", "phone")

    def main(self, root):
        main_content = root.main(class_="example-page stack", datapath="treeLabels")
        main_content.h2("labelCb: computed text")
        main_content.tree(storepath=".nodes", hideValues=True, labelCb="plainCaption", id="text-callback-tree", class_="callback-tree")
        main_content.h2("getLabel: explicit text or HTML")
        main_content.tree(storepath=".nodes", hideValues=True, labelAttribute="caption", getLabel="richCaption",
                  getIconClass="rowIcon", getLabelClass="rowClass", selectedLabelClass="selected-caption",
                  selectedPath="^.selection", id="rich-callback-tree", class_="callback-tree")
        main_content.button("Toggle rich Documents", id="toggle-rich", action="this.SET('.nodes.documents?rich', !this.GET('.nodes.documents?rich'))")
        main_content.p("Selected path")
        main_content.code("^.selection", id="callback-selection")
