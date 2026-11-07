from genro_bag import Bag
from gramlot import Page as BasePage

AXES = [('power', 'Power (hp)', '#5470c6'), ('weight', 'Weight (kg)', '#3ba272'), ('accel', '0-100 km/h (s)', '#fac858'),
        ('mpg', 'Consumption (l/100 km)', '#ee6666'), ('price', 'Price (k)', '#9a60b4')]
CARS = [('Alpha', (110, 1180, 10.2, 5.4, 22)), ('Bravo', (150, 1320, 8.1, 6.6, 29)), ('Coupe', (240, 1450, 5.6, 8.9, 48)),
        ('Delta', (95, 1050, 11.8, 4.8, 17)), ('Estate', (180, 1610, 7.9, 7.4, 36))]


class Page(BasePage):
    title = 'Charts · Parallel coordinates'

    def main(self, root):
        pane = root.main(datapath='parallel', padding='12px 20px')
        self.setup_data(pane)
        pane.div(height='360px', margin_bottom='12px').chartView(
            engine='echarts', chartType='parallel', captionField='car', storepath='.rows', rowMode='values',
            seriesOptions='^.options', valueFields=','.join(code for code, _, _ in AXES), height='100%', min_width=0)
        self.table(pane)

    def setup_data(self, pane):
        # One row per car; each numeric column is a vertical axis, each row is a polyline.
        rows = Bag()
        for index, (car, values) in enumerate(CARS):
            rows.set_item(f'car{index}', Bag(dict(car=car, **{code: value for (code, _, _), value in zip(AXES, values)})))
        pane.dataSetter('.rows', rows)
        options = Bag()
        for code, caption, color in AXES:
            options.set_item(code, Bag(dict(selected=True, caption=caption, color=color, axis='left')))
        pane.dataSetter('.options', options)

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='260px')
        columns = frame.grid.struct()
        columns.column('car', name='Car', width='16%')
        for code, caption, _ in AXES:
            columns.column(code, name=caption, width='16.8%', dtype='R' if code in ('accel', 'mpg') else 'L', edit=True)
