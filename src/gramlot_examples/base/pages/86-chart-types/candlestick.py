from datetime import date, timedelta

from genro_bag import Bag
from gramlot import Page as BasePage

# Open, high, low, close per trading day, for a made-up share.
DAYS = [(100, 104, 98, 103), (103, 107, 102, 106), (106, 108, 103, 104), (104, 105, 99, 100), (100, 103, 97, 102),
        (102, 109, 101, 108), (108, 112, 107, 111), (111, 113, 108, 109), (109, 110, 104, 105), (105, 108, 103, 107),
        (107, 111, 106, 110), (110, 114, 109, 113), (113, 115, 110, 111), (111, 112, 106, 107), (107, 109, 102, 103),
        (103, 106, 101, 105), (105, 110, 104, 109), (109, 113, 108, 112), (112, 116, 111, 115), (115, 117, 112, 113)]
FIELDS = [('open', 'Open'), ('high', 'High'), ('low', 'Low'), ('close', 'Close')]


class Page(BasePage):
    title = 'Charts · Candlestick'

    def main(self, root):
        pane = root.main(datapath='candlestick', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(320px, 1fr) minmax(320px, 2fr)')
        self.table(row)
        self.chart(row.div(height='420px'))

    def setup_data(self, pane):
        # One row per day. The four measures are read in the order open, high, low, close.
        start = date(2026, 3, 2)
        rows = Bag()
        for index, (open_, high, low, close) in enumerate(DAYS):
            rows.set_item(f'day{index}', Bag(dict(day=start + timedelta(days=index), open=open_, high=high, low=low, close=close)))
        pane.dataSetter('.rows', rows)
        options = Bag()
        for code, caption in FIELDS:
            options.set_item(code, Bag(dict(selected=True, caption=caption, color='#5470c6', axis='left')))
        # Candle colors are read from the first measure (open): green when the close is above the open.
        options.get_item('open').set_item('upColor', '#3ba272')
        options.get_item('open').set_item('downColor', '#ee6666')
        pane.dataSetter('.options', options)

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='420px')
        columns = frame.grid.struct()
        columns.column('day', name='Day', width='28%', dtype='D')
        for code, caption in FIELDS:
            columns.column(code, name=caption, width='18%', dtype='R', edit=True)

    def chart(self, parent):
        parent.chartView(engine='echarts', chartType='candlestick', captionField='day', storepath='.rows',
                         rowMode='values', seriesOptions='^.options', valueFields='open,high,low,close',
                         height='100%', min_width=0)
