"""Two dependent selectors over the Base PostgreSQL copy, through Asqueel."""
from gramlot import Page as BasePage
from gramlot.db import DatabaseSelectors


class Page(DatabaseSelectors, BasePage):
    css = ('/themes/gramlot-base/theme.css',)

    def main(self, root):
        pane = root.main(datapath='selection', class_='example-page stack',
                         max_width='850px', margin='0 auto', padding='24px')
        fields = pane.div(class_='card stack', padding='20px', gap='18px')
        fields.filteringSelect(value='^.state_caption', values='name:Full name,code:Code',
                               default='name', lbl='State label', id='state-caption')
        fields.dbSelect(value='^.state', dbtable='states', lbl='State', id='state',
                        caption_field='^.state_caption', selectedCaption='.state_name', placeholder='Choose a state',
                        emptyLabel='No state', box_c_width='100%')
        fields.dbSelect(value='^.customer', dbtable='customers', lbl='Customer', id='customer',
                        condition='$state=:state', condition_state='^.state', weakCondition='^.weak',
                        validate_notnull=True, selectedCaption='.caption', selected_state='.customer_state',
                        auxColumns='@state.name', placeholder='Search customers', box_c_width='100%')
        fields.checkbox(value='^.weak', label='Prefer this state (weak condition)', default=False)
        details = pane.div(class_='card stack', padding='16px')
        for label, path in [('Chosen state', 'state_name'), ('Customer', 'caption'),
                            ('Customer state', 'customer_state')]:
            line = details.div()
            line.strong(label + ': ')
            line.span('^.' + path)
