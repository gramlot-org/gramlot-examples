from gramlot_examples.base.chart_report import ChartReportPage, FixtureChartReport, fixture_geography

class Page(ChartReportPage):
    title='Chart qualification · attributes rows'
    row_mode='attributes'
    provider=FixtureChartReport('attributes')
    geojson=fixture_geography()
