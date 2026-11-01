"""Topic catalogue and section reads over explicitly selected local manuals."""
import hashlib
import json
import re
from pathlib import Path


class DocumentationIndex:
    def __init__(self, core_root, examples_root):
        self.manifest = json.loads(Path(__file__).with_suffix('.json').read_text())
        roots = {'gramlot': Path(core_root).resolve(), 'gramlot-examples': Path(examples_root).resolve()}
        self.documents = {}
        for entry in self.manifest['documents']:
            root = roots[entry['repository']]
            path = (root / entry['path']).resolve()
            if not path.is_relative_to(root):
                raise ValueError('Documentation must stay within its configured root')
            content = path.read_text(encoding='utf-8')
            sections = self._sections(content)
            self.documents[entry['id']] = dict(entry, sections=sections,
                digest=hashlib.sha256(content.encode()).hexdigest())
        for topic in self.manifest['topics']:
            for document in topic['documents']:
                if document not in self.documents:
                    raise ValueError('Unknown document in topic index')

    @staticmethod
    def _sections(content):
        # Headings inside fenced examples are code, not sections of the manual.
        sections = []
        fence = None
        pending_anchors = []
        current = None
        for line in content.splitlines(keepends=True):
            marker = re.match(r'^ {0,3}(`{3,}|~{3,})', line)
            heading = None
            if fence is None:
                anchor = re.match(r'^\s*<a id="([^"]+)"></a>\s*$', line)
                if anchor:
                    pending_anchors.append(anchor.group(1))
                    continue
                if marker:
                    fence = marker.group(1)
                else:
                    heading = re.match(r'^(#{1,6}) (.+?)\s*$', line)
            elif marker and marker.group(1)[0] == fence[0] and len(marker.group(1)) >= len(fence):
                fence = None
            if heading:
                current = dict(section=heading.group(2), level=len(heading.group(1)),
                               anchors=pending_anchors, text=line)
                sections.append(current)
                pending_anchors = []
            elif current is not None:
                current['text'] += line
                if line.strip():
                    pending_anchors = []
        if not sections or len({s['section'] for s in sections}) != len(sections):
            raise ValueError('Documentation requires distinct section headings')
        return sections

    def index(self):
        return dict(topics=self.manifest['topics'], documents=[
            {k:v for k,v in doc.items() if k != 'sections'} for doc in self.documents.values()])

    def read(self, document, section=None):
        if document not in self.documents:
            raise ValueError('Choose a document ID from the topic index')
        doc = self.documents[document]
        result = {k:v for k,v in doc.items() if k != 'sections'}
        if section is None:
            result['sections'] = [{k:v for k,v in s.items() if k != 'text'} for s in doc['sections']]
            return result
        for item in doc['sections']:
            if item['section'] == section:
                # Return the full chosen section, without unrelated sibling or child sections.
                return dict(result, **item)
        raise ValueError('Choose an exact section heading from this document index')
