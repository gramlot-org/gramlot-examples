"""The Python gallery page: the URLs of the logo and of the gallery script are class attributes."""

import unittest

from gramlot_examples.gallery.page import Page


def sources(page):
    """Build ``main`` as the server does and return the ``src`` of each Source node by tag."""
    builder = page.source_builder("main")
    page.main(builder.root)

    def walk(bag):
        for node in bag.nodes:
            yield node
            if hasattr(node.value, "nodes"):
                yield from walk(node.value)

    return {node.node_tag: node.attr["src"] for node in walk(builder.source) if node.attr.get("src")}


class GalleryPageTests(unittest.TestCase):
    def test_optional_serverless_download(self):
        for url in (None, "/downloads/gallery.zip"):
            page = Page()
            page.serverless_download_url = url
            builder = page.source_builder("main")
            page.footer(builder.root)
            links = [node for node in builder.source.nodes if node.node_tag == "a"]
            self.assertEqual(len(links), int(url is not None))
            if url:
                self.assertEqual(links[0].attr["href"], url)
                self.assertEqual(links[0].attr["download"], "gramlot-gallery-serverless.zip")

    def test_default_urls(self):
        self.assertEqual(sources(Page()), {"img": "/assets/branding/gramlot-logo-dark.svg",
                                           "script": "/gallery/dist/gallery.js"})

    def test_theme_choices_and_sidebar_separator(self):
        page = Page()
        builder = page.source_builder("main")
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
        divider = controls["index-sidebar-divider"]
        self.assertEqual(divider.attr["role"], "separator")
        self.assertEqual(divider.attr["aria_controls"], "index-sidebar")
        self.assertEqual(divider.attr["tabindex"], 0)

    def test_subclass_sets_the_urls(self):
        class MountedPage(Page):
            logoUrl = "/py/assets/branding/gramlot-logo-dark.svg"
            galleryScript = "/py/gallery/dist/gallery.js"

        self.assertEqual(sources(MountedPage()), {"img": "/py/assets/branding/gramlot-logo-dark.svg",
                                                  "script": "/py/gallery/dist/gallery.js"})


if __name__ == "__main__":
    unittest.main()
