"""Base chat with echo and a server-authored interactive Source response."""
from urllib.parse import quote
from time import sleep
from gramlot import Page as BasePage, GramlotBuilder, ChatPane, ChatPageStore


class Page(BasePage):
    title = 'Echo and interactive replies'

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
        b = GramlotBuilder()
        panel = b.root.div(class_='interactive-reply')
        panel.dataSetter('.count', 0)
        panel.dataSetter('.note', '')
        panel.h3('A message made of Gramlot Source')
        panel.p('This card has its own data. Add another card: each counter and note remain independent.')
        svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120"><rect width="400" height="120" rx="16" fill="#173c42"/><circle cx="64" cy="60" r="30" fill="#81d9cb"/><path d="M52 60l9 9 18-22" fill="none" stroke="#173c42" stroke-width="6"/><text x="115" y="69" fill="#e6fffb" font-size="24" font-family="sans-serif">Source inside chat</text></svg>'
        panel.img(src='data:image/svg+xml,'+quote(svg), alt='Source inside chat illustration', max_width='100%', width='400px')
        table = panel.table()
        for label, value in [('Content', 'Text, image, table and controls'), ('Processing', 'Python PageStore'), ('Local state', 'One datapath per message')]:
            row = table.tr(); row.th(label); row.td(value)
        actions = panel.div(display='flex', gap='12px', align_items='center')
        actions.button('Increment').dataController(func='increment')
        actions.span('Clicks: ').span('^.count')
        panel.input(value='^.note', live=True, aria_label='Message note', placeholder='A note for this message')
        panel.p('Your note: ').span('^.note')
        return b.source
