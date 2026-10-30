"""Two dependent selectors over the Base PostgreSQL copy, through Asqueel."""
from gramlot import Page as BasePage
from gramlot.db import DatabaseSelectors


class Page(DatabaseSelectors, BasePage):
    title = 'State and customer'
    css = ('/themes/gramlot-base/theme.css',)

    def main(self, root):
        pane = root.main(datapath='selection', class_='example-page stack',
                         max_width='850px', margin='0 auto', padding='24px')
        pane.h1('State and customer')
        pane.p('Choose a state, then search for one of its customers. Change the state '
               'again: the previous customer stays visible, but becomes invalid if it no longer matches.')
        fields = pane.div(class_='card stack', padding='20px', gap='18px')
        fields.dbSelect(value='^.state', dbtable='states', lbl='State', id='state',
                        selectedCaption='.state_name', placeholder='Choose a state',
                        emptyLabel='No state', box_c_width='100%')
        fields.dbSelect(value='^.customer', dbtable='customers', lbl='Customer', id='customer',
                        condition='$state=:state', condition_state='^.state', weakCondition='^.weak',
                        validate_notnull=True, selectedCaption='.caption', selected_state='.customer_state',
                        auxColumns='@state.name', placeholder='Search customers', box_c_width='100%')
        fields.checkbox(value='^.weak', label='Prefer this state (weak condition)', default=False)
        pane.p('With the preference enabled, an empty search result is retried across all states. '
               'A customer outside the preferred state remains valid. A required selector '
               'automatically chooses a single candidate when its condition changes.', class_='muted')
        details = pane.div(class_='card stack', padding='16px')
        for label, path in [('Chosen state', 'state_name'), ('Customer', 'caption'),
                            ('Customer state', 'customer_state')]:
            line = details.div()
            line.strong(label + ': ')
            line.span('^.' + path)
        pane.p('Asqueel only · Read-only database. Your choices stay in this page.', class_='muted')
