"""Load a complete resident selection from the read-only Base PostgreSQL copy."""
from time import perf_counter

from genro_bag import Bag
from gramlot import Page as BasePage, endpoint


ROW_LIMITS = (100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000)


class Page(BasePage):
    title = 'Database grid · resident customers'

    def main(self, root):
        pane = root.main(datapath='customers', padding='20px')
        pane.h2(self.title, margin='0 0 8px')
        pane.p('PostgreSQL · gramlot_base_asqueel · invc.invc_customer. Choose the maximum number of customers to load, in account-name and ID order. If the table has fewer records, all available records are returned. All returned rows stay in a client Bag.')
        pane.button('Open database grid', action="this.SET('.open', true)")
        pane.p('Query measures database execution and fetching. Server measures the endpoint through session release and Bag construction; transport, response serialization and browser rendering are excluded.', color='var(--gramlot-text-secondary)')
        pane.dataSetter('.open', True)
        pane.dataSetter('.limit', '1000')
        pane.dataSetter('.selection', Bag({'rows': Bag(), 'count': 0}))
        pane.dataRpc('load_customers', result_path='.selection', limit='^.limit', _init=True, _fired='^.reload',
                     _onCalling="this.SET('.status', 'Loading from PostgreSQL…')",
                     _onResult="this.SET('.status', 'Loaded')",
                     _onError="this.SET('.status', 'Load failed: ' + error.message)")
        window = pane.floatingPane(title='Customers · PostgreSQL', open='^.open', id='customer-grid-window',
                                   width='900px', height='500px', resizable=True, movable=True, maximizable=True)
        window.frame.center.set_attr(display='flex', flex_direction='column', min_height=0, min_width=0, padding='5px', overflow='hidden')
        frame = window.frame.center.frameGrid(storepath='.selection.rows', rowMode='attributes',
                                             flex=1, min_height=0, min_width=0, border='1px solid var(--gramlot-border)', overflow='hidden')
        bar = frame.top.menu(presentation='bar', aria_label='Customer grid tools', padding='4px 8px', background='var(--gramlot-surface-subtle)')
        bar.menuline(group=True).searchBox(searchOn=True)
        bar.spacer(flex=1)
        limits = bar.menuline(group=True)
        limits.span('Max rows', margin_right='6px')
        choice = limits.select(value='^.limit', aria_label='Maximum records', id='db-grid-limit', width='7rem')
        for limit in ROW_LIMITS:
            choice.option(str(limit), value=str(limit))
        bar.menuline(caption='Reload from DB', action="this.FIRE('.reload')", tooltip='Run the query again and replace the resident selection')
        metrics = frame.bottom.menu(presentation='bar', aria_label='Server measurements', padding='4px 8px')
        facts = metrics.menuline(group=True, gap='12px', overflowable=False)
        facts.span('^.status', id='db-grid-status', margin_right='12px')
        facts.span('^.selection.requested', mask='Requested: {}', id='db-grid-requested', margin_right='12px')
        facts.span('^.selection.count', mask='Loaded: {}', id='db-grid-count', margin_right='12px')
        facts.span('^.selection.query_ms', mask='Query: {} ms', format='0.00', id='db-grid-query-ms', margin_right='12px')
        facts.span('^.selection.server_ms', mask='Server: {} ms', format='0.00', id='db-grid-server-ms')
        frame.grid.set_attr(id='customer-db-grid', rowHeaders=True, rowResize=True)
        s = frame.grid.struct()
        s.column('account_name', name='Customer', width='270px', white_space='pre-wrap')
        s.column('suburb', name='City', width='190px', white_space='pre-wrap')
        s.column('state', name='State', width='70px')
        s.column('id', name='ID', width='210px')

    @endpoint
    def load_customers(self, limit, **kwargs):
        started = perf_counter()
        if not isinstance(limit, str) or limit not in tuple(str(value) for value in ROW_LIMITS):
            raise ValueError('Choose one of the declared record limits')
        requested = int(limit)
        rows = Bag()
        # The Base host injects its already configured read-only Asqueel service.
        with self.database.database.session() as session:
            query_started = perf_counter()
            records = session.table('invc.customer').query(
                columns='$id,$account_name,$suburb,$state',
                order_by='$account_name,$id', limit=requested).fetch()
            query_ms = (perf_counter() - query_started) * 1000
            for index, record in enumerate(records):
                rows.set_item(f'r{index}', None, _attributes=dict(record.items()))
        result = Bag({'rows': rows, 'count': len(rows), 'requested': requested, 'query_ms': query_ms})
        result.set_item('server_ms', (perf_counter() - started) * 1000)
        return result
