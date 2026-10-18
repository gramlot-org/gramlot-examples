"""The Python gallery page: the URLs of the logo and of the gallery script are class attributes."""

import unittest

from gramlot_examples.gallery.page import Page
from gramlot_examples.gallery.collections import collections

GRAMMARS = [item["grammar"] for item in collections()]


def sources(page):
    """Build ``main`` as the server does and return the ``src`` of each Source node by tag."""
    builder = page.source_builder("main", collections=GRAMMARS)
    page.main(builder.root)

    def walk(bag):
        for node in bag.nodes:
            yield node
            if hasattr(node.value, "nodes"):
                yield from walk(node.value)

    return {node.node_tag: node.attr["src"] for node in walk(builder.source) if node.attr.get("src")}


class GalleryPageTests(unittest.TestCase):
    def test_footer_omits_serverless_download(self):
        for url in (None, "/downloads/gallery.zip"):
            page = Page()
            page.serverless_download_url = url
            builder = page.source_builder("main", collections=GRAMMARS)
            page.footer(builder.root)
            links = [node for node in builder.source.nodes if node.node_tag == "a"]
            self.assertEqual(links, [])

    def test_mobile_controls_are_source_authored(self):
        page = Page()
        builder = page.source_builder("main", collections=GRAMMARS)
        page.header(builder.root)
        def walk(bag):
            for node in bag.nodes:
                yield node
                if hasattr(node.value, "nodes"):
                    yield from walk(node.value)
        ids = {node.attr.get("id"): node for node in walk(builder.source)}
        for view in ("example", "code", "inspector"):
            node = ids[f"gallery-view-{view}"]
            self.assertEqual(node.node_tag, "html_button")
            self.assertEqual(node.attr["aria_pressed"], "true" if view == "example" else "false")
        self.assertEqual(ids["gallery-mobile-menu"].attr["aria_controls"], "index-sidebar")

    def test_default_urls(self):
        self.assertEqual(sources(Page()), {"img": "/assets/branding/gramlot-logo-dark.svg",
                                           "script": "/gallery/dist/gallery.js"})

    def test_theme_choices_and_sidebar_separator(self):
        page = Page()
        builder = page.source_builder("main", collections=GRAMMARS)
        page.main(builder.root)

        def walk(bag):
            for node in bag.nodes:
                yield node
                if hasattr(node.value, "nodes"):
                    yield from walk(node.value)

        nodes = list(walk(builder.source))
        controls = {node.attr["id"]: node for node in nodes if node.attr.get("id")}
        appearance = controls["index-appearance"]
        color = controls["index-theme"]
        self.assertLess(nodes.index(appearance), nodes.index(color))
        self.assertEqual(appearance.attr["value"], "compact")
        self.assertEqual(color.attr["value"], "light")
        self.assertEqual([node.attr["value"] for node in appearance.value.nodes], ["base", "compact", "mimi", "joanna"])
        self.assertEqual(controls["gallery-settings"].attr["popover"], "auto")
        self.assertEqual(controls["gallery-settings-toggle"].attr["popovertarget"], "gallery-settings")
        self.assertEqual(controls["gallery-label-position"].attr["value"], "example")
        self.assertEqual(controls["gallery-regions"].node_tag.lower(), "bordercontainer")
        for id_, region in (("index-sidebar", "left"), ("index-code", "right")):
            self.assertEqual(controls[id_].attr["region"], region)
            self.assertTrue(controls[id_].attr["splitter"])
            self.assertTrue(controls[id_].attr["drawer"])
        pages = controls["index-pages"]
        self.assertEqual(pages.node_tag.lower(), "tabcontainer")
        self.assertEqual(pages.attr["selectedPage"], "^galleryIndex.active")
        self.assertEqual([n.attr.get("id") for n in pages.value.nodes], ["panel-intro"])
        self.assertNotIn("panel-l04", controls)
        self.assertNotIn("codepane-l04", controls)
        self.assertFalse(any(n.node_tag == "iframe" for n in nodes))

    def test_lesson_builds_only_selected_content(self):
        page = Page()
        for view, expected in (("example", "frame-l04"), ("code", "code-l04"), ("description", "readme-l04")):
            builder = page.source_builder("lesson", collections=GRAMMARS)
            page.lesson(builder.root, "l04", view)
            def walk(bag):
                for node in bag.nodes:
                    yield node
                    if hasattr(node.value, "nodes"):
                        yield from walk(node.value)
            ids = {n.attr.get("id") for n in walk(builder.source)}
            self.assertIn(expected, ids)
            self.assertNotIn("frame-w01", ids)
            if view == "example":
                self.assertNotIn("readme-l04", ids)
                self.assertNotIn("code-l04", ids)
                self.assertIn("description-l04", ids)
        with self.assertRaises(ValueError):
            page.lesson(builder.root, "../unknown")
        with self.assertRaises(ValueError):
            page.lesson(builder.root, "l04", "unknown")

    def test_subclass_sets_the_urls(self):
        class MountedPage(Page):
            logoUrl = "/py/assets/branding/gramlot-logo-dark.svg"
            galleryScript = "/py/gallery/dist/gallery.js"

        self.assertEqual(sources(MountedPage()), {"img": "/py/assets/branding/gramlot-logo-dark.svg",
                                                  "script": "/py/gallery/dist/gallery.js"})


if __name__ == "__main__":
    unittest.main()
