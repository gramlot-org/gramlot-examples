"""Base chat with echo and a server-authored interactive Source response."""
from time import sleep
from genro_bag import Bag
from gramlot import Page as BasePage, ChatPane, ChatPageStore


class Page(BasePage):

    def main(self, root):
        ui = ChatPane(root, datapath='chat', height='100dvh', id='base-chat')
        top = ui.frame.top.div(display='flex', align_items='center', padding='0 20px', height='100%', gap='12px')
        top.strong('Gramlot chat', flex=1)
        top.button('New conversation', disabled='^chat.pending').dataController(func='chatReset', chat_id='main')
        ui.composer.top.set_attr(height='26px')
        ui.composer.top.div('Echo server · Use “Source example” for an interactive reply',
                            padding='4px 16px', font_size='13px')
        bottom = ui.toolbar
        bottom.button('Source example', disabled='^chat.pending').dataController(func='sendExample', chat_id='main')
        bottom.span('No API keys · Source + PageStore + WebSocket', font_size='12px', opacity=0.7)


class PageStore(ChatPageStore):
    def process_message(self, text):
        self.feedback(f'Processing your {len(text)} character message…')
        sleep(0.6)  # Demo pacing makes replacement feedback visible.
        self.feedback('Working on it…')
        sleep(0.6)
        self.feedback('Finishing…')
        sleep(0.4)
        if text.strip() != '/source':
            return super().process_message(text)
        b = self.source_builder()
        self.order_panel(b.root)
        return b.source

    def order_panel(self, root):
        panel = root.div(class_='order-panel', datapath='.order')
        panel.dataSetter('.confirmed', False)
        panel.dataSetter('.vat', 22)
        panel.dataSetter('.customer.shipping', 'standard')
        panel.dataSetter('.items.rows', self.initial_rows())
        tabs = panel.tabContainer(height='320px')
        self.customer_tab(tabs.contentPane(node_label='customer', title='Customer', padding='12px'))
        self.items_tab(tabs.contentPane(node_label='items', title='Items'))
        self.summary_tab(tabs.contentPane(node_label='summary', title='Summary', padding='12px'))

    def initial_rows(self):
        rows = Bag()
        for label, product, quantity, price in [
                ('r1', 'Notebook', 2, 4.5), ('r2', 'Pen', 10, 1.2), ('r3', 'Folder', 3, 2.75)]:
            rows.set_item(label, Bag(dict(product=product, quantity=quantity, price=price)))
        return rows

    def customer_tab(self, pane):
        form = pane.formlet(columns=2)
        locked = '^.confirmed'
        form.textbox(value='^.customer.name', lbl='Name', validate_notnull=True,
                     validate_notnull_error='The name is required.', disabled=locked)
        form.textbox(value='^.customer.email', lbl='Email', validate_email=True, disabled=locked)
        form.dateTextBox(value='^.customer.delivery', lbl='Delivery date', disabled=locked)
        form.filteringSelect(value='^.customer.shipping', lbl='Shipping', disabled=locked,
                             values='standard:Standard,express:Express,pickup:Pickup')
        form.textBoxArea(value='^.customer.notes', lbl='Notes', rows=2, disabled=locked)

    def items_tab(self, pane):
        frame = pane.frameGrid(
            datapath='.items', storepath='.rows', rowMode='values', footer=True,
            selectionMode='multi', addrow=True, addrow_defaults={'quantity': 1, 'price': 0},
            delrow=True, height='270px')
        struct = frame.grid.struct()
        struct.column('product', name='Product', width='150px', edit=True)
        struct.column('quantity', name='Qty', dtype='L', width='70px', edit=True)
        struct.column('price', name='Price', dtype='N', format='0.00', width='90px', edit=True)
        struct.column('total', name='Total', dtype='N', format='0.00', width='100px',
                      formula='quantity * price', calculated=True, totalize=True)

    def summary_tab(self, pane):
        pane.dataFormula('.summary.rows', 'rows.getNodes().length', rows='^.items.rows', _onBuilt=True)
        pane.dataFormula('.summary.gross', 'Math.round(total * (1 + vat / 100) * 100) / 100',
                         total='^.items.totalize.total', vat='^.vat', _onBuilt=True)
        form = pane.formlet(columns=2)
        form.span('^.customer.name', lbl='Customer')
        form.span('^.summary.rows', lbl='Rows')
        form.span('^.items.totalize.total', lbl='Total')
        form.numberTextBox(value='^.vat', lbl='VAT %', disabled='^.confirmed')
        form.span('^.summary.gross', lbl='Gross')
        form.span('^.confirmed', lbl='Confirmed')
        pane.button('Confirm', disabled='^.confirmed').dataController(func='confirmOrder')
