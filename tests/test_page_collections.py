"""Every gallery page builds with its own declared collection dependencies."""
from pathlib import Path
from gramlot.collection import page_collections
from gramlot.server import GramlotFileServer
from gramlot_examples.gallery.page import Page as GalleryPage


def test_all_pages_build_without_server_wide_collections():
    root = Path(__file__).parents[1] / 'src/gramlot_examples/pages'
    server = GramlotFileServer(root)
    for cls in server.iter_page_classes():
        page = cls()
        builder = page.source_builder('main')
        server._load_collections(builder, page_collections(cls))
        page.main(builder.root)
        assert builder.to_tytx()


def test_heavy_collections_are_not_activated_by_basic_pages():
    root = Path(__file__).parents[1] / 'src/gramlot_examples/pages'
    server = GramlotFileServer(root)
    assert [c.name for c in page_collections(server.resolve_page('01-inputs/01-text/01-textbox'))] == ['inputs', 'layout']
    assert not page_collections(server.resolve_page('00-index'))
    assert 'typst' not in {c.name for c in page_collections(GalleryPage)}
