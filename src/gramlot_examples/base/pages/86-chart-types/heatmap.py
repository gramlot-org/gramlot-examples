from genro_bag import Bag
from gramlot import Page as BasePage

DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
HOURS = ['09h', '11h', '13h', '15h', '17h']
ACTIVITY = [[12, 30, 8, 25, 14], [18, 34, 10, 28, 12], [15, 29, 9, 31, 20], [20, 36, 12, 27, 16], [10, 22, 6, 18, 24]]


class Page(BasePage):
    title = 'Charts · Heatmap'

    def main(self, root):
        pane = root.main(datapath='heatmap', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(260px, 1fr) minmax(320px, 2fr)')
        self.table(row)
        self.chart(row.div(height='420px'))

    def setup_data(self, pane):
        # One row per (day, hour) pair; the measure is the color of that cell.
        rows = Bag()
        for d, day in enumerate(DAYS):
            for h, hour in enumerate(HOURS):
                rows.set_item(f'cell{d}_{h}', Bag(dict(day=day, hour=hour, events=ACTIVITY[d][h])))
        pane.dataSetter('.rows', rows)
        pane.dataSetter('.options', Bag(dict(events=Bag(dict(selected=True, caption='Events', color='#d6403a', axis='left')))))

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='420px')
        columns = frame.grid.struct()
        columns.column('day', name='Day', width='34%')
        columns.column('hour', name='Hour', width='33%')
        columns.column('events', name='Events', width='33%', dtype='L', edit=True)

    def chart(self, parent):
        parent.chartHeatmap(engine='echarts', captionField='day', secondCaptionField='hour', measure='events',
                            storepath='.rows', rowMode='values', seriesOptions='^.options',
                            height='100%', min_width=0)
