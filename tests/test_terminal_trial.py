"""The terminal trial: an echo session always, a local shell only with GRAMLOT_DEV (gramlot-org/gramlot#87)."""
import asyncio
import importlib.util
import json
from pathlib import Path

from gramlot import GramlotBuilder
from gramlot.collection import standard_collections
from gramlot.server import GramlotServer
import gramlot_examples
from gramlot_examples.gallery.collections import collections

TRIAL = Path(gramlot_examples.__file__).parent / 'trials/terminal'
INPUT, OUTPUT, RESIZE = 0, 1, 4


def load_page():
    spec = importlib.util.spec_from_file_location('gallery_terminal', TRIAL / 'pages/94-terminal/01-sessions.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def sessions(page):
    builder = GramlotBuilder(collections=[json.loads(c.verify()[c.grammar]) for c in (*standard_collections(), *collections())])
    page.main(builder.root)
    found = []

    def visit(bag):
        for node in bag:
            if node.node_tag == 'terminal':
                found.append(node.attr['session'])
            if hasattr(node.value, 'get_node'):
                visit(node.value)
    visit(builder.source)
    return found


class Output:
    def __init__(self):
        self.data = b''

    async def __call__(self, frame):
        assert frame[0] == OUTPUT
        self.data += frame[1:]


async def open_session(module, name):
    class TerminalServer(GramlotServer):
        def resolve_page(self, path):
            return module.Page

        def resolve_page_store(self, page_class):
            return module.PageStore

        def resolve_resources(self, path, cls):
            return {"css": [], "js": []}

    server = TerminalServer(collections=collections(), websocket_url='/gramlot/store', css_theme=False)
    page_id = (await server.open_page('/', owner='alice')).page_id
    output = Output()
    session = await server.open_terminal(page_id, name, send=output, owner='alice')
    return server, session, output


async def wait_for(output, text, timeout=5):
    async def until():
        while text not in output.data:
            await asyncio.sleep(0.02)
    await asyncio.wait_for(until(), timeout)


def test_terminal_catalogue_is_an_ordinary_gallery_family():
    gallery = gramlot_examples.build_gallery([(TRIAL / 'catalog.json', TRIAL / 'pages')])
    route = gallery['routes']['terminal-01']
    assert route['url'] == 'pages/94-terminal/01-sessions'
    assert route['page'].is_file() and route['page'].with_suffix('.md').is_file()


def test_without_gramlot_dev_the_page_offers_only_echo_and_the_shell_refuses(monkeypatch):
    monkeypatch.delenv('GRAMLOT_DEV', raising=False)
    module = load_page()
    assert sessions(module.Page()) == ['echo']

    async def run():
        server, session, output = await open_session(module, 'shell')
        await asyncio.wait_for(session.wait_closed(), 2)
        assert b'only on a development server' in output.data
        server.close_all()
    asyncio.run(run())


def test_echo_returns_the_keys_with_enter_as_a_new_line(monkeypatch):
    monkeypatch.delenv('GRAMLOT_DEV', raising=False)

    async def run():
        server, session, output = await open_session(load_page(), 'echo')
        await wait_for(output, b'press Enter.\r\n')
        session.receive(bytes([INPUT]) + b'hi\r')
        await wait_for(output, b'hi\r\n')
        server.close_all()
    asyncio.run(run())


def test_with_gramlot_dev_the_shell_runs_commands_at_the_browser_size(monkeypatch):
    monkeypatch.setenv('GRAMLOT_DEV', 'YES')
    module = load_page()
    assert sessions(module.Page()) == ['echo', 'shell']

    async def run():
        server, session, output = await open_session(module, 'shell')
        session.receive(bytes([RESIZE]) + json.dumps({"Width": 97, "Height": 31}).encode())
        await asyncio.sleep(0.2)
        session.receive(bytes([INPUT]) + b'stty size; echo END-$((40+2))\r')
        await wait_for(output, b'END-42')
        assert b'31 97' in output.data
        server.close_all()
        await asyncio.sleep(0.1)
    asyncio.run(run())
