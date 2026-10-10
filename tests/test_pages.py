"""Every Python page of the package opens, links its page module and returns its Source through the core GramlotFileServer."""

import re
import unittest

from genro_tytx import from_tytx, to_tytx
from gramlot.server import GramlotFileServer

from gramlot_examples import build_gallery


async def call(server, page_id, content_type, name, params=None):
    """Send one request envelope to ``server`` and return the decoded response envelope."""
    text = to_tytx({"id": "1", "pageId": page_id, "contentType": content_type, "name": name, "params": params or {}})
    return from_tytx(await server.call(text))


class PageTests(unittest.IsolatedAsyncioTestCase):
    async def test_every_route_opens_and_returns_source(self):
        for key, route in build_gallery()["routes"].items():
            with self.subTest(key=key):
                page = route["page"]
                server = GramlotFileServer(str(page.parent))
                opened = await server.open_page(f"/{page.stem}")
                self.assertRegex(opened.html, re.compile(r"<title>[^<]+</title>"))
                if key != "index":
                    # The Python page takes its Logic from the page module beside it.
                    self.assertIn(f'{{"url":"/{page.stem}.js","group":null}}', opened.html)
                response = await call(server, opened.page_id, "source", "main")
                self.assertNotIn("error", response)
                tree = response["value"]
                self.assertGreater(len(tree.nodes), 0)
                server.close_page(opened.page_id)

    async def test_endpoints_answer_as_their_readme_says(self):
        # The arguments are the ones the dataRpc of each page sends, author attributes and extra keys included.
        cases = {
            "c09": ("with_vat", {"price": 12.5, "rate": 22}, {"value": 15.25}),
            "c10": ("quote", {"quantity": 12}, {"value": 96}),
            "c11": ("reserve", {"item": "Lamp", "button_counter": 1},
                    {"error": {"code": "application_error", "name": "LookupError", "message": "Lamp is out of stock"}}),
            "c11 auth": ("cancel", {"item": "Lamp"},
                         {"error": {"code": "not_authenticated", "name": "NotAuthenticated",
                                    "message": "Access refused: cancel"}}),
        }
        routes = build_gallery()["routes"]
        for case, (name, params, expected) in cases.items():
            with self.subTest(case=case):
                page = routes[case.split()[0]]["page"]
                server = GramlotFileServer(str(page.parent))
                opened = await server.open_page(f"/{page.stem}")
                response = await call(server, opened.page_id, "data", name, params)
                self.assertEqual({key: response[key] for key in expected}, expected)
                server.close_page(opened.page_id)


if __name__ == "__main__":
    unittest.main()
