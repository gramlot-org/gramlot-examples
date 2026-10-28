"""Load and save an Asqueel customer; the binder carries records and outcomes."""
from genro_bag import Bag
from gramlot import Page as BasePage, PageStore as BasePageStore


class Page(BasePage):
    title = 'Load and save a customer'

    def main(self, root):
        pane = root.div(datapath='view', style='padding:20px;max-width:700px;display:grid;gap:10px')
        pane.h1(self.title)
        pane.p('Enter 1 or 2, then leave the field to load. Try 99 to preserve the current record on a lookup error.')
        pane.dataBinder('.request', 'request')
        pane.dataBinder('.customer', 'customer')
        pane.html_label('Customer ID to load', for_='customer-key')
        pane.input(id='customer-key', value='^.request.pkey')
        pane.button('Reload customer', id='reload-customer',
                    action="gramlot.publish({topic: 'reload_customer', server: true}, {});")
        pane.div('Loaded ID: ').span('^.customer?pkey', id='loaded-key')
        pane.html_label('Name', for_='customer-name')
        pane.input(id='customer-name', value='^.customer.record.name')
        pane.html_label('Email', for_='customer-email')
        pane.input(id='customer-email', value='^.customer.record.email')
        pane.button('Save customer', id='save-customer',
                    action="gramlot.publish({topic: 'save_customer', server: true}, {});")
        pane.div('Status: ').span('^.customer?status', id='customer-status')
        pane.div('Error: ').span('^.customer.error', id='customer-error')
        pane.div('Page ID: ').span(self.page_id, id='current-page-id')
        pane.a('Open a connected customer window', href='./01_customer', target='_blank',
               rel='opener', id='open-customer-window')
        pane.p('Save commits to SQLite. Reload in another frame or window to see it. Each page keeps its own draft; the last successful save wins.')
        pane.p('A name is required and email addresses must be unique. Try anna@example.com on customer 1 to test a failed save.')


class PageStore(BasePageStore):
    def main(self, root):
        self.data.set_item('request', Bag({'pkey': ''}))
        self.data.set_item('customer', Bag({'record': Bag(), 'error': ''}),
                           _attributes={'status': 'unset', 'pkey': None})
        root.dataController(func='load_customer', pkey='^request.pkey', subscribe_reload_customer=True)
        root.dataController(func='save_customer', subscribe_save_customer=True)

    def status(self, value, error=''):
        self.data.set_item('customer.error', error)
        self.data.get_node('customer').set_attr({'status': value})

    def load_customer(self, node, pkey):
        if pkey is None or pkey == '':
            return
        self.status('loading')
        db = self.db()
        try:
            row = db.table('app.customer').query(where='$id=:pkey', pkey=pkey).fetchRecord()
            record = Bag(dict(row.items()))
            db.commit()
        except Exception as error:
            db.rollback()
            self.status('error', str(error))
            return
        self.data.set_item('customer.record', record)
        self.data.get_node('customer').set_attr({'pkey': pkey})
        self.status('loaded')

    def save_customer(self, node):
        pkey = self.data.get_node('customer').attr['pkey']
        if pkey is None:
            self.status('error', 'Load a customer before saving.')
            return
        name = self.data.get_item('customer.record.name')
        email = self.data.get_item('customer.record.email')
        if not isinstance(name, str) or not name.strip():
            self.status('error', 'Name is required.')
            return
        if not isinstance(email, str) or not email.strip():
            self.status('error', 'Email is required.')
            return
        self.status('saving')
        db = self.db()
        try:
            table = db.table('app.customer')
            table.query(where='$id=:pkey', pkey=pkey).fetchRecord()
            table.update({'id': pkey, 'name': name.strip(), 'email': email.strip()})
            row = table.query(where='$id=:pkey', pkey=pkey).fetchRecord()
            record = Bag(dict(row.items()))
            db.commit()
        except Exception as error:
            db.rollback()
            self.status('error', str(error))
            return
        self.data.set_item('customer.record', record)
        self.status('saved')
