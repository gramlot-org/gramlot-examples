"""Every Python page of the package opens, links its page module and returns its Source through the core FileHost."""

import re
import unittest

from genro_tytx import from_tytx
from gramlot.server import FileHost

from gramlot_examples import build_gallery


class PageTests(unittest.IsolatedAsyncioTestCase):
    async def test_every_route_opens_and_returns_source(self):
        for key, route in build_gallery()["routes"].items():
            with self.subTest(key=key):
                page = route["page"]
                host = FileHost(str(page.parent))
                opened = await host.open_page(f"/{page.stem}")
                self.assertRegex(opened.html, re.compile(r"<title>[^<]+</title>"))
                if key != "index":
                    # The Python page takes its Logic from the page module beside it.
                    self.assertIn(f'{{"url":"/{page.stem}.js","group":null}}', opened.html)
                tree = from_tytx(await host.main(opened.page_id))
                self.assertGreater(len(tree.nodes), 0)
                host.close_page(opened.page_id)


if __name__ == "__main__":
    unittest.main()
