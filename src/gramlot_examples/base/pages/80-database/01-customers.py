"""One selector page shared by all three Base database adapters."""
from gramlot import Page as BasePage
from gramlot.db import DatabaseSelectors


class Page(DatabaseSelectors, BasePage):
    selector_parameters = {'auxColumns': '@state.name', 'selected__state_name': '.state_name'}

    title = 'Customers · Base gallery'
    css = ('/themes/gramlot-base/theme.css',)

    def main(self, root):
        pane = root.main(datapath='customer', class_='example-page stack', max_width='1000px',
                         margin='0 auto', padding='32px')
        header = pane.header()
        header.div('BASE GALLERY / DATABASE', class_='muted', font_size='.75rem', letter_spacing='.12em')
        header.h1('Find a customer', margin_bottom='8px')
        header.p('The same page and all 3,200 customers across Asqueel, SQLAlchemy and Django.', class_='muted')
        card = pane.section(class_='card stack', padding='28px', gap='24px', margin_top='24px')
        fields = card.div(display='grid', grid_template_columns='repeat(auto-fit,minmax(260px,1fr))', gap='28px')
        select = fields.div(class_='stack', gap='8px')
        select.dbSelect(id='customer', value='^.id', dbtable='customers', lbl='Customer',
            placeholder='Search by account name', emptyLabel='No customer', **self.selector_parameters,
            selectedCaption='.caption', selected_suburb='.suburb', box_c_width='100%')
        select.p('Choose an existing customer. The selected fields below follow the record.', class_='muted', font_size='.85rem')
        combo = fields.div(class_='stack', gap='8px')
        combo.dbComboBox(id='suggestion', value='^.free_name', dbtable='customers', lbl='Free text or customer',
            placeholder='Type a name or choose a suggestion', auxColumns=self.selector_parameters['auxColumns'],
            selected_suburb='.free_suburb', box_c_width='100%')
        combo.p('Enter keeps your text. Use the arrows or click to choose a suggestion.', class_='muted', font_size='.85rem')
        details = card.div(display='grid', grid_template_columns='repeat(auto-fit,minmax(180px,1fr))',
                           gap='24px', border_top='1px solid var(--gramlot-border)', padding_top='24px')
        for title, binding, identity in [('Account name','^.caption','selected-caption'),
                ('Locality','^.suburb','selected-suburb'),('State','^.state_name','selected-state')]:
            cell=details.div()
            cell.div(title, class_='muted', font_size='.8rem')
            cell.div(binding, id=identity, min_height='1.5em', overflow_wrap='anywhere')
        pane.p('Read-only copy · Selections stay in this page. No database records are changed.',
               class_='muted', font_size='.85rem', margin_top='20px')
