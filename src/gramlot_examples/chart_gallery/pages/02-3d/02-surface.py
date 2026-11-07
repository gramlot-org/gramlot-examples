from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        frame = root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                               searchOn=True, chart='surface', chart_engine='plotly',
                               chart_captionField='x', height='340px', chart_secondCaptionField='y')
        columns = frame.grid.struct()
        columns.column('x', name='X', width='150px', dtype='N')
        columns.column('y', name='Y', width='150px', dtype='N')
        columns.column('height', name='Height', width='150px', dtype='N')
