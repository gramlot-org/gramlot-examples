from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        pane = root.div(max_width="36rem")
        frame = pane.frameGrid(storepath="product.suppliers", rowMode="attributes",
                               searchOn="Supplier:supplier_name", height="240px")
        frame.grid.set_attr(id="primary-supplier")
        columns = frame.grid.struct()
        columns.column("primary", name="", title="Primary supplier", width="32px", align="center",
                       check="single", checked="^product.primary_supplier_id",
                       checkedField="supplier_id")
        columns.column("supplier_name", name="Supplier")
        pane.code("^product.primary_supplier_id", lbl="Selected ID")
