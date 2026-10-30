"""Asqueel only: materialized invoice selection and a bounded browser window."""
from time import perf_counter
from uuid import uuid4

from genro_bag import Bag
from gramlot import PageStore as BasePageStore
from gramlot_examples.base.selection_trial import SelectionTrialPage, COLUMNS, ROW_LIMITS

LIMITS = (*ROW_LIMITS, 200000, 500000)
FIELDS = ('id','customer_name','state','invoice_number','invoice_date','product_code',
          'description','quantity','unit_price','tot_price')


class Page(SelectionTrialPage):
    title = 'Asqueel only · cached invoice rows'
    description = 'Asqueel only · Server selection, server search/sort, small browser window. Up to 500,000 invoice rows.'
    notes = (
        'The threshold is configurable on the server (default 1,000 actual selected rows). Small selections load completely; larger selections use cachedFetch. The browser normally retains 200 rows while the scrollbar represents the server total.',
        'Search matches every word across text columns on the server; it is not the typed searchOn syntax. Click headers to sort; Shift-click adds or reverses a sort column. Search and sort reset the window to the beginning.',
        'Materialization includes database-side creation of the cached result and its index. First window and scroll measure request to window ready; search has server and client-total timings. Client search total includes the 200 ms typing debounce. Final paint is excluded. Heights of unloaded rows are estimated.',
    )

    def timing_fields(self):
        return [('count_ms','Count / threshold'),('materialize_ms','Materialization'),
                ('first_ms','First window ready'),('window_ms','Server window read'),
                ('scroll_ms','Scroll → window ready'),('search_ms','Server search'),
                ('search_total_ms','Search → window ready'),('sort_ms','Server sort')]

    def load_source(self, pane):
        pane.dataSetter('.seed','')
        pane.dataSetter('.sort','')
        pane.dataBinder('.inbox','selection_window')
        pane.dataBinder('.ready','selection_ready')
        pane.windowSelection(ready='^.ready',inbox='^.inbox',limit='^.limit',seed='^.seed',
            sortedBy='^.sort',viewport='^.viewport',reload='^.reload',result='^.selection',
            metrics='^.metrics',status='^.status',display='none')

    def search_control(self, bar):
        bar.menuline(group=True).input(type='search',value='^.seed',live=True,
            placeholder='Search all text columns',aria_label='Server search',width='280px',
            padding='6px 12px',border_radius='18px',border='1px solid var(--gramlot-border)',
            background='var(--gramlot-surface)',color='var(--gramlot-text)')

    row_limits = LIMITS

    def configure_grid(self, frame):
        frame.grid.set_attr(windowInfo='^.selection.window',viewport='^.viewport',sortRequest='^.sort',rowResize=False)

    def status_details(self, facts):
        facts.span('^.selection.mode',mask='Mode: {}',id='trial-mode',margin_right='12px')
        facts.span('^.selection.resident',mask='Browser rows: {}',id='trial-resident',margin_right='12px')
        facts.span('^.selection.threshold',mask='Threshold: {}',id='trial-threshold')


def sort_criteria(sorted_by):
    """Validate the public field/direction protocol before composing SQL order_by."""
    criteria = []
    for item in sorted_by.split(',') if sorted_by else []:
        field, direction = item.split(':')
        if field not in FIELDS or direction not in ('a', 'd') or field in [c[0] for c in criteria]:
            raise ValueError('Invalid sort column')
        criteria.append((field, direction))
    return criteria


class PageStore(BasePageStore):
    cache_threshold = 1000

    def main(self, root):
        self._owner = 'grid_' + uuid4().hex
        self._cached = False
        self._records = None
        self._resident = None
        self._limit = None
        self._seed = ''
        self._sort = ''
        self._revision = 0
        self._timings = dict(count_ms=0, materialize_ms=0, search_ms=0, sort_ms=0)
        self.data.set_item('selection_ready', True)
        self.data.set_item('selection_window', Bag())
        root.dataController(func='selection_request', subscribe_selection_request=True)

    def _load_selection(self, session, table, limit):
        tick = perf_counter()
        selected = min(int(limit), table.query().count())
        self._timings = dict(count_ms=(perf_counter() - tick) * 1000,
                             materialize_ms=0, search_ms=0, sort_ms=0)
        tick = perf_counter()
        query = table.query(columns=COLUMNS, order_by='$id', limit=int(limit))
        if selected > self.cache_threshold:
            self._total = query.fetch(destinationName=self._owner + ':rows')
            self._timings['materialize_ms'] = (perf_counter() - tick) * 1000
            self._cached = True
            self._records = self._resident = None
        else:
            if self._cached:
                session.cleanup_cached_tables(owner=self._owner)
            self._cached = False
            self._records = [dict(row.items()) for row in query.fetch()]
            self._total = len(self._records)
        self._limit = limit
        self._revision += 1

    def _filter_resident(self, seed, criteria):
        """Small selections also search/sort on the server, without materialization."""
        tick = perf_counter()
        tokens = seed.casefold().split()
        records = []
        for record in self._records:
            text = ' '.join(value for value in record.values() if isinstance(value, str)).casefold()
            if all(token in text for token in tokens):
                records.append(record)
        self._timings['search_ms'] = (perf_counter() - tick) * 1000
        tick = perf_counter()
        for field, direction in reversed(criteria):
            records.sort(key=lambda row: (row[field] is None, row[field]), reverse=direction == 'd')
        self._timings['sort_ms'] = (perf_counter() - tick) * 1000
        self._resident = records
        self._total = len(records)

    def _cached_window(self, table, seed, sorted_by, criteria, start, count, changed, criteria_changed):
        cached = table.cached(self._owner + ':rows')
        if changed or sorted_by != self._sort:
            tick = perf_counter()
            order_by = ', '.join(f'"{field}" {"ASC" if direction == "a" else "DESC"}'
                                 for field, direction in criteria)
            cached.sort(order_by or None)
            self._timings['sort_ms'] = (perf_counter() - tick) * 1000
        if changed or seed != self._seed:
            tick = perf_counter()
            self._total = cached.search(seed.strip() or None)
            self._timings['search_ms'] = (perf_counter() - tick) * 1000
        start = 0 if criteria_changed else min(start, max(0, self._total - count))
        tick = perf_counter()
        records = [dict(row.items()) for row in cached.query(start=start, count=count).fetch()]
        return start, records, (perf_counter() - tick) * 1000

    def selection_request(self, node, request_id, limit, seed, sorted_by, start, count, refresh=False):
        try:
            if (limit not in tuple(map(str, LIMITS)) or type(start) is not int or start < 0
                    or type(count) is not int or not 1 <= count <= 1000 or type(refresh) is not bool):
                raise ValueError('Invalid selection bounds')
            if not isinstance(seed, str) or not isinstance(sorted_by, str):
                raise ValueError('Invalid selection criteria')
            criteria = sort_criteria(sorted_by)
            with self.database.session() as session:
                table = session.table('invc.invoice_row')
                changed = refresh or limit != self._limit
                if changed:
                    self._load_selection(session, table, limit)
                criteria_changed = changed or seed != self._seed or sorted_by != self._sort
                if self._cached:
                    start, records, window_ms = self._cached_window(
                        table, seed, sorted_by, criteria, start, count, changed, criteria_changed)
                else:
                    if criteria_changed:
                        self._filter_resident(seed, criteria)
                    records, start, window_ms = self._resident, 0, 0
                if criteria_changed and not changed:
                    self._revision += 1
                self._seed, self._sort = seed, sorted_by
                rows = Bag()
                for index, record in enumerate(records, start):
                    rows.set_item(f'r{index}', None, _attributes=record)
                result = Bag(dict(request_id=request_id, rows=rows,
                    window=dict(start=start, total=self._total, revision=self._revision, sortedBy=sorted_by),
                    mode='cachedFetch' if self._cached else 'resident', threshold=self.cache_threshold,
                    window_ms=window_ms, **self._timings))
            self.data.set_item('selection_window', result)
        except Exception as error:
            self.data.set_item('selection_window', Bag(dict(request_id=request_id, error=str(error))))

    def close(self):
        try:
            if self._cached:
                with self.database.session() as session:
                    session.cleanup_cached_tables(owner=self._owner)
                self._cached = False
            self._records = self._resident = None
        finally:
            super().close()
