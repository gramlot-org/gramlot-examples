"""A resident Bag grid inside the shared frame and menu-bar system."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'FrameGrid · complete example'

    def main(self, root):
        main_content = root.main(padding='12px', height='100%', min_height=0)
        frame = main_content.frameGrid(searchOn=True, datapath='orders', storepath='.rows', rowMode='attributes',
                              height='calc(100vh - 24px)', id='orders-frame',
                              border='1px solid var(--gramlot-border)',
                              border_radius='var(--gramlot-radius-sm)', overflow='hidden')
        frame.grid.set_attr(id='orders-grid', rowHeaders=True, rowResize=True, selfDragRows=True, selfsubscribe_updateFirst='updateFirst',
                            selfsubscribe_removeLast='removeLast')
        self.columns(frame.grid.struct())
        self.bars(frame)

    def columns(self, struct):
        struct.column('description', name='Description', width='240px')
        details = struct.colgroup('details', name='Order details', background='var(--gramlot-action)', color='var(--gramlot-surface)')
        details.column('quantity', name='Qty', dtype='L', width='52px')
        details.column('price', name='Unit price', dtype='N', format='0.00', width='94px')
        details.column('product', name='Product', width='84px')
        details.column('total', name='Total', dtype='N', format='0.00', width='92px')
        details.column('netTotal', name='Net total', dtype='N', format='0.00', width='92px')
        delivery = struct.colgroup('delivery', name='Delivery', background='var(--gramlot-success)', color='var(--gramlot-success-background)')
        delivery.column('notes', name='Delivery notes', width='320px', white_space='pre-wrap')
        delivery.column('language', name='Lang.', width='54px', align='center')
        delivery.column('method', name='Delivery', width='154px')
        alternatives = struct.colgroup('alternatives', name='Alternatives', background='var(--gramlot-warning)', color='var(--gramlot-warning-background)')
        alternatives.column('alternative', name='Alternative', width='140px')
        alternatives.column('contact', name='Contact', width='120px')

    def bars(self, frame):
        top = frame.top.menu(presentation='bar', aria_label='Order commands', padding='4px 8px',
                             labelPosition='tooltip', iconSize=20,
                             background='var(--gramlot-surface-subtle)')
        title = top.menuline(group=True, overflowable=False, gap='10px')
        symbol = title.svg(viewBox='0 0 24 24', width=22, height=22, fill='none',
                           stroke='currentColor', stroke_width='1.6', aria_hidden='true')
        symbol.path(d='M12 3 3 7.5v9L12 21l9-4.5v-9L12 3ZM3 7.5l9 4.5 9-4.5M12 12v9M7.5 5.25l9 4.5')
        title.strong('Studio orders', font_size='1.08em')
        top.spacer(flex=1)
        actions = top.menuline(group=True, priority=20)
        actions.menuline('gridExample:updateFirst', id='orders-update')
        actions.menuline('gridExample:removeLast', id='orders-remove')
        frame.dataFormula('.count', 'rows.getNodes().length', rows='^.rows', _onBuilt=True)
        bottom = frame.bottom.menu(presentation='bar', aria_label='Order status', padding='4px 8px')
        count = bottom.menuline(group=True, overflowable=False)
        count.span('^.count', id='orders-count')
        count.span('rows · Read only')
        bottom.spacer(flex=1)
        bottom.menuline(group=True, priority=10).span('^.status', id='orders-status')
