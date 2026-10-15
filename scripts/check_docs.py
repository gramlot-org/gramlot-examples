"""Check public lesson coverage, local HTML links and paired guide anchors."""
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

from prepare_docs import ROOT, GUIDES


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for attr in ('href', 'src'):
            if attrs.get(attr):
                self.links.append(attrs[attr])


def main():
    site = ROOT / 'build/docs-site'
    catalog = json.loads((ROOT / 'src/gramlot_examples/catalog.json').read_text())
    expected = {'index.html', 'lessons/index.html', 'search.html', 'genindex.html',
                *(str(Path(p).with_suffix('.html')) for p in GUIDES)}
    count = 0
    for family in catalog['families']:
        prefix = f"lessons/{family['key']}"
        expected.add(f'{prefix}/index.html')
        for example in family['examples']:
            expected.add(f"{prefix}/{example['folder']}.html")
            count += 1
    playground = {'inspector/index.html', 'inspector/b01/index.html'}
    actual = {str(p.relative_to(site)) for p in site.rglob('*.html')}
    assert actual == expected | playground, f'Public page coverage differs: {actual ^ (expected | playground)}'
    parsed = {}
    for relative in actual:
        p = site / relative
        links = Links()
        links.feed(p.read_text())
        parsed[p.resolve()] = links
    for p, links in parsed.items():
        for href in links.links:
            url = urlsplit(href)
            if url.scheme or url.netloc:
                continue
            target = (p.parent / unquote(url.path)).resolve() if url.path else p
            assert target.is_relative_to(site.resolve()), f'Outside site: {p}: {href}'
            assert target.is_file(), f'Missing target: {p}: {href}'
            if url.fragment and target in parsed:
                assert unquote(url.fragment) in parsed[target].ids, f'Missing anchor: {p}: {href}'
    for path in GUIDES:
        p = Path(path)
        full = (ROOT / p).read_text()
        brief = (ROOT / 'docs_llm' / p.name).read_text()
        identity = r'Document ID: (?:\*\*)?(GE-\d+)'
        anchors = r'<a id="([^"]+)"'
        assert re.findall(identity, full) == re.findall(identity, brief), path
        assert re.findall(anchors, full) == re.findall(anchors, brief), path
    search = (site / 'searchindex.js').read_text()
    index = json.loads(search.removeprefix('Search.setIndex(').removesuffix(')'))
    assert set(index['docnames']) == {p[:-5] for p in expected - {'search.html', 'genindex.html'}}, 'Search scope differs'
    print(f'Validated {count} lessons, {len(GUIDES)} paired guides, search scope and all local links/anchors.')


if __name__ == '__main__':
    main()
