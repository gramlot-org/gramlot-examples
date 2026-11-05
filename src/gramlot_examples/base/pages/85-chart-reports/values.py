from gramlot_examples.base.chart_report import ChartReportPage, FixtureChartReport, fixture_geography

class Page(ChartReportPage):
    title='Chart qualification · values rows'
    row_mode='values'
    provider=FixtureChartReport('values')
    geojson=fixture_geography()
