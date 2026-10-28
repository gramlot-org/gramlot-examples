"""Introduction to the optional Kajenn/Asqueel database catalogue."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Kajenn and Asqueel'

    def main(self, root):
        pane = root.div(style='padding:24px;max-width:720px')
        pane.h1(self.title)
        pane.p('These examples read and save real customers in a dedicated SQLite database through Kajenn and Asqueel.')
        pane.p('The client changes a key; a PageStore controller loads the record. Save publishes an event. The record, status and error travel through dataBinder.')
        pane.p('Use customer 1 or 2. Try an unknown key, an empty name or a duplicate email. Failed saves leave the stored record unchanged.')
        pane.p('The family lesson uses direct and nested frames and connected windows, with one WebSocket owned by the gallery.')
