"""Resize a floating window over one thousand resident Bag rows."""
from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1000px', margin='0 auto')
        main_content.button('Open floating grid', action="this.SET('.open', true)")
        window = main_content.floatingPane(id='grid-floating-window', title='1,000 resident rows', open='^.open', width='780px', height='460px', movable=True, resizable=True, maximizable=True)
        window.frame.center.set_attr(display='flex', flex_direction='column', min_height=0, min_width=0, overflow='hidden', padding='5px')
        frame = window.frame.center.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, id='grid-floating-frame', flex=1, min_height=0, min_width=0, border='1px solid var(--gramlot-border)', overflow='hidden')
        frame.grid.set_attr(id='grid-floating-demo', rowHeaders=True, rowResize=True, selfDragRows=True)
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='180px')
        s.column('notes', name='Delivery notes', width='260px', white_space='pre-wrap')
