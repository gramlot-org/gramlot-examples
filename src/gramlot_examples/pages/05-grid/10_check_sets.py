from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.div(datapath="sample", max_width="48rem")
        for seller in ("John", "Mark", "Fred"):
            pane.button("Add " + seller, action="addSet", seller=seller)
        filters = pane.groupBox(lbl="Set filter")
        for label, names in (("Tutti", ""), ("John", "John"), ("John e Fred", "John,Fred")):
            filters.button(label, action="filterSets", names=names)
        frame = pane.frameGrid(storepath=".customers", structpath=".structure",
                               rowMode="attributes", searchOn="Customer:name", height="280px")
        frame.grid.set_attr(id="customer-sets", setFilter="^.setFilter")
        for seller in ("John", "Mark", "Fred"):
            pane.code("^.sets." + seller.lower(), lbl=seller)
