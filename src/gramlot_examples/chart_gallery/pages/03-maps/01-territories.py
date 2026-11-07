from gramlot import Page as BasePage


class Page(BasePage):
    def main(self, root):
        root.dataFormula("report._chart.geoJSON", "JSON.parse(text)", text="^report.geometry", _onBuilt=True)
        frame = root.frameGrid(datapath='report', storepath='.rows', rowMode='values',
                               searchOn=True, chart='map', chart_engine='echarts',
                               chart_captionField='region', height='340px', chart_mapValueField='revenue')
        columns = frame.grid.struct()
        columns.column('region', name='Region', width='150px')
        columns.column('revenue', name='Revenue', width='150px', dtype='N')
        columns.column('margin', name='Margin', width='150px', dtype='N')
