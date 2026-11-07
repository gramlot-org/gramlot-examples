from genro_bag import Bag
from gramlot import Page as BasePage

STAGES = [('Leads', 1200), ('Qualified', 640), ('Proposal', 310), ('Negotiation', 150), ('Won', 80)]


class Page(BasePage):
    title = 'Charts · Funnel'

    def main(self, root):
        pane = root.main(datapath='funnel', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(240px, 1fr) minmax(320px, 2fr)')
        self.table(row)
        self.chart(row.div(height='420px'))

    def setup_data(self, pane):
        # One row per stage; the Data Bag is shared by the grid and the chart.
        rows = Bag({f'stage{index}': Bag(dict(stage=stage, deals=deals)) for index, (stage, deals) in enumerate(STAGES)})
        pane.dataSetter('.rows', rows)
        pane.dataSetter('.options', Bag(dict(deals=Bag(dict(selected=True, caption='Deals', color='#5470c6', axis='left')))))

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='420px')
        columns = frame.grid.struct()
        columns.column('stage', name='Stage', width='50%')
        columns.column('deals', name='Deals', width='50%', dtype='L', edit=True)

    def chart(self, parent):
        parent.chartFunnel(engine='echarts', captionField='stage', measure='deals', storepath='.rows',
                           rowMode='values', seriesOptions='^.options',
                           height='100%', min_width=0)
