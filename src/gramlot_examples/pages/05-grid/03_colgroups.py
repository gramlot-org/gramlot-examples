"""Group columns, display multiline notes and resize individual rows."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Column groups and row heights'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='16px')
        main_content.p('Drag a column edge or a row-number edge. Move columns between visual positions: they keep their group membership.', margin_top=0)
        g = main_content.grid(id='grid-03', storepath='.rows', rowMode='attributes', height='340px', rowHeaders=True, rowResize=True)
        s = g.struct()
        s.column('description', name='Description', width='240px')
        stock = s.colgroup('stock', name='Stock', background='var(--gramlot-action)', color='var(--gramlot-surface)')
        stock.column('category', name='Category', width='130px')
        stock.column('quantity', name='Quantity', dtype='L', width='105px')
        stock.column('available', name='Available', dtype='B', width='100px')
        details = s.colgroup('details', name='Details', background='var(--gramlot-success)', color='var(--gramlot-surface)')
        details.column('price', name='Unit price', dtype='N', format='0.00', width='120px')
        details.column('notes', name='Notes', width='300px', white_space='pre-wrap')
