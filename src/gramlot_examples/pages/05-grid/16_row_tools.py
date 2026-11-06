"""Row tools: add, duplicate and delete rows, with the editing status."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(padding='20px', max_width='1080px', margin='0 auto')
        frame = main_content.frameGrid(datapath='sample', storepath='.rows', rowMode='attributes',
                                       rowHeaders=True, selectionMode='multi', addrow=True,
                                       addrow_defaults={'description': 'New item', 'quantity': 1},
                                       duprow=True, delrow=True, gridsemaphore=True, height='340px')
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px', edit=True)
        s.column('description', name='Description', width='240px', edit=True)
        s.column('quantity', name='Quantity', dtype='L', width='100px', edit=True)
        s.column('price', name='Unit price', dtype='N', format='0.00', width='120px', edit=True)
