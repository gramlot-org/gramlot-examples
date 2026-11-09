from pathlib import Path

from gramlot_examples import build_gallery


def test_documentation_gallery_is_separate_and_contains_runnable_lessons():
    root = Path(__file__).parents[1] / 'src/gramlot_examples/documentation_gallery'
    gallery = build_gallery([(root / 'catalog.json', root / 'pages')])
    assert [family['key'] for family in gallery['families']] == ['documentation-introduction']
    assert 'e01' not in gallery['routes']
    for key in ('documentation-01-name', 'documentation-02-triangle'):
        route = gallery['routes'][key]
        assert route['page'].is_file()
        assert route['url'].startswith('pages/01-introduction/')
    assert gallery['routes']['documentation-02-triangle']['stylesheet'].is_file()


def test_support_sources_are_separate_safe_and_readable():
    import pytest
    from gramlot_examples import resolve_source_files

    root = (Path(__file__).parents[1] / 'src/gramlot_examples/documentation_gallery').resolve()
    files = resolve_source_files(root, ['triangle.py', 'triangle.js'])
    assert [path.name for path in files] == ['triangle.py', 'triangle.js']
    assert 'def triangle(' in files[0].read_text()
    assert 'export function triangle(' in files[1].read_text()
    for invalid in (['../package.json'], ['/etc/passwd'], ['triangle.py', 'triangle.py'], [[]], []):
        with pytest.raises(ValueError):
            resolve_source_files(root, invalid)


def test_gallery_code_panel_includes_the_python_helper():
    import json
    from gramlot.collection import standard_collections
    from gramlot_examples.gallery.collections import collections
    from gramlot_examples.gallery.page import Page

    root = Path(__file__).parents[1] / 'src/gramlot_examples/documentation_gallery'
    class DocumentationGallery(Page):
        catalogs = [(root / 'catalog.json', root / 'pages')]

    page = DocumentationGallery()
    grammars = [json.loads(item.verify()[item.grammar]) for item in (*standard_collections(), *collections())]
    builder = page.source_builder('main', collections=grammars)
    page.code_panel(builder.root, page.gallery_item('documentation-03-many'))
    def walk(bag):
        for node in bag.nodes:
            yield node
            if hasattr(node.value, 'nodes'):
                yield from walk(node.value)
    nodes = list(walk(builder.source))
    assert any(node.attr.get('title') == 'triangle.py' for node in nodes)
    assert any(node.node_tag == 'code' and isinstance(node.value, str) and 'def triangle(' in node.value for node in nodes)
