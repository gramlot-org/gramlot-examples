"""Independent customer drafts in frames and connected windows, sharing SQLite."""
from gramlot import Page as BasePage


class Page(BasePage):
    title = 'Customer editing across windows'

    def main(self, root):
        pane = root.div(style='padding:20px;display:grid;gap:16px')
        pane.h1(self.title)
        pane.p('Load customer 1 in two pages. Save in one, then reload in the other: both use the same SQLite database, with independent PageStore drafts.')
        pane.a('Open a connected customer window', href='./01_customer', target='_blank',
               rel='opener', id='open-family-window')
        pane.iframe(src='./01_customer', title='Direct SQLite customer',
                    id='direct-customer', width='100%', height='760px')
        pane.iframe(src='./03_nested', title='Nested SQLite customer branch',
                    id='customer-branch', width='100%', height='850px')
        pane.p('The gallery owns the single WebSocket. Closing a connected parent closes its descendant windows.')
