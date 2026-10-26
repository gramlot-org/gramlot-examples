"""The gallery specializes the frame regions and uses ordinary Page Logic."""

import json
import unittest

from gramlot_examples.gallery.page import Page
from gramlot_examples.gallery.collections import collections

GRAMMARS = [json.loads(item.verify()[item.grammar]) for item in collections()]


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
        page.main(builder.root)
        def walk(bag):
            for node in bag.nodes:
                yield node
                if hasattr(node.value, "nodes"):
                    yield from walk(node.value)
        ids = {node.attr.get("id"): node for node in walk(builder.source)}
        self.assertNotIn("gallery-mobile-menu", ids)
        self.assertNotIn("index-navigation-toggle", ids)
        self.assertNotIn("index-code-toggle", ids)
        self.assertEqual(ids["gallery-inspector"].node_tag, "menuline")
        self.assertNotIn("gallery-view-inspector", ids)

    def test_default_urls(self):
        self.assertEqual(sources(Page()), {"img": "/assets/branding/svg/gramlot-horizontal-primary.svg", "iframe": "pages/00-index"})

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
        self.assertEqual(appearance.attr["value"], "^galleryIndex.appearance")
        self.assertEqual(color.attr["value"], "^galleryIndex.theme")
        self.assertEqual([choice.split(":")[0] for choice in appearance.attr["values"].split(",")], ["base", "compact", "mimi", "joanna", "mela"])
        self.assertEqual(controls["gallery-settings"].node_tag, "floatingPane")
        self.assertEqual(controls["gallery-settings-form"].node_tag, "formlet")
        self.assertEqual(controls["index-sidebar"].attr["drawer_display"], "none")
        self.assertEqual(controls["gallery-settings"].attr["open"], "^galleryIndex.settingsOpen")
        self.assertEqual(controls["gallery-toolbar-position"].attr["value"], "^galleryIndex.toolbarPosition")
        self.assertEqual(controls["gallery-toolbar-position"].attr["default"], "auto")
        self.assertEqual(controls["gallery-toolbar-position"].attr["values"], "auto:Automatic,left:Left,bottom:Bottom")
        self.assertNotIn("popover", controls["gallery-settings"].attr)
        self.assertNotIn("gallery-settings-toggle", controls)
        self.assertEqual(controls["gallery-label-position"].attr["value"], "^galleryIndex.labelPosition")
        self.assertEqual(controls["gallery-regions"].node_tag.lower(), "bordercontainer")
        for id_, region in (("index-sidebar", "left"),):
            self.assertEqual(controls[id_].attr["region"], region)
            self.assertTrue(controls[id_].attr["splitter"])
            self.assertTrue(controls[id_].attr["drawer"])
        self.assertNotIn("index-code", controls)
        pages = controls["index-pages"]
        self.assertEqual(pages.node_tag.lower(), "tabcontainer")
        self.assertEqual(pages.attr["selectedPage"], "^.active")
        self.assertTrue(any(n.attr.get("datapath") == "galleryIndex" for n in nodes))
        self.assertIsNone(pages.value)
        self.assertNotIn("panel-l04", controls)
        self.assertNotIn("codepane-l04", controls)
        self.assertEqual([n.attr["src"] for n in nodes if n.node_tag == "iframe"], ["pages/00-index"])
        self.assertTrue(pages.attr["hidden"])

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
            logoUrl = "/py/assets/branding/svg/gramlot-horizontal-primary.svg"

        self.assertEqual(sources(MountedPage()), {"img": "/py/assets/branding/svg/gramlot-horizontal-primary.svg", "iframe": "pages/00-index"})


    def test_icon_rail_is_a_single_framepane_toolbar(self):
        page = Page()
        builder = page.source_builder("main", collections=GRAMMARS)
        page.main(builder.root)
        def walk(bag):
            for node in bag.nodes:
                yield node
                if isinstance(node.value, type(bag)):
                    yield from walk(node.value)
        nodes = list(walk(builder.source))
        controls = {node.attr["id"]: node for node in nodes if node.attr.get("id")}
        self.assertEqual(controls["gallery-frame"].node_tag, "framePane")
        self.assertEqual(controls["gallery-rail-region"].attr["region"], "left")
        rail = controls["gallery-rail"]
        self.assertEqual(rail.node_tag, "menu")
        self.assertEqual(rail.attr["orientation"], "vertical")
        self.assertEqual([n.node_tag for n in rail.value.nodes], ["menuline", "spacer", "menuline", "menuline"])
        self.assertEqual(rail.value.nodes[1].attr["flex"], 1)
        for name in ("navigation", "settings"):
            button = controls[f"gallery-{name}-button"]
            self.assertTrue(button.attr["iconSrc"].startswith("data:image/svg+xml,"))
            self.assertFalse(button.attr["overflowable"])


if __name__ == "__main__":
    unittest.main()
