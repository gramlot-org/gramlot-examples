"""Gallery pages use the collections supplied by their environment."""
from pathlib import Path
from gramlot.collection import page_collections, standard_collections
from gramlot.server import GramlotFileServer
from gramlot_examples.gallery.page import Page as GalleryPage
from gramlot_examples.gallery.collections import collections
from gramlot.collection import standard_collections


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
    assert {c.name for c in server.page_collections(textbox)} == {c.name for c in (*standard_collections(), *collections())}
    assert {c.name for c in page_collections(GalleryPage)} == {c.name for c in collections()}
    for source in root.rglob('*.py'):
        for collection in standard_collections():
            assert f'from gramlot.collections.{collection.name} ' not in source.read_text(), source


def test_typst_is_declared_by_its_lesson_only():
    # typst is outside the standard set (gramlot-org/gramlot#84): the page that uses it declares it.
    root = Path(__file__).parents[1] / 'src/gramlot_examples/pages'
    server = GramlotFileServer(root, collections=collections())
    assert 'typst' not in {c.name for c in server.collections}
    typst = server.resolve_page('06-editors/05-typst')
    assert [c.name for c in page_collections(typst)] == ['typst']
    assert 'typst' in {c.name for c in server.page_collections(typst)}


def test_optional_chart_and_system_examples_use_environment_collections():
    root = Path(__file__).parents[1] / 'src/gramlot_examples/base/pages'
    server = GramlotFileServer(root, collections=collections())
    for folder in ['85-chart-reports', '10-realtime']:
        for source in (root / folder).glob('*.py'):
            cls = server.resolve_page(str(source.relative_to(root).with_suffix('')))
            assert not page_collections(cls), source
            page = cls()
            page.geojson = {'type':'FeatureCollection', 'features':[]}  # Host-supplied report fixture.
            builder = page.source_builder('main')
            server._load_collections(builder, server.page_collections(cls))
            page.main(builder.root)
            assert builder.to_tytx()


def test_standard_imports_are_only_declared_in_gallery_environment():
    import ast
    root = Path(__file__).parents[1] / 'src/gramlot_examples'
    standard = {c.name for c in standard_collections()}
    for source in root.rglob('*.py'):
        if 'dist' in source.relative_to(root).parts:
            continue  # Generated collection packages are not authored pages.
        if source.relative_to(root).as_posix() in {'gallery/collections.py', 'base/selection_trial.py'}:
            continue  # Shared environment and the isolated experimental collection.
        for node in ast.walk(ast.parse(source.read_text())):
            if isinstance(node, ast.ImportFrom) and (node.module or '').startswith('gramlot.collections.'):
                # A page declares only collections outside the standard set (typst).
                assert node.module.split('.')[2] not in standard, source
