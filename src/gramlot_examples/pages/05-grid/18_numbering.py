"""View values: row numbers, running sums and percentage of the total."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1080px', margin='0 auto')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes',
                                       searchOn=True, height='340px')
        s = frame.grid.struct()
        s.column('position', name='#', width='60px', formula='#')
        s.column('description', name='Description', width='200px')
        s.column('quantity', name='Quantity', dtype='L', width='90px')
        s.column('price', name='Unit price', dtype='N', format='0.00', width='110px')
        s.column('total', name='Total', dtype='N', format='0.00', width='110px',
                 formula='quantity * price', calculated=True)
        s.column('running', name='Running', dtype='N', format='0.00', width='110px', formula='+=total')
        s.column('share', name='% of total', dtype='N', format='0.0', width='110px',
                 formula='%=total', calculated=True)
