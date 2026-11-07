from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        frame = root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                               searchOn=True, chart='scatter', chart_engine='plotly',
                               chart_captionField='x', height='340px')
        columns = frame.grid.struct()
        columns.column('x', name='Input', width='150px', dtype='N')
        columns.column('value', name='Observed', width='150px', dtype='N')
