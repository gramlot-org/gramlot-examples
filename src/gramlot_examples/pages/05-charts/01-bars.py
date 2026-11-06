from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.numberTextBox(value="^report.rows.north.revenue", lbl="North revenue", dtype="L", live=True)
        frame = root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                               searchOn=True, chart=True,
                               chart_captionField='region', height='340px')
        columns = frame.grid.struct()
        columns.column('region', name='Region', width='150px')
        columns.column('revenue', name='Revenue', width='150px', dtype='N')
        columns.column('margin', name='Margin', width='150px', dtype='N')
