"""Scroll a small viewport over one thousand fully resident Bag rows."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Scroll · 1,000 resident rows'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1200px', margin='0 auto')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, height='420px')
        frame.grid.set_attr(id='grid-scroll-demo', rowHeaders=True, rowResize=True, selfDragRows=True)
        s = frame.grid.struct()
        s.column('code', name='Code', width='100px')
        s.column('description', name='Description', width='200px')
        s.column('category', name='Category', width='125px')
        s.column('quantity', name='Quantity', dtype='L', width='100px')
        s.column('notes', name='Delivery notes', width='300px', white_space='pre-wrap')
