"""Footer totals: column sums in the footer row and in page Data."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1080px', margin='0 auto')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', footer='Totals',
                                       searchOn=True, height='340px')
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='200px')
        s.column('quantity', name='Quantity', dtype='L', width='100px', totalize=True)
        s.column('price', name='Unit price', dtype='N', format='0.00', width='110px')
        s.column('total', name='Total', dtype='N', format='0.00', width='120px', formula='quantity * price',
                 calculated=True, totalize=True, footer_format='0.00')
        summary = main_content.div(margin_top='12px')
        summary.span('Order total: ')
        summary.span('^.totalize.total', dtype='N', format='0.00', font_weight='600')
