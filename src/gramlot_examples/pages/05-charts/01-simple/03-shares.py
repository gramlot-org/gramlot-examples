from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        frame = root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                               searchOn=True, chart='pie', chart_engine='echarts',
                               chart_captionField='region', height='340px')
        columns = frame.grid.struct()
        columns.column('region', name='Region', width='150px')
        columns.column('revenue', name='Revenue', width='150px', dtype='N')
