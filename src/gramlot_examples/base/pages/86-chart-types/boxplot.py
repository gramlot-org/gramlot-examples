from genro_bag import Bag
from gramlot import Page as BasePage

# The host supplies the statistics: min, q1, median, q3, max per group.
GROUPS = [('Team A', (42, 55, 63, 72, 90)), ('Team B', (35, 48, 58, 66, 80)), ('Team C', (50, 60, 70, 78, 95)),
          ('Team D', (28, 40, 52, 61, 75)), ('Team E', (45, 52, 60, 69, 85))]
FIELDS = [('minimum', 'Min'), ('q1', 'Q1'), ('median', 'Median'), ('q3', 'Q3'), ('maximum', 'Max')]


class Page(BasePage):
    title = 'Charts · Boxplot'

    def main(self, root):
        pane = root.main(datapath='boxplot', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(320px, 1fr) minmax(320px, 1fr)')
        self.table(row)
        self.chart(row.div(height='420px'))

    def setup_data(self, pane):
        # One row per group. The five measures are read in the order min, q1, median, q3, max.
        rows = Bag()
        for index, (group, stats) in enumerate(GROUPS):
            rows.set_item(f'group{index}', Bag(dict(group=group, **{code: value for (code, _), value in zip(FIELDS, stats)})))
        pane.dataSetter('.rows', rows)
        options = Bag()
        for code, caption in FIELDS:
            options.set_item(code, Bag(dict(selected=True, caption=caption, color='#5470c6', axis='left')))
        pane.dataSetter('.options', options)

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='420px')
        columns = frame.grid.struct()
        columns.column('group', name='Group', width='25%')
        for code, caption in FIELDS:
            columns.column(code, name=caption, width='15%', dtype='L', edit=True)

    def chart(self, parent):
        parent.chartBoxplot(engine='echarts', captionField='group', min='minimum', q1='q1', median='median', q3='q3',
                            max='maximum', storepath='.rows', rowMode='values', seriesOptions='^.options',
                            height='100%', min_width=0)
