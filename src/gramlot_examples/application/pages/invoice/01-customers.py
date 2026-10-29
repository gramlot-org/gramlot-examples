from gramlot import Page as BasePage
from gramlot.db import DatabaseSelectors
from gramlot.collections.inputs import mygramlot as inputs


class Page(DatabaseSelectors, BasePage):
    gramlots = [inputs]
    title = 'Invoice customers'
    css = ('/themes/gramlot-base/theme.css',)

    def main(self, root):
        pane = root.main(datapath='customer', class_='example-page stack', max_width='1000px', margin='0 auto', padding='24px')
        header = pane.header()
        header.div('APPLICATION / INVOICE', class_='muted', font_size='.75rem', letter_spacing='.12em')
        header.h1('Customers')
        header.p('test_invoice_pg · PostgreSQL, Kajenn and Asqueel', class_='muted')
        card = pane.section(class_='card stack', padding='24px', gap='24px')
        fields = card.div(display='grid', grid_template_columns='repeat(auto-fit,minmax(240px,1fr))', gap='24px')
        auxiliary = 'email,phone,full_address,@state.name,n_invoices,invoiced_total'
        template = ('<div style="font-size:.78em;line-height:1.35;width:100%">'
                    '<div style="display:flex;justify-content:space-between;gap:.75em;align-items:baseline">'
                    '<strong>{display_name}</strong>'
                    '<span style="color:var(--gramlot-text-secondary);white-space:nowrap">{n_invoices} invoices · Total {invoiced_total}</span></div>'
                    '<div style="color:var(--gramlot-text-secondary)">{email} · {phone}</div>'
                    '<div style="color:var(--gramlot-text-secondary)">{full_address} · {_state_name}</div></div>')
        select = fields.div(class_='stack', gap='8px')
        select.dbSelect(id='customer', value='^.id', dbtable='customers', lbl='Customer',
            placeholder='Search by account name', emptyLabel='No customer',
            template=template, auxColumns=auxiliary, templateNull='—', selectedCaption='.caption', selected_suburb='.suburb',
            selected__state_name='.state_name', selected_n_invoices='.n_invoices',
            box_c_width='100%')
        select.p('Choose a customer. Locality and state help distinguish records.',
                 class_='muted', font_size='.8rem')
        combo = fields.div(class_='stack', gap='8px')
        combo.dbComboBox(id='suggestion', value='^.free_name', dbtable='customers',
            lbl='Free text', placeholder='Type a name or choose a customer', template=template, auxColumns=auxiliary, templateNull='—',
            selected_suburb='.free_suburb', box_c_width='100%')
        combo.p('Enter keeps your text; use the arrows or click to choose a suggestion.',
                class_='muted', font_size='.8rem')
        details = card.div(class_='grid', border_top='1px solid var(--gramlot-border)', padding_top='16px')
        for title, binding, identity in (
            ('Account name', '^.caption', 'selected-caption'),
            ('Locality', '^.suburb', 'selected-suburb'),
            ('State', '^.state_name', 'selected-state'),
            ('Invoice count', '^.n_invoices', 'selected-invoices'),
        ):
            cell = details.div()
            cell.div(title, class_='muted', font_size='.8rem')
            cell.div(binding, id=identity, min_height='1.5em', overflow_wrap='anywhere')
        pane.p('Read-only. Selections stay in this page and do not change the database.',
               class_='muted', font_size='.8rem')
