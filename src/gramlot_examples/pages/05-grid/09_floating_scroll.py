"""Resize a floating window over one thousand resident Bag rows."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Floating grid · resize and scroll'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1000px', margin='0 auto')
        main_content.p('GRID / FLOATING VIEWPORT', color='var(--gramlot-text-secondary)', font_size='11px', letter_spacing='.12em', margin='0 0 8px')
        main_content.h2('One thousand rows, a window that fits', margin='0 0 8px')
        main_content.p('Resize the window from its lower-right corner. The grid fills the available space; its header and search stay above the scrolling rows.', color='var(--gramlot-text-secondary)', margin='0 0 16px')
        main_content.button('Open floating grid', action="this.SET('.open', true)")
        main_content.p('Try a short window, a tall window and a wider window. Delivery notes wrap naturally. Drag below a row number to set a manual height, then resize the window and scroll away and back.')
        main_content.p('Search R0999 or scroll to R1000. Closing and reopening the window preserves this grid’s view.', color='var(--gramlot-text-secondary)')
        window = main_content.floatingPane(id='grid-floating-window', title='1,000 resident rows', open='^.open', width='780px', height='460px', movable=True, resizable=True, maximizable=True)
        window.frame.center.set_attr(display='flex', flex_direction='column', min_height=0, min_width=0, overflow='hidden', padding='5px')
        frame = window.frame.center.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, id='grid-floating-frame', flex=1, min_height=0, min_width=0, border='1px solid var(--gramlot-border)', overflow='hidden')
        frame.grid.set_attr(id='grid-floating-demo', rowHeaders=True, rowResize=True, selfDragRows=True)
        s = frame.grid.struct()
        s.column('code', name='Code', width='90px')
        s.column('description', name='Description', width='180px')
        s.column('notes', name='Delivery notes', width='260px', white_space='pre-wrap')
