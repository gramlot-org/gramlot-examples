"""Two independent collection views share the same resident Bag nodes."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Two grids, independent views'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='16px')
        main_content.p('Same data, independent views. Sort, search or drag in either grid: the other keeps its own order and filter.', margin_top=0)
        main_content.p('Click a header: ascending, then descending. Shift-click adds a column; Shift-click it again reverses only that column. Arrows show direction; 1, 2 show priority.')
        main_content.button('Toggle Linen chair quantity: 12 / 0', id='shared-update', action='toggleQuantity')
        main_content.p('The button changes one shared record: it remains in Furniture, but leaves the second view when its quantity becomes zero.')
        main_content.h3('Furniture — initially Category ↑, Quantity ↓')
        first = main_content.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, height='270px')
        first.grid.set_attr(id='grid-shared-first', rowHeaders=True, rowResize=True, selfDragRows=True,
                            sortedBy='category:a,quantity:d',
                            filter=dict(value='^Furniture$', columns=['category'], dtype='T'))
        self.columns(first.grid.struct())
        main_content.h3('Quantity ≥ 2 — initially Quantity ↓, Unit price ↑')
        second = main_content.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, height='270px')
        second.grid.set_attr(id='grid-shared-second', rowHeaders=True, rowResize=True, selfDragRows=True,
                             sortedBy='quantity:d,price:a',
                             filter=dict(value='>= 2', columns=['quantity'], dtype='L'))
        self.columns(second.grid.struct())

    def columns(self, struct):
        struct.column('description', name='Description', width='240px')
        struct.column('category', name='Category', width='130px')
        struct.column('quantity', name='Quantity', dtype='L', width='105px')
        struct.column('price', name='Unit price', dtype='N', format='0.00', width='120px')
