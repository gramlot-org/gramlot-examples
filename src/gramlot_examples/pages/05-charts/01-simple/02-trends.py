from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        frame = root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                               searchOn=True, chart='line', chart_engine='echarts',
                               chart_captionField='x', height='340px')
        columns = frame.grid.struct()
        columns.column('x', name='Sample', width='150px', dtype='L')
        columns.column('revenue', name='Signal A', width='150px', dtype='N')
        columns.column('margin', name='Signal B', width='150px', dtype='N')
