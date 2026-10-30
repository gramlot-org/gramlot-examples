"""The provisional Python menu trial bootstraps its prepared collection and resolver."""
from pathlib import Path
import unittest
from genro_tytx import from_tytx, to_tytx
from gramlot.server import GramlotFileServer
import gramlot_examples
from gramlot_examples.gallery.collections import collections


class TrialServer(GramlotFileServer):
    def collection_url(self, collection, path):
        return f'/gramlot/collections/{collection.name}/{collection.build_id[7:]}/{path}'


class MenuTrialTests(unittest.IsolatedAsyncioTestCase):
    async def test_page_source_and_lazy_bag_endpoint(self):
        folder = Path(gramlot_examples.__file__).parent / 'pages/05-menus'
        server = TrialServer(str(folder), collections=collections())
        opened = await server.open_page('/08_workspace')
        self.addCleanup(server.close_page, opened.page_id)
        self.assertIn('menu-trial', opened.html)

        async def call(kind, name, params=None):
            return from_tytx(await server.call(to_tytx(dict(id='trial', pageId=opened.page_id,
                contentType=kind, name=name, params=params or {}))))

        source = await call('source', 'main')
        self.assertNotIn('error', source)
        wire = to_tytx(source['value'])
        for value in ('framePane', 'documenti:save', 'documenti:toggleDetails', '^document.details', 'export_menu'):
            self.assertIn(value, wire)
        reply = await call('data', 'export_menu', dict(document_id=99))
        self.assertNotIn('error', reply)
        pdf = reply['value'].getNode('pdf')
        self.assertEqual(pdf.attr['command'], 'documenti:export')
        self.assertEqual(pdf.attr['parameters'], dict(id=99, format='PDF'))
        self.assertEqual(pdf.attr['disabled'], '^document.locked')
        failed = await call('data', 'export_menu', dict(document_id=99, fail=True))
        self.assertEqual(failed['error']['code'], 'application_error')

    async def test_chapter_catalogue_pages_and_nested_resolver(self):
        from gramlot_examples import build_gallery
        chapter = Path(gramlot_examples.__file__).parent / 'pages/05-menus'
        gallery = build_gallery()
        keys = [f'menu-{i:02d}' for i in range(1, 15)]
        for key in keys:
            with self.subTest(key=key):
                path = gallery['routes'][key]['page']
                server = TrialServer(str(path.parent), collections=collections())
                opened = await server.open_page('/' + path.stem)
                self.addCleanup(server.close_page, opened.page_id)
                reply = from_tytx(await server.call(to_tytx(dict(id=key, pageId=opened.page_id,
                    contentType='source', name='main', params={}))))
                self.assertNotIn('error', reply)
                wire = to_tytx(reply['value'])
                self.assertIn('frameTarget', wire)
                self.assertIn('framePane', wire)
                self.assertTrue(path.with_suffix('.md').is_file())
                self.assertTrue(path.with_suffix('.js').is_file())

        server = TrialServer(str(chapter), collections=collections())
        opened = await server.open_page('/07_resolver')
        self.addCleanup(server.close_page, opened.page_id)
        async def call(name, **params):
            return from_tytx(await server.call(to_tytx(dict(id='resolver', pageId=opened.page_id,
                contentType='data', name=name, params=params))))
        result = (await call('export_menu', document_id=7))['value']
        self.assertEqual(result.getNode('current').attr['hidden'], '^document.hidden')
        self.assertEqual(result.getNode('details').attr['checked'], '^document.details')
        self.assertEqual(result.getNode('formats').value.getNode('pdf').attr['parameters']['id'], 7)
        self.assertEqual(result.getNode('recent').attr['resolver'], 'recent_menu')
        recent = (await call('recent_menu', document_id=7))['value']
        self.assertEqual(recent.getNode('previous').attr['parameters']['id'], 6)
        self.assertEqual(len((await call('export_menu', document_id=0))['value']), 0)
