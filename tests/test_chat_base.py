"""The credential-free chat is an ordinary optional gallery catalogue."""
import importlib.util
from pathlib import Path
import asyncio
from uuid import uuid4

from genro_bag import Bag
from gramlot import GramlotBuilder
import gramlot_examples
from gramlot_examples.gallery.collections import collections
from gramlot.collection import standard_collections
from gramlot.server import GramlotServer

TRIAL = Path(gramlot_examples.__file__).parent / 'trials/chat_base'


def load_page():
    spec = importlib.util.spec_from_file_location('gallery_chat_base', TRIAL / 'pages/92-chat/01-echo.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_chat_catalogue_keeps_source_logic_styles_and_explanation_together():
    gallery = gramlot_examples.build_gallery([(TRIAL / 'catalog.json', TRIAL / 'pages')])
    route = gallery['routes']['chat-01']
    assert route['url'] == 'pages/92-chat/01-echo'
    assert route['page'].is_file() and route['logic'].is_file() and route['stylesheet'].is_file()
    assert route['page'].with_suffix('.md').is_file()
    assert 'chat' in [collection.name for collection in (*standard_collections(), *gallery['collections'])]
    assert not any('trials/chat/pages' in str(item['page']) for item in gallery['routes'].values())
    page = load_page().Page()
    import json
    builder = GramlotBuilder(collections=[json.loads(c.verify()[c.grammar]) for c in (*standard_collections(), *collections())])
    page.main(builder.root)
    assert 'chatMessages' in builder.to_tytx()


def test_base_hook_echo_source_feedback_and_reset(monkeypatch):
    module = load_page()
    monkeypatch.setattr(module, 'sleep', lambda _: None)
    class ChatServer(GramlotServer):
        def resolve_page(self, path):
            return module.Page

        def resolve_page_store(self, page_class):
            return module.PageStore

        def resolve_resources(self, path, cls):
            return {"css": [], "js": []}

    server = ChatServer(collections=collections(), websocket_url='/gramlot/store', css_theme=False)
    page_id = asyncio.run(server.open_page('/', owner='alice')).page_id
    store = server.page_store(page_id, owner='alice')
    try:
        store.subscribe('chat', 'chats.main', lambda wire: None)
        def send(text, action='send'):
            store.change('chat', dict(path='request', evt='upd_value', attr={}, value=Bag(dict(
                id=uuid4().hex, action=action, text=text, attachments=Bag()))))
            assert store.data.get_item('chats.main.response.accepted') is True
        send('Hello')
        messages = store.data.get_item('chats.main.messages')
        assert [node.value for node in messages] == ['Hello', 'Hello']
        send('/source')
        reply = messages.nodes[-1].value.to_tytx()
        assert all(word in reply for word in ('order-panel', 'tabContainer', 'formlet', 'totalize', 'Confirm'))
        assert store.data.get_item('chats.main.feedback') == ''
        send(None, 'reset')
        assert len(store.data.get_item('chats.main.messages')) == 0
    finally:
        server.close_all()
