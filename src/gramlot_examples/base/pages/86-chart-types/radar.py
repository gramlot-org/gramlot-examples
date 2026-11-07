from genro_bag import Bag
from gramlot import Page as BasePage

CRITERIA = [('speed', 'Speed', '#5470c6'), ('battery', 'Battery', '#3ba272'), ('camera', 'Camera', '#fac858'),
            ('screen', 'Screen', '#ee6666'), ('price', 'Value for money', '#9a60b4')]
PRODUCTS = [('Aurora', (8, 6, 9, 7, 5)), ('Borealis', (6, 9, 6, 8, 8)), ('Cirrus', (9, 5, 7, 9, 4))]


class Page(BasePage):
    title = 'Charts · Radar'

    def main(self, root):
        pane = root.main(datapath='radar', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(320px, 1fr) minmax(320px, 1fr)')
        self.table(row)
        self.chart(row.div(height='420px'))

    def setup_data(self, pane):
        # One row per product; each criterion is a measure and so one axis of the polygon.
        rows = Bag()
        for index, (product, scores) in enumerate(PRODUCTS):
            rows.set_item(f'product{index}', Bag(dict(product=product, **{code: score for (code, _, _), score in zip(CRITERIA, scores)})))
        pane.dataSetter('.rows', rows)
        options = Bag()
        for code, caption, color in CRITERIA:
            options.set_item(code, Bag(dict(selected=True, caption=caption, color=color, axis='left')))
        options.get_item('speed').set_item('max', 10)  # a fixed axis maximum; the other axes follow the data
        pane.dataSetter('.options', options)

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='420px')
        columns = frame.grid.struct()
        columns.column('product', name='Product', width='22%')
        for code, caption, _ in CRITERIA:
            columns.column(code, name=caption, width='15.6%', dtype='L', edit=True)

    def chart(self, parent):
        parent.chartRadar(engine='echarts', captionField='product', storepath='.rows',
                          rowMode='values', seriesOptions='^.options',
                          measures=','.join(code for code, _, _ in CRITERIA), height='100%', min_width=0)
