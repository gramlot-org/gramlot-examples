"""Read the same kind of records from node attributes, with typed numeric and boolean cells."""
from gramlot import Page as BasePage
from gramlot.collections.grid import mygramlot as grid


class Page(BasePage):
    title = 'Rows as attributes'
    gramlots = [grid]

    def main(self, root):
        main_content = root.main(datapath='sample', padding='16px')
        main_content.p('Inspect Data: the row value is empty and its fields are attributes. Zero and false remain visible.', margin_top=0)
        g = main_content.grid(id='grid-02', storepath='.rows', rowMode='attributes', height='340px')
        s = g.struct()
        s.column('description', name='Description', width='240px')
        s.column('quantity', name='Quantity', dtype='L', width='105px')
        s.column('price', name='Unit price', dtype='N', format='0.00', width='120px')
        s.column('available', name='Available', dtype='B', width='100px')
