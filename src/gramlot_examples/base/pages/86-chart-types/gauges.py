from gramlot import Page as BasePage

THRESHOLDS = '65:#e6a23c,85:#c23531'


class Page(BasePage):
    title = 'Charts · Gauges'

    def main(self, root):
        pane = root.main(datapath='gauges', padding='12px 20px')
        self.controls(pane.formlet(class_='card stack', width='100%', max_width='32rem'))
        self.gauges(pane.div(class_='gauge-row', display='grid', gap='12px', margin_top='12px',
                             grid_template_columns='repeat(auto-fit, minmax(220px, 1fr))'))
        self.attribute_gauge(pane.div(margin_top='12px', max_width='32rem'))

    def controls(self, form):
        form.horizontalSlider(id='value', value='^.value', lbl='Value', min='^.min', max='^.max', step=1,
                              live=True, default=62)
        form.filteringSelect(id='presentation', value='^.presentation', lbl='Presentation',
                             values='needle,ring,arc', default='needle')
        form.numberTextBox(id='min', value='^.min', lbl='Min', dtype='L', default=0)
        form.numberTextBox(id='max', value='^.max', lbl='Max', dtype='L', default=100)
        form.textbox(id='thresholds', value='^.thresholds', lbl='Thresholds', default=THRESHOLDS)
        form.textbox(id='mask', value='^.mask', lbl='Mask', default='{} %')
        form.p('^.value', mask='Value in Data: {}')

    def gauges(self, row):
        # The first three gauges share the node value; each fixes its own presentation.
        for presentation in ('needle', 'ring', 'arc'):
            row.div(height='240px').gauge('^.value', min='^.min', max='^.max', mask='^.mask',
                                          thresholds='^.thresholds', presentation=presentation,
                                          caption=presentation.title())

    def attribute_gauge(self, cell):
        # The value is the attribute `percent` of the Data node `.cpu`, not the value of the node.
        cell.dataSetter('.cpu', None, percent=38)
        cell.horizontalSlider(id='cpu', value='^.cpu?percent', lbl='CPU attribute', min=0, max=100, step=1, live=True)
        cell.div(height='240px').gauge('^.cpu?percent', mask='{} %', thresholds='^.thresholds',
                                       presentation='^.presentation', caption='CPU (attribute form)')
