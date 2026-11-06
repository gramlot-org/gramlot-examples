"""Row formulas: a computed total, a VAT read from page Data and a formula chain."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1080px', margin='0 auto')
        main_content.numberTextBox(value='^.vat', lbl='VAT %', dtype='N', format='0.00', live=True,
                                   box_c_width='10rem', margin_bottom='12px')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', height='340px')
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='200px')
        s.column('quantity', name='Quantity', dtype='L', width='90px', edit=True)
        s.column('price', name='Unit price', dtype='N', format='0.00', width='110px', edit=True)
        s.column('total', name='Total', dtype='N', format='0.00', width='110px',
                 formula='quantity * price', calculated=True)
        s.column('tax', name='VAT amount', dtype='N', format='0.00', width='110px',
                 formula='total * vat / 100', formula_vat='^.vat', calculated=True)
        s.column('gross', name='Gross', dtype='N', format='0.00', width='110px',
                 formula='total + tax', calculated=True)
