"""Feature links are authored from the host's available catalogue."""
import json

from gramlot_examples.gallery.collections import collections
from gramlot_examples.gallery.features import feature_index
from gramlot_examples.gallery.page import Page


def walk(bag):
    for node in bag.nodes:
        yield node
        if hasattr(node.value, 'nodes'):
            yield from walk(node.value)


def test_feature_index_declares_optional_links_in_page_data():
    page = Page()
    builder = page.source_builder('main', collections=[
        json.loads(item.verify()[item.grammar]) for item in collections()])
    feature_index(builder.root, {'asqueel-only-01': {
        'family': 'cached_selection', 'url': 'pages/84-cached-selection/01-invoice_rows',
        'title': 'Cached rows'}})
    nodes = list(walk(builder.source))
    links = next(node.attr['value'] for node in nodes
                 if node.attr.get('destination_path') == 'galleryIndex.featureExamples')
    assert links.get_node('asqueel-only-01').attr == {
        'family': 'cached_selection', 'url': 'pages/84-cached-selection/01-invoice_rows'}
    assert links.get_node('grid-01') is None
    card = next(node for node in nodes
                if node.attr.get('id') == 'feature-behavior_grid_cached_fetch')
    assert any(node.node_tag == 'button' and node.value == 'Cached rows'
               for node in walk(card.value))
    unavailable = next(node for node in nodes
                       if node.attr.get('id') == 'feature-behavior_grid_jsonl')
    assert any(node.value == 'Not available in this gallery environment'
               for node in walk(unavailable.value))
    assert not any(node.node_tag == 'button' for node in walk(unavailable.value))
