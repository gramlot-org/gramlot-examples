from genro_bag import Bag
from gramlot import Page as BasePage

# Company budget in thousands: department > team > cost item. A leaf carries `amount`; a parent never does.
BUDGET = {
    'eng': ('Engineering', {
        'platform': ('Platform', {'cloud': ('Cloud hosting', 120), 'licences': ('Tool licences', 45), 'oncall': ('On-call', 30)}),
        'product': ('Product', {'design': ('Design tools', 25), 'research': ('User research', 40), 'proto': ('Prototypes', 18)}),
        'quality': ('Quality', {'devices': ('Test devices', 22), 'automation': ('Automation', 35)})}),
    'sales': ('Sales', {
        'field': ('Field', {'travel': ('Travel', 60), 'events': ('Events', 85), 'samples': ('Samples', 15)}),
        'inside': ('Inside', {'crm': ('CRM', 40), 'ads': ('Advertising', 70)})}),
    'ops': ('Operations', {
        'office': ('Office', {'rent': ('Rent', 150), 'utilities': ('Utilities', 32)}),
        'support': ('Support', {'helpdesk': ('Helpdesk', 55), 'training': ('Training', 20), 'tools': ('Support tools', 28)})}),
}


def build(items):
    """A node with a dict is a parent: its value is a Bag of children and it carries only `name`."""
    bag = Bag()
    for label, (name, content) in items.items():
        if isinstance(content, dict):
            bag.set_item(label, build(content), name=name)
        else:
            bag.set_item(label, None, name=name, amount=content)
    return bag


def parents(items, path, caption=''):
    """Every parent node as (caption, path of labels under .budget), for the selector and the grids."""
    for label, (name, content) in items.items():
        if isinstance(content, dict):
            yield f'{caption}{name}', f'{path}{label}'
            yield from parents(content, f'{path}{label}.', f'{caption}{name} / ')


class Page(BasePage):
    title = 'Charts · Treemap'

    def main(self, root):
        pane = root.main(datapath='treemap', padding='12px 20px')
        self.setup_data(pane)
        row = pane.div(display='grid', gap='12px', grid_template_columns='minmax(300px, 1fr) minmax(320px, 2fr)')
        self.editor(row)
        self.chart(row.div(height='460px'))

    def setup_data(self, pane):
        # One nested Bag: the chart reads it whole, the grid edits the children of the selected parent.
        pane.dataSetter('.budget', build(BUDGET))
        pane.dataSetter('.branch', 'eng.platform')
        pane.dataSetter('.options', Bag(dict(amount=Bag(dict(selected=True, caption='Amount', color='#5470c6', axis='left')))))

    def editor(self, parent):
        column = parent.div(display='grid', gap='8px', align_content='start')
        picker = column.select(value='^.branch', aria_label='Parent node', width='100%')
        # One grid per parent node, each on the children of that parent; only the chosen one is shown.
        # A grid keeps its own state next to its store, so a variable store path is not used.
        grids = column.div()
        for caption, path in parents(BUDGET, ''):
            picker.option(caption, value=path)
            frame = grids.frameGrid(storepath=f'.budget.{path}', rowMode='attributes', height='380px',
                                    hidden=f'^.branch:={{}}!=="{path}"')
            columns = frame.grid.struct()
            columns.column('name', name='Name', width='60%', edit=True)
            columns.column('amount', name='Amount', width='40%', dtype='L', edit=True)

    def chart(self, parent):
        parent.chartView(engine='echarts', chartType='treemap', captionField='name', storepath='.budget',
                         rowMode='attributes', seriesOptions='^.options', valueFields='amount',
                         height='100%', min_width=0)
