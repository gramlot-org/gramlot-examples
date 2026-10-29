"""Database lessons remain portable Source declarations with explicit collections."""
from importlib.resources import files
from pathlib import Path

import pytest
from gramlot.collection import page_collections
from gramlot.server import GramlotFileServer
from gramlot_examples import build_gallery


@pytest.mark.parametrize(('name', 'key'), [('base', 'base-01')])
def test_database_page_builds_with_its_own_collections(name, key):
    root = Path(str(files('gramlot_examples'))) / name
    gallery = build_gallery([(root / 'catalog.json', root / 'pages')])
    route = gallery['routes'][key]
    server = GramlotFileServer(route['page'].parent)
    cls = server.resolve_page(route['page'].stem)
    declared = page_collections(cls)
    assert [collection.name for collection in declared] == ['inputs']
    page = cls()
    builder = page.source_builder('main')
    server._load_collections(builder, declared)
    page.main(builder.root)
    wire = builder.to_tytx()
    assert 'dbSelect' in wire and 'dbComboBox' in wire
    assert '@state.name' in wire
    assert route['page'].is_file()
    assert all(asset['file'].is_file() for asset in gallery['assets'].values())


def test_local_candidate_excludes_application_gallery():
    root = Path(str(files('gramlot_examples')))
    assert not (root / 'application').exists()
