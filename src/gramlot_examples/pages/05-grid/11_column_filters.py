from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.div(datapath="sample", max_width="56rem")
        for caption, value in (("Tutti", ""), ("John", "john"), ("John e Fred", "john,fred")):
            pane.button(caption, action="this.SET('.setFilter', choice)", choice=value)
        frame = pane.frameGrid(storepath=".customers", rowMode="attributes",
                               searchOn="Customer:name", height="350px")
        frame.grid.set_attr(id="column-facets", columnFilters=True, setFilter="^.setFilter")
        struct = frame.grid.struct()
        for field, title in (("john", "John"), ("fred", "Fred")):
            struct.column(field, name=title[0], title=title, width="40px", align="center",
                          check="multiple", checked="^.sets." + field, checkedField="id")
        struct.column("name", name="Customer", width="180px")
        struct.column("city", name="City", width="150px")
        struct.column("category", name="Category", width="150px")
        struct.column("joined", name="Joined", dtype="D", width="130px")
