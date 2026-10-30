"""Database lessons remain portable Source declarations with environment collections."""
from importlib.resources import files
from pathlib import Path

import pytest
from gramlot.collection import page_collections
from gramlot.server import GramlotFileServer
from gramlot_examples import build_gallery, navigation_directory
from gramlot_examples.gallery.collections import collections


@pytest.mark.parametrize(('name', 'key'), [('base', 'base-01')])
def test_database_page_builds_with_environment_collections(name, key):
    root = Path(str(files('gramlot_examples'))) / name
    gallery = build_gallery([(root / 'catalog.json', root / 'pages')])
    route = gallery['routes'][key]
    server = GramlotFileServer(route['page'].parent, collections=collections())
    cls = server.resolve_page(route['page'].stem)
    declared = server.page_collections(cls)
    assert not page_collections(cls)
    assert {collection.name for collection in declared} == {c.name for c in collections()}
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


def test_asqueel_state_customer_lesson_builds_only_with_explicit_catalog():
    root = Path(str(files('gramlot_examples'))) / 'base'
    common = [(root / 'catalog.json', root / 'pages')]
    assert 'base-asqueel-01' not in build_gallery(common)['routes']
    gallery = build_gallery([*common, (root / 'asqueel-catalog.json', root / 'pages')])
    route = gallery['routes']['base-asqueel-01']
    server = GramlotFileServer(route['page'].parent, collections=collections())
    cls = server.resolve_page(route['page'].stem)
    page = cls()
    builder = page.source_builder('main')
    server._load_collections(builder, server.page_collections(cls))
    page.main(builder.root)
    wire = builder.to_tytx()
    for value in ('dbSelect', 'states', 'customers', '$state=:state',
                  'condition_state', '^.state', 'weakCondition', '^.weak'):
        assert value in wire


def test_asqueel_catalog_is_reachable_from_gallery_navigation():
    root = Path(str(files('gramlot_examples'))) / 'base'
    catalogs = [(root / 'catalog.json', root / 'pages'),
                (root / 'asqueel-catalog.json', root / 'pages')]
    tree = navigation_directory(catalogs=catalogs)
    branch = next(node for node in tree.nodes if node.attr['directory'] == '81-asqueel')
    assert branch.attr['url'] == 'pages/81-asqueel/00-index'
    children = navigation_directory('81-asqueel', catalogs=catalogs)
    assert children.get_node('base-asqueel-01').attr['url'] == 'pages/81-asqueel/01-state_customers'
