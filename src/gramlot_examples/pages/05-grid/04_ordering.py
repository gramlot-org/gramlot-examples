"""Sort raw Bag values with multiple criteria, then set a manual row order."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Multicolumn sort and row drag'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='16px')
        main_content.p('Click Category for ascending. Shift-click Quantity to add it; Shift-click Quantity again for descending. Arrows show direction; numbers show priority. Drag a row to switch to manual order; the sort indicators clear.', margin_top=0)
        g = main_content.grid(id='grid-04', storepath='.rows', rowMode='attributes', height='340px', rowHeaders=True, rowResize=True, selfDragRows=True)
        s = g.struct()
        s.column('description', name='Description', width='240px')
        s.column('category', name='Category', width='130px')
        s.column('quantity', name='Quantity', dtype='L', width='105px')
        s.column('price', name='Unit price', dtype='N', format='0.00', width='120px')
