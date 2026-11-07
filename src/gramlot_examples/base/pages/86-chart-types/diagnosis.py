from genro_bag import Bag
from gramlot import Page as BasePage

# Open, high, low, close and volume per trading day, for a made-up share.
DAYS = [(100, 104, 98, 103, 7), (103, 107, 102, 106, 9), (106, 108, 103, 104, 4), (104, 105, 99, 100, 6),
        (100, 103, 97, 102, 8), (102, 109, 101, 108, 12), (108, 112, 107, 111, 10), (111, 113, 108, 109, 5)]
FIELDS = [('open', 'Open'), ('high', 'High'), ('low', 'Low'), ('close', 'Close'), ('volume', 'Volume')]


class Page(BasePage):
    title = 'Charts · When a chart cannot be drawn'

    def main(self, root):
        pane = root.main(datapath='diagnosis', padding='12px 20px')
        self.setup_data(pane)
        controls = pane.div(display='flex', flex_wrap='wrap', gap='16px', align_items='center', margin_bottom='12px')
        controls.html_label('Close column', for_='diagnosis-close')
        close = controls.select(id='diagnosis-close', value='^.close', width='180px')
        for value, caption in (('close', 'Close'), ('volume', 'Volume'), ('', 'None')):
            close.option(caption, value=value)
        controls.html_label('Bar measures', for_='diagnosis-measures')
        measures = controls.select(id='diagnosis-measures', value='^.measures', width='180px')
        for value, caption in (('open,close', 'Open and close'), ('volume', 'Volume'), ('', 'None')):
            measures.option(caption, value=value)
        row = pane.div(display='grid', gap='12px', grid_template_columns='repeat(auto-fit, minmax(320px, 1fr))')
        row.div(height='340px').chartCandlestick(engine='echarts', captionField='day', open='open', high='high', low='low',
                                                 close='^.close', storepath='.rows', rowMode='values',
                                                 seriesOptions='^.options', height='100%', min_width=0)
        row.div(height='340px').chartBar(engine='echarts', captionField='day', measures='^.measures', storepath='.rows',
                                         rowMode='values', seriesOptions='^.options', height='100%', min_width=0)

    def setup_data(self, pane):
        rows = Bag()
        for index, (open_, high, low, close, volume) in enumerate(DAYS):
            rows.set_item(f'day{index}', Bag(dict(day=f'D{index + 1}', open=open_, high=high, low=low, close=close, volume=volume)))
        pane.dataSetter('.rows', rows)
        options = Bag()
        for index, (code, caption) in enumerate(FIELDS):
            options.set_item(code, Bag(dict(caption=caption, color=('#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de')[index], axis='left')))
        options.get_item('open').set_item('upColor', '#3ba272')
        options.get_item('open').set_item('downColor', '#ee6666')
        pane.dataSetter('.options', options)
        pane.dataSetter('.close', 'close')
        pane.dataSetter('.measures', 'open,close')
