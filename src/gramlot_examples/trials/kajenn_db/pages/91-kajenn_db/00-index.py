"""Introduction to the optional Kajenn/Asqueel database catalogue."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Kajenn and Asqueel'

    def main(self, root):
        pane = root.div(style='padding:24px;max-width:720px')
        pane.h1(self.title)
        pane.p('These examples read and save customers through Kajenn and Asqueel. The host supplies the database model.')
        pane.p('The client changes a key; a PageStore controller loads the record. Save publishes an event. The record, status and error travel through dataBinder.')
        pane.p('On the public gallery, copy a customer ID from Asqueel selectors. The records belong to the shared test_invoice_pg_xl demonstration database. Try an unknown ID or an empty name: the saved record stays unchanged.')
        pane.p('The family lesson uses direct and nested frames and connected windows, with one WebSocket owned by the gallery.')
