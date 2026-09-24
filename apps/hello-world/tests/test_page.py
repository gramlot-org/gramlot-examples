"""Verify the installed Python page through the neutral host contract."""
import unittest
from importlib.resources import files
from gramlot.server import Host
from genro_tytx import from_tytx


class HelloWorldTests(unittest.IsolatedAsyncioTestCase):
    async def test_host_returns_one_typed_heading(self):
        host = Host(files("gramlot_example_app.pages"))
        opened = await host.open_page("/")
        self.assertIn("<title>Hello World</title>", opened.html)
        tree = from_tytx(await host.main(opened.page_id))
        self.assertEqual(tree.__tytx_suffix__, "SOURCE")
        self.assertEqual(len(tree.nodes), 1)
        self.assertEqual(tree.nodes[0].node_tag, "h1")
        self.assertEqual(tree.nodes[0].value, "Hello World")
        host.close_page(opened.page_id)
