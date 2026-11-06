"""A grid on a database query: dataRpc, the resident selection and the grid bound to its rows."""
from genro_bag import Bag
from gramlot import Page as BasePage, endpoint
from gramlot_examples.base.selection_trial import ROW_LIMITS, read_records


class Page(BasePage):

    def main(self, root):
        main_content = root.main(datapath='invoice_rows', padding='16px')
        main_content.dataSetter('.selection', Bag({'rows': Bag(), 'count': 0}))
        main_content.dataRpc('load_rows', result_path='.selection', limit='^.limit', _init=True, _fired='^.reload',
                             _onCalling="this.SET('.status', 'Loading from PostgreSQL…')",
                             _onResult="this.SET('.status', 'Loaded')",
                             _onError="this.SET('.status', 'Load failed: ' + error.message)")
        frame = main_content.frameGrid(storepath='.selection.rows', rowMode='attributes', searchOn=True,
                                       height='calc(100vh - 32px)', min_height='320px')
        self.status_bar(frame)
        self.columns(frame.grid)

    def status_bar(self, frame):
        bar = frame.bottom.menu(presentation='bar', aria_label='Selection status and loading', padding='4px 8px')
        facts = bar.menuline(group=True, gap='12px')
        facts.span('^.status', id='db-grid-status')
        facts.span('^.selection.requested', mask='Requested: {}', id='db-grid-requested')
        facts.span('^.selection.count', mask='Loaded: {}', id='db-grid-count')
        bar.spacer(flex=1)
        choice = bar.menuline(group=True).select(value='^.limit', default='1000', lbl='Max rows', lbl_position='L',
                                                 id='db-grid-limit', width='7rem')
        for limit in ROW_LIMITS:
            choice.option(str(limit), value=str(limit))
        bar.menuline(caption='Reload', action="this.FIRE('.reload')", tooltip='Run the query again and replace the selection')

    def columns(self, grid):
        grid.set_attr(id='invoice-row-db-grid', rowHeaders=True, rowResize=True)
        s = grid.struct()
        s.column('customer_name', name='Customer', width='210px', white_space='pre-wrap')
        s.column('state', name='State', width='65px')
        s.column('invoice_number', name='Invoice', width='115px')
        s.column('invoice_date', name='Date', dtype='D', width='110px')
        s.column('product_code', name='Product', width='100px')
        s.column('description', name='Description', width='280px', white_space='pre-wrap')
        s.column('quantity', name='Quantity', dtype='L', width='90px')
        s.column('unit_price', name='Unit price', dtype='N', format='0.00', width='110px')
        s.column('tot_price', name='Total', dtype='N', format='0.00', width='115px')

    @endpoint
    def load_rows(self, limit, **kwargs):
        # The Base host injects its read-only Asqueel service as Page.database.
        records, _ = read_records(self.database, limit)
        rows = Bag()
        for index, record in enumerate(records):
            rows.set_item(f'r{index}', None, _attributes=dict(record.items()))
        return Bag({'rows': rows, 'count': len(rows), 'requested': int(limit)})
