"""Shared JSONL loading and query for the local resident invoice selections."""
from time import perf_counter

from genro_bag import Bag
from gramlot import Page as BasePage, endpoint
from gramlot.server.selection_trial import SelectionTrialRows
from gramlot.collections.selection_trial import mygramlot as selection_trial

ROW_LIMITS = (100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000)
COLUMNS = ('$id,@invoice_id.@customer_id.account_name AS customer_name,'
           '@invoice_id.@customer_id.state AS state,@invoice_id.inv_number AS invoice_number,'
           '@invoice_id.date AS invoice_date,@product_id.code AS product_code,'
           '@product_id.description AS description,$quantity,$unit_price,$tot_price')


def read_records(database, limit):
    if not isinstance(limit, str) or limit not in tuple(str(n) for n in ROW_LIMITS):
        raise ValueError('Choose one of the declared record limits')
    with database.database.session() as session:
        started = perf_counter()
        records = session.table('invc.invoice_row').query(
            columns=COLUMNS, order_by='$id', limit=int(limit)).fetch()
        query_ms = (perf_counter() - started) * 1000
    return records, query_ms



class SelectionTrialPage(BasePage):
    gramlots = [selection_trial]
    row_limits = ROW_LIMITS

    description = 'Load the complete XL invoice selection through typed JSONL. Change the row limit to repeat the measurement.'
    notes = (
        'Body reception is elapsed time from response headers to complete consumption. It overlaps decoding and Bag insertion, and includes producer/backpressure delays; it is not pure network time. Do not sum overlapping timings.',
        'Search measures the existing synchronous applyFilter, excluding the 100 ms typing delay and rendering. The completed Bag replaces the previous selection atomically; failed or cancelled streams retain the last successful selection.',
    )

    def load_source(self, pane):
        pane.selectionTrial(url='/gramlot/selection-trial', method='load_trial_rows',
                            limit='^.limit', reload='^.reload', result='^.selection',
                            metrics='^.metrics', status='^.status', display='none')

    def timing_fields(self):
        return [('query_ms', 'Query / fetch'), ('headers_ms', 'Request → headers'),
                  ('receive_ms', 'Body reception'), ('decode_ms', 'Decode records'),
                  ('bag_ms', 'Client Bag insertion'), ('encode_ms', 'Server encoding'),
                  ('total_ms', 'Request → Bag ready'), ('search_ms', 'Search / filter')]

    def main(self, root):
        pane = root.main(datapath='trial', padding='16px')
        pane.h2(self.title, margin='0 0 6px')
        pane.p(self.description, margin='0 0 12px')
        pane.dataSetter('.limit', '1000')
        pane.dataSetter('.reload', 0)
        pane.dataSetter('.selection', Bag({'rows': Bag(), 'count': 0}))
        pane.dataSetter('.metrics', Bag())
        self.load_source(pane)
        metrics = pane.div(display='grid', grid_template_columns='repeat(auto-fit, minmax(150px, 1fr))',
                           gap='8px', margin_bottom='12px')
        for field, label in self.timing_fields():
            card = metrics.div(padding='8px 10px', background='var(--gramlot-surface-subtle)',
                               border_radius='6px', border='1px solid var(--gramlot-border)')
            card.div(label, font_size='12px', color='var(--gramlot-text-secondary)')
            card.div(f'^.metrics.{field}', format='0.00', mask='{} ms', id=f'trial-{field}', font_weight=600)
        frame = pane.frameGrid(storepath='.selection.rows', rowMode='attributes', height='460px',
                               border='1px solid var(--gramlot-border)', overflow='hidden')
        bar = frame.top.menu(presentation='bar', padding='4px 8px', aria_label='Selection trial tools')
        self.search_control(bar)
        bar.spacer(flex=1)
        group = bar.menuline(group=True)
        group.span('Max rows', margin_right='6px')
        limits = group.select(value='^.limit', aria_label='Maximum records', width='7rem')
        for count in self.row_limits:
            limits.option(str(count), value=str(count))
        bar.menuline(caption='Reload', action="this.SET('.reload', this.GET('.reload') + 1)")
        footer = frame.bottom.menu(presentation='bar', padding='4px 8px', aria_label='Selection trial status')
        facts = footer.menuline(group=True)
        facts.span('^.status', id='trial-status', margin_right='16px')
        facts.span('^.selection.count', mask='Loaded: {}', id='trial-count', margin_right='16px')
        self.status_details(facts)
        for note in self.notes:
            pane.p(note, font_size='12px')
        frame.grid.set_attr(id='trial-grid', rowHeaders=True, rowResize=True)
        self.configure_grid(frame)
        s = frame.grid.struct()
        for field, name, width, dtype in [
            ('customer_name', 'Customer', '210px', 'T'), ('state', 'State', '65px', 'T'),
            ('invoice_number', 'Invoice', '115px', 'T'), ('invoice_date', 'Date', '110px', 'D'),
            ('product_code', 'Product', '100px', 'T'), ('description', 'Description', '280px', 'T'),
            ('quantity', 'Quantity', '90px', 'L'), ('unit_price', 'Unit price', '110px', 'N'),
            ('tot_price', 'Total', '115px', 'N')]:
            attrs = dict(name=name, width=width, dtype=dtype)
            if dtype == 'N':
                attrs['format'] = '0.00'
            if field in ('customer_name', 'description'):
                attrs['white_space'] = 'pre-wrap'
            s.column(field, **attrs)

    def search_control(self, bar):
        bar.menuline(group=True).searchBox(searchOn=True, searchTime='^.metrics.search_ms')

    def status_details(self, facts):
        facts.span('^.metrics.mb', format='0.00', mask='Body: {} MB', margin_right='16px')

    def configure_grid(self, frame):
        pass

    @endpoint
    def load_trial_rows(self, limit):
        records, query_ms = read_records(self.database, limit)
        return SelectionTrialRows((dict(record.items()) for record in records), int(limit), query_ms)
