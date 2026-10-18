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
                server = GramlotFileServer(str(page.parent), collections=build_gallery()["collections"])
                opened = await server.open_page(f"/{page.stem}")
                self.assertRegex(opened.html, re.compile(r"<title>[^<]+</title>"))
                if route["logic"] is not None:
                    # Only pages declaring a companion Logic module load one.
                    self.assertIn(f'{{"url":"/{page.stem}.js","group":null}}', opened.html)
                response = await call(server, opened.page_id, "source", "main")
                self.assertNotIn("error", response)
                tree = response["value"]
                self.assertGreater(len(tree.nodes), 0)
                server.close_page(opened.page_id)

    async def test_protected_source_is_omitted_while_hidden_source_is_delivered(self):
        page = build_gallery()["routes"]["c11"]["page"]
        server = GramlotFileServer(str(page.parent), collections=build_gallery()["collections"])
        opened = await server.open_page(f"/{page.stem}")
        response = await call(server, opened.page_id, "source", "main")
        self.assertNotIn("error", response)
        wire = to_tytx(response["value"])
        self.assertNotIn("protected-source", wire)
        self.assertNotIn("Source-auth marker", wire)
        self.assertIn("hidden-source", wire)
        server.close_page(opened.page_id)

    async def test_endpoints_answer_as_their_readme_says(self):
        # The arguments are the ones the dataRpc of each page sends, author attributes and extra keys included.
        cases = {
            "w25 accepted": ("check_name", {"value": "newname"}, {"value": {"value": "NEWNAME"}}),
            "w25 rejected": ("check_name", {"value": "taken"}, {"value": {"errorcode": "reserved", "message": "That name is reserved."}}),
            "c08": ("quote", {"quantity": 2, "large": False, "gift": False, "button_counter": 1}, {"value": 2}),
            "c08 options": ("quote", {"quantity": 2, "large": True, "gift": True}, {"value": 11}),
            "c08 invalid": ("quote", {"quantity": 0, "large": True, "gift": True},
                            {"error": {"code": "application_error", "name": "ValueError", "message": "Choose at least one item"}}),
            "c08 empty": ("quote", {"quantity": None, "large": False, "gift": False},
                          {"error": {"code": "application_error", "name": "ValueError", "message": "Choose at least one item"}}),
            "c09": ("with_vat", {"price": 12.5, "rate": 22}, {"value": 15.25}),
            "c10": ("quote", {"quantity": 12}, {"value": 96}),
            "c11": ("reserve", {"item": "Lamp", "button_counter": 1},
                    {"error": {"code": "application_error", "name": "LookupError", "message": "Lamp is out of stock"}}),
            "c11 auth": ("cancel", {"item": "Lamp"},
                         {"error": {"code": "not_authenticated", "name": "NotAuthenticated",
                                    "message": "Access refused: cancel"}}),
            "c14": ("load_menu", {"table": "drinks"}, {"value": "Water, Lemonade, Coffee"}),
        }
        routes = build_gallery()["routes"]
        for case, (name, params, expected) in cases.items():
            with self.subTest(case=case):
                page = routes[case.split()[0]]["page"]
                server = GramlotFileServer(str(page.parent), collections=build_gallery()["collections"])
                opened = await server.open_page(f"/{page.stem}")
                response = await call(server, opened.page_id, "data", name, params)
                self.assertEqual({key: response[key] for key in expected}, expected)
                server.close_page(opened.page_id)

    async def test_fragments_answer_as_their_readme_says(self):
        # The parameters are the ones the remote of each page sends.
        cases = {
            "c12": ("details", {"record_id": "chair"}, ["Chair", "12 in stock"]),
            "c13": ("rules", {"category": "seating"}, ["Ships in a week, assembly required."]),
        }
        routes = build_gallery()["routes"]
        for case, (name, params, texts) in cases.items():
            with self.subTest(case=case):
                page = routes[case]["page"]
                server = GramlotFileServer(str(page.parent), collections=build_gallery()["collections"])
                opened = await server.open_page(f"/{page.stem}")
                response = await call(server, opened.page_id, "source", name, params)
                self.assertNotIn("error", response)
                self.assertEqual([node.value for node in response["value"]], texts)
                server.close_page(opened.page_id)


if __name__ == "__main__":
    unittest.main()
