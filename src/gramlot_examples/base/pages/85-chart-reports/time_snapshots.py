"""Prepared monthly rows animated through the shared chart configurator."""
from datetime import date
from genro_bag import Bag
from gramlot import Page as BasePage, ChartPane


class Page(BasePage):
    title = 'Temporal snapshots · shared chart configurator'

    def main(self, root):
        pane = root.main(max_width='1200px', margin='20px auto', padding='16px')
        pane.h1('Monthly sales snapshots')
        pane.p('Move the slider or press Play / Pause. Each frame shows the prepared rows for one month; the chart does not aggregate them.')
        rows = Bag()
        for month in range(1, 13):
            for rank, region in enumerate(['North', 'South', 'East', 'West']):
                rows.set_item(f'm{month}_{rank}', None, period=date(2026, month, 15), region=region, rank=rank,
                              revenue=1000+rank*350+month*(90+rank*30), margin=180+rank*50+month*20)
        configuration = Bag(dict(engine='echarts', chartType='bar', captionField='region',
                                 timeField='period', timeStep='month', timeSpeed=0.5))
        for field in ['revenue', 'margin', 'rank']:
            configuration.set_item(f'seriesOptions.{field}', Bag(dict(selected=field=='revenue')))
        ChartPane(pane, store=rows, configuration=configuration, storepath='sales.rows',
                  datapath='sales.chart', id='temporal-pane', height='550px')
        pane.p('Use Chart settings to choose the date field and period. Off restores all rows. For uPlot select Lines and Rank as the category field; its numeric-X requirement remains unchanged.')
