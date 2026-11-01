"""Learn FrameGrid search: column scope, typed comparisons and clearing."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Search · text, numbers and dates'

    def main(self, root):
        main_content = root.main(datapath='sample', padding='20px', max_width='1080px', margin='0 auto')
        frame = main_content.frameGrid(storepath='.rows', rowMode='attributes', searchOn=True, height='330px')
        frame.grid.set_attr(id='grid-search-demo', rowHeaders=True)
        s = frame.grid.struct()
        s.column('description', name='Product', width='230px')
        s.column('category', name='Category', width='130px')
        s.column('quantity', name='Quantity', dtype='L', width='100px')
        s.column('price', name='Unit price', dtype='N', format='0.00', width='115px')
        s.column('updated', name='Updated', dtype='D', width='130px')
        guide = main_content.div(display='flex', flex_wrap='wrap', gap='12px', margin_top='20px')
        self.hint(guide, '01 · Text', 'All columns → lamp', 'Find lamps anywhere. Choose Product and try lamp|desk to match either word.')
        self.hint(guide, '02 · Numbers', 'Quantity → > 2', 'Compare raw numbers: > 2, <= 12, = 0 or ! 0. Unit price accepts decimals in your browser locale.')
        self.hint(guide, '03 · Dates', 'Updated → >= 2026-10-15', 'Use a complete date. ISO dates work across locales; local date notation follows your browser.')

    def hint(self, parent, title, example, description):
        card = parent.section(flex='1 1 210px', padding='16px', border='1px solid var(--gramlot-border)', border_radius='var(--gramlot-radius-lg)', background='var(--gramlot-surface)')
        card.h3(title, font_size='14px', margin='0 0 10px')
        card.p(example, font_weight='600', margin='0 0 8px')
        card.p(description, color='var(--gramlot-text-secondary)', font_size='13px', line_height='1.5', margin='0')
