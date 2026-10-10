"""build_gallery: common families, an environment catalogue and the key rule."""

import json
import tempfile
import unittest
from pathlib import Path

from gramlot_examples import build_gallery

FIXTURE = Path(__file__).resolve().parent / "fixtures" / "environment"
PAGES = FIXTURE / "pages"


class BuildGalleryTests(unittest.TestCase):
    def catalog(self, data):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        path = Path(directory.name) / "catalog.json"
        path.write_text(json.dumps(data))
        return path

    def environment(self, families):
        return {"environment": "test", "families": families}

    def test_common_gallery(self):
        gallery = build_gallery()
        self.assertEqual([family["key"] for family in gallery["families"]], ["html_svg", "binding", "controllers"])
        self.assertEqual(len(gallery["routes"]), 36)
        self.assertEqual(gallery["routes"]["index"]["page"].name, "page.py")
        self.assertEqual(gallery["routes"]["c03"]["logic"].name, "03_named_logic.js")
        for url, asset in gallery["assets"].items():
            self.assertTrue(asset["file"].is_file(), url)

    def test_media_types(self):
        assets = build_gallery()["assets"]
        self.assertEqual(assets["/gallery/dist/gallery.js"]["type"], "application/javascript")
        self.assertEqual(assets["/pages/controllers/03_named_logic.js"]["type"], "text/plain")
        self.assertEqual(assets["/gallery/gallery.css"]["type"], "text/css")
        self.assertEqual(assets["/gallery/dist/LICENSE"]["type"], "text/plain")

    def test_environment_catalogue(self):
        gallery = build_gallery([(FIXTURE / "catalog.json", PAGES)])
        self.assertEqual(gallery["families"][-1]["key"], "test_family")
        self.assertEqual(gallery["families"][-1]["path"], PAGES / "test_family")
        route = gallery["routes"]["test-01"]
        self.assertEqual(route["page"], PAGES / "test_family" / "01_demo.py")
        self.assertEqual(route["stylesheet"], PAGES / "test_family" / "01_demo.css")
        self.assertEqual(route["logic"], PAGES / "test_family" / "01_demo.js")
        urls = sorted(url for url in gallery["assets"] if url.startswith("/pages/test_family/"))
        self.assertEqual(urls, [f"/pages/test_family/01_demo{suffix}"
                                for suffix in (".css", ".js", ".md", ".py")])

    def test_logic_companion_of_an_environment_page(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        pages = Path(directory.name)
        (pages / "aux_family").mkdir()
        for name in ("README.md", "01_page.py", "01_page.md", "01_page_aux.js"):
            (pages / "aux_family" / name).write_text("")
        family = {"key": "aux_family", "title": "X",
                  "examples": [{"key": "test-01", "title": "X", "folder": "01_page"}]}
        gallery = build_gallery([(self.catalog(self.environment([family])), pages)])
        self.assertEqual(gallery["routes"]["test-01"]["logic"], pages / "aux_family" / "01_page_aux.js")
        self.assertEqual(gallery["assets"]["/pages/aux_family/01_page_aux.js"]["type"], "text/plain")

    def test_catalogue_without_environment(self):
        with self.assertRaisesRegex(ValueError, "has no environment"):
            build_gallery([(self.catalog({"families": []}), PAGES)])

    def test_key_outside_the_environment(self):
        family = {"key": "test_family", "title": "X", "examples": [{"key": "e99", "title": "X", "folder": "01_demo"}]}
        with self.assertRaisesRegex(ValueError, "does not match test-NN"):
            build_gallery([(self.catalog(self.environment([family])), PAGES)])

    def test_duplicate_family(self):
        family = {"key": "html_svg", "title": "X", "examples": []}
        with self.assertRaisesRegex(ValueError, "Duplicate gallery keys: html_svg"):
            build_gallery([(self.catalog(self.environment([family])), PAGES)])

    def test_duplicate_example_across_catalogues(self):
        family = {"key": "other_family", "title": "X", "examples": [{"key": "test-01", "title": "X", "folder": "01_demo"}]}
        with self.assertRaisesRegex(ValueError, "Duplicate gallery keys: test-01"):
            build_gallery([(FIXTURE / "catalog.json", PAGES), (self.catalog(self.environment([family])), PAGES)])

    def test_missing_page(self):
        family = {"key": "test_family", "title": "X", "examples": [{"key": "test-02", "title": "X", "folder": "02_missing"}]}
        with self.assertRaisesRegex(FileNotFoundError, "Missing page"):
            build_gallery([(self.catalog(self.environment([family])), PAGES)])


if __name__ == "__main__":
    unittest.main()
