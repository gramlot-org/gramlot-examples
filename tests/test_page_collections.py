"""Gallery pages use the collections supplied by their environment."""
from pathlib import Path
from gramlot.collection import page_collections
from gramlot.server import GramlotFileServer
from gramlot_examples.gallery.page import Page as GalleryPage
from gramlot_examples.gallery.collections import collections


def test_all_pages_build_with_environment_collections():
    root = Path(__file__).parents[1] / 'src/gramlot_examples/pages'
    server = GramlotFileServer(root, collections=collections())
    for cls in server.iter_page_classes():
        page = cls()
        builder = page.source_builder('main')
        server._load_collections(builder, server.page_collections(cls))
        page.main(builder.root)
        assert builder.to_tytx()


def test_examples_do_not_repeat_environment_collection_imports():
    root = Path(__file__).parents[1] / 'src/gramlot_examples/pages'
    server = GramlotFileServer(root, collections=collections())
    textbox = server.resolve_page('01-inputs/01-text/01-textbox')
    assert not page_collections(textbox)
    assert {c.name for c in server.page_collections(textbox)} == {c.name for c in collections()}
    assert {c.name for c in page_collections(GalleryPage)} == {c.name for c in collections()}
    for source in root.rglob('*.py'):
        assert 'from gramlot.collections.' not in source.read_text(), source
