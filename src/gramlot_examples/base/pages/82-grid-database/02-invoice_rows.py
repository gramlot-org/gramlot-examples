"""Load a complete resident selection from the read-only Base PostgreSQL copy."""
from genro_bag import Bag
from gramlot_examples.base.selection_trial import SelectionTrialPage, ROW_LIMITS


class Page(SelectionTrialPage):
    title = 'Database grid · resident invoice rows'

    def main(self, root):
        pane = root.main(datapath='invoice_rows', padding='20px')
        pane.h2(self.title, margin='0 0 8px')
        pane.p('PostgreSQL · gramlot_base_asqueel · invc.invc_invoice_row. Choose the maximum number of invoice rows to load, in row-ID order. If the table has fewer records, all available records are returned. All returned rows stay in a client Bag.')
        pane.button('Open database grid', action="this.SET('.open', true)")
        pane.p('The complete selection loads through typed JSONL. Query measures database execution and fetch; Ready includes transfer, decoding and Bag creation, before rendering. A failed or cancelled load preserves the previous selection.', color='var(--gramlot-text-secondary)')
        pane.dataSetter('.open', True)
        pane.dataSetter('.limit', '1000')
        pane.dataSetter('.selection', Bag({'rows': Bag(), 'count': 0}))
        pane.dataSetter('.reload', 0)
        pane.dataSetter('.metrics', Bag())
        self.load_source(pane)
        window = pane.floatingPane(title='Invoice rows · PostgreSQL XL', open='^.open', id='invoice-row-grid-window',
                                   width='1060px', height='500px', resizable=True, movable=True, maximizable=True)
        window.frame.center.set_attr(display='flex', flex_direction='column', min_height=0, min_width=0, padding='5px', overflow='hidden')
        frame = window.frame.center.frameGrid(storepath='.selection.rows', rowMode='attributes',
                                             flex=1, min_height=0, min_width=0, border='1px solid var(--gramlot-border)', overflow='hidden')
        bar = frame.top.menu(presentation='bar', aria_label='Invoice row grid tools', padding='4px 8px', background='var(--gramlot-surface-subtle)')
        bar.menuline(group=True).searchBox(searchOn=True)
        bar.spacer(flex=1)
        limits = bar.menuline(group=True)
        limits.span('Max rows', margin_right='6px')
        choice = limits.select(value='^.limit', aria_label='Maximum records', id='db-grid-limit', width='7rem')
        for limit in ROW_LIMITS:
            choice.option(str(limit), value=str(limit))
        bar.menuline(caption='Reload from DB', action="this.SET('.reload', this.GET('.reload') + 1)", tooltip='Run the query again and replace the resident selection')
        metrics = frame.bottom.menu(presentation='bar', aria_label='Server measurements', padding='4px 8px')
        facts = metrics.menuline(group=True, overflowable=False)
        facts.span('^.status', id='db-grid-status', margin_right='12px')
        facts.span('^.selection.requested', mask='Requested: {}', id='db-grid-requested', margin_right='12px')
        facts.span('^.selection.count', mask='Loaded: {}', id='db-grid-count', margin_right='12px')
        facts.span('^.metrics.query_ms', mask='Query: {} ms', format='0.00', id='db-grid-query-ms', margin_right='12px')
        facts.span('^.metrics.encode_ms', mask='Encode: {} ms', format='0.00', id='db-grid-encode-ms', margin_right='12px')
        facts.span('^.metrics.total_ms', mask='Ready: {} ms', format='0.00', id='db-grid-total-ms')
        frame.grid.set_attr(id='invoice-row-db-grid', rowHeaders=True, rowResize=True)
        s = frame.grid.struct()
        s.column('customer_name', name='Customer', width='210px', white_space='pre-wrap')
        s.column('state', name='State', width='65px')
        s.column('invoice_number', name='Invoice', width='115px')
        s.column('invoice_date', name='Date', dtype='D', width='110px')
        s.column('product_code', name='Product', width='100px')
        s.column('description', name='Description', width='280px', white_space='pre-wrap')
        s.column('quantity', name='Quantity', dtype='L', width='90px')
        s.column('unit_price', name='Unit price', dtype='N', format='0.00', width='110px')
        s.column('tot_price', name='Total', dtype='N', format='0.00', width='115px')
