"""Start with three columns and a Bag whose row values are Bags."""
from gramlot import Page as BasePage
from gramlot.collections.grid import mygramlot as grid


class Page(BasePage):
    title = 'Basic grid · Bag values'
    gramlots = [grid]

    def main(self, root):
        main_content = root.main(datapath='sample', padding='16px')
        main_content.p('Compare each visible row with the sample Data. This is the smallest grid: storepath, rowMode and a declared struct.', margin_top=0)
        g = main_content.grid(id='grid-01', storepath='.rows', rowMode='values', height='340px')
        s = g.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='240px')
        s.column('quantity', name='Quantity', dtype='L', width='105px')
