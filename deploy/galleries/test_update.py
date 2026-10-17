import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('update', Path(__file__).with_name('update.py'))
u = importlib.util.module_from_spec(spec)
spec.loader.exec_module(u)

class UpdaterTests(unittest.TestCase):
    def snapshot(self):
        return {r: {'tag':'v1.2.3','version':'1.2.3','release_id':1} for r in u.REPOS}
    def fetch(self, url):
        if '/runs?' in url:
            return {'workflow_runs':[{'status':'completed','conclusion':'success'}]}
        if 'pypi.org' in url:
            return {'info':{'version':'1.2.3'}}
        return {'version':'1.2.3'}
    def test_waits_for_failed_or_incomplete_publication(self):
        for conclusion in ('failure', None):
            def fetch(url):
                return {'workflow_runs':[{'status':'completed','conclusion':conclusion}]} if '/runs?' in url else self.fetch(url)
            self.assertFalse(u.ready(self.snapshot(), fetch))
    def test_waits_for_registry_propagation(self):
        def fetch(url):
            return {'version':'1.2.2'} if 'registry.npmjs' in url else self.fetch(url)
        self.assertFalse(u.ready(self.snapshot(), fetch))
    def test_completed_publications_ready(self):
        self.assertTrue(u.ready(self.snapshot(), self.fetch))
    def test_excludes_prerelease(self):
        with self.assertRaises(RuntimeError):
            u.releases(lambda url: {'draft':False,'prerelease':True})
    def test_resolution_race_rejected(self):
        with self.assertRaises(RuntimeError):
            u.verify_versions({'gramlot':'1.2.4'}, self.snapshot(), {'gramlot':'gramlot'})
    def test_ports_are_private_and_slots_distinct(self):
        for slot in (0,1):
            services=json.loads(u.compose_file(slot,'py','js'))['services']
            self.assertEqual(services['python']['ports'],[f'127.0.0.1:{19182+slot*2}:8080'])
            self.assertTrue(services['node']['read_only'])
    def test_failed_promotion_restores_configuration(self):
        with tempfile.TemporaryDirectory() as d:
            config=Path(d)/'nginx.conf';config.write_text('old')
            calls=[]
            def fail(): raise RuntimeError('browser failed')
            with self.assertRaisesRegex(RuntimeError,'browser failed'):
                u.promote('new',fail,config,lambda *args: calls.append(args))
            self.assertEqual(config.read_text(),'old')
            self.assertEqual(calls.count(('systemctl','reload','nginx')),2)
    def test_invalid_nginx_configuration_rolls_back(self):
        with tempfile.TemporaryDirectory() as d:
            config=Path(d)/'nginx.conf';config.write_text('old')
            def execute(*args):
                if config.read_text()=='new': raise RuntimeError('invalid config')
            with self.assertRaises(RuntimeError):u.promote('new',lambda:None,config,execute)
            self.assertEqual(config.read_text(),'old')
    def test_success_retains_candidate(self):
        with tempfile.TemporaryDirectory() as d:
            config=Path(d)/'nginx.conf';config.write_text('old')
            u.promote('new',lambda:None,config,lambda *args:None)
            self.assertEqual(config.read_text(),'new')
    def test_both_origins_use_same_immutable_archive(self):
        template=Path(__file__).with_name('nginx.conf').read_text()
        result=u.nginx_text(template,1,Path('/opt/gramlot-galleries/generations/test/offline.zip'))
        self.assertEqual(result.count('alias /opt/gramlot-galleries/generations/test/offline.zip;'),2)
        self.assertIn('127.0.0.1:19184',result);self.assertIn('127.0.0.1:19185',result)
    def test_zip_is_self_contained_with_receipt(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);folder=root/'export';folder.mkdir();(folder/'index.html').write_text('test')
            digest=u.zip_gallery(folder,root/'gallery.zip',{'gramlot':'1.2.3'})
            self.assertEqual(len(digest),64)
            with zipfile.ZipFile(root/'gallery.zip') as z:
                self.assertIn('gramlot-gallery-serverless/index.html',z.namelist())
                self.assertEqual(json.loads(z.read('gramlot-gallery-serverless/versions.json')),{'gramlot':'1.2.3'})

if __name__=='__main__': unittest.main()
