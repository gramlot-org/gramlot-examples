"""Scroll a small viewport over one thousand fully resident Bag rows."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Scroll · 1,000 resident rows'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1200px', margin='0 auto')
        main_content.p('GRID / SCROLL', color='var(--gramlot-text-secondary)', font_size='11px', letter_spacing='.12em', margin='0 0 8px')
        main_content.h2('A thousand rows, room to explore', margin='0 0 8px')
        main_content.p('All 1,000 records are already loaded. Scroll freely, search a column or sort the whole collection.', color='var(--gramlot-text-secondary)', margin='0 0 20px')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, height='420px')
        frame.grid.set_attr(id='grid-scroll-demo', rowHeaders=True, rowResize=True, selfDragRows=True)
        s = frame.grid.struct()
        s.column('code', name='Code', width='100px')
        s.column('description', name='Description', width='200px')
        s.column('category', name='Category', width='125px')
        s.column('quantity', name='Quantity', dtype='L', width='100px')
        s.column('notes', name='Delivery notes', width='300px', white_space='pre-wrap')
        main_content.p('Drag the scrollbar to the end: R1000 is the last record. Notes wrap naturally; drag below a row number to give that row more space.', margin='16px 0 8px')
        main_content.p('Click Category, then Shift-click Quantity to combine sort directions. Search for R0999 to find a record that started outside the visible area. Clear to restore the view.', color='var(--gramlot-text-secondary)', margin=0)
