from genro_bag import Bag
from gramlot import Page as BasePage

FLOWS = [('Salary', 'Budget', 3200), ('Freelance', 'Budget', 600), ('Budget', 'Housing', 1300), ('Budget', 'Food', 650),
         ('Budget', 'Transport', 320), ('Budget', 'Savings', 700), ('Budget', 'Leisure', 480), ('Savings', 'Pension', 300),
         ('Savings', 'Emergency', 400)]


class Page(BasePage):
    title = 'Charts · Sankey'

    def main(self, root):
        pane = root.main(datapath='sankey', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(300px, 1fr) minmax(320px, 2fr)')
        self.table(row)
        self.chart(row.div(height='420px'))

    def setup_data(self, pane):
        # One row per link: source, target and the amount that flows between them.
        rows = Bag({f'flow{index}': Bag(dict(source=source, target=target, amount=amount))
                    for index, (source, target, amount) in enumerate(FLOWS)})
        pane.dataSetter('.rows', rows)
        pane.dataSetter('.options', Bag(dict(amount=Bag(dict(selected=True, caption='Amount', color='#5470c6', axis='left')))))

    def table(self, parent):
        frame = parent.frameGrid(storepath='.rows', rowMode='values', height='420px')
        columns = frame.grid.struct()
        columns.column('source', name='From', width='34%', edit=True)
        columns.column('target', name='To', width='34%', edit=True)
        columns.column('amount', name='Amount', width='32%', dtype='L', edit=True)

    def chart(self, parent):
        parent.chartView(engine='echarts', chartType='sankey', captionField='source', secondCaptionField='target',
                         storepath='.rows', rowMode='values', seriesOptions='^.options', valueFields='amount',
                         height='100%', min_width=0)
