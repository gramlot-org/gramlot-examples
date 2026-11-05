from genro_bag import Bag
from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    def main(self, root):
        options = Bag()
        options.setItem("documents.fixed", None, checked="disabled:on")
        options.setItem("documents.blocked", None, checked="disabled:off")
        root.dataSetter("options", options)
        root.dataRemote("options.documents.catalog", "catalog_children", cacheTime=-1)
        root.checkBoxText(values="^options", value="^selected", hierarchical=True,
                          popup=True, lbl="Documents", id="hierarchy")
        root.button("Clear", action="this.SET('selected', null)", id="clear")
        root.code("^selected", id="selected-paths")

    @endpoint
    def catalog_children(self):
        return Bag({"guide": None, "reference": None})
