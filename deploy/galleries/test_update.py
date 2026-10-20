import importlib.util
import json
import io
from pathlib import Path
import tempfile
import subprocess
import os
import unittest
from unittest.mock import patch
import zipfile

spec = importlib.util.spec_from_file_location('update', Path(__file__).with_name('update.py'))
u = importlib.util.module_from_spec(spec)
spec.loader.exec_module(u)

class GitHubAuthenticationTests(unittest.TestCase):
    def test_only_exact_https_github_api_receives_token(self):
        token = 'github_token_test_123'
        for url in ('https://api.github.com/repos/gramlot-org/gramlot/releases/latest',
                    'https://registry.npmjs.org/example/latest', 'https://pypi.org/pypi/gramlot/json',
                    'http://api.github.com/repos/test', 'https://api.github.com.evil.test/test'):
            authenticated = url.startswith('https://api.github.com/')
            with patch.object(u, 'urlopen') as anonymous, patch.object(u, 'build_opener') as opener:
                selected = opener.return_value.open if authenticated else anonymous
                selected.return_value.__enter__.return_value = io.StringIO('{}')
                self.assertEqual(u.read_json(url, github_token=token), {})
                request = selected.call_args.args[0]
                self.assertEqual(request.get_header('Authorization'), f'Bearer {token}' if authenticated else None)
                if authenticated:
                    anonymous.assert_not_called()
                    self.assertIsInstance(opener.call_args.args[0], u.NoGitHubRedirect)
                else:
                    opener.assert_not_called()

    def test_authenticated_redirects_are_refused(self):
        handler = u.NoGitHubRedirect()
        self.assertIsNone(handler.redirect_request(None, None, 302, '', {}, 'https://other.test/'))

    def test_direct_anonymous_mode_has_no_authorization(self):
        with patch.object(u, 'urlopen') as opening:
            opening.return_value.__enter__.return_value = io.StringIO('{}')
            u.read_json('https://api.github.com/repos/test')
            self.assertIsNone(opening.call_args.args[0].get_header('Authorization'))

    def test_token_input_is_bounded_and_never_echoed_on_error(self):
        self.assertEqual(u.read_github_token(io.StringIO('github_test_123\n')), 'github_test_123')
        self.assertEqual(u.read_github_token(io.StringIO('opaque.token-~+/=\n')), 'opaque.token-~+/=')
        for invalid in ('', 'a' * 16385, 'secret\nInjected: yes', 'a b', 'token\n\n'):
            with self.assertRaisesRegex(ValueError, '^Expected one bounded GitHub token on standard input$'):
                u.read_github_token(io.StringIO(invalid))


class UpdaterTests(unittest.TestCase):
    def snapshot(self):
        return {r: {'tag':'v1.2.3','version':'1.2.3','release_id':1} for r in u.REPOS}
    def fetch(self, url):
        if '/runs?' in url:
            return {'workflow_runs':[{'status':'completed','conclusion':'success'}]}
        if 'pypi.org' in url:
            return {'info':{'version':'1.2.3'}}
        return {'version':'1.2.3'}
    def run_with_jobs(self, status, conclusion, jobs):
        def fetch(url):
            if '/runs?' in url:
                return {'workflow_runs':[{'status':status,'conclusion':conclusion,
                                          'jobs_url':'https://api.github.com/repos/gramlot-org/x/actions/runs/1/jobs'}]}
            if '/jobs?' in url:
                return {'jobs':[{'name':name,'conclusion':result} for name, result in jobs.items()]}
            return self.fetch(url)
        return fetch
    def test_waits_for_failed_or_incomplete_publication(self):
        for status, conclusion in (('completed', 'failure'), ('completed', None), ('in_progress', None)):
            fetch = self.run_with_jobs(status, conclusion, {'build':'success', 'pypi':'failure', 'npm':'success'})
            self.assertFalse(u.ready(self.snapshot(), fetch))
    def test_optional_jsr_job_does_not_gate_the_galleries(self):
        for result in ('cancelled', 'failure'):
            fetch = self.run_with_jobs('completed', result, {'build':'success', 'pypi':'success', 'npm':'success', 'jsr':result})
            self.assertTrue(u.ready(self.snapshot(), fetch))
    def test_a_running_publication_waits_even_if_only_jsr_remains(self):
        fetch = self.run_with_jobs('in_progress', None, {'build':'success', 'npm':'success', 'jsr':None})
        self.assertFalse(u.ready(self.snapshot(), fetch))
    def test_waits_for_registry_propagation(self):
        def fetch(url):
            return {'version':'1.2.2'} if 'registry.npmjs' in url else self.fetch(url)
        self.assertFalse(u.ready(self.snapshot(), fetch))
    def test_completed_publications_ready(self):
        self.assertTrue(u.ready(self.snapshot(), self.fetch))
    def test_successful_release_checks_are_reused(self):
        def fetch(url):
            self.assertNotIn('/runs?', url)
            return self.fetch(url)
        self.assertTrue(u.ready(self.snapshot(), fetch, verified=self.snapshot()))
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
    def test_asset_validator_changes_with_generation_and_rollback(self):
        template=Path(__file__).with_name('nginx.conf').read_text()
        first=u.nginx_text(template,0,Path('/generations/first/gallery.zip'))
        second=u.nginx_text(template,1,Path('/generations/second/gallery.zip'))
        self.assertEqual(first.count('W/"first:$uri"'),2)
        self.assertEqual(second.count('W/"second:$uri"'),2)
        self.assertNotIn('__GRAMLOT_GENERATION__',first+second)
        self.assertNotIn('W/"first:',second)
        self.assertEqual(first,u.nginx_text(template,0,Path('/generations/first/gallery.zip')))

    def test_zip_is_self_contained_with_receipt(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);folder=root/'export';folder.mkdir();(folder/'index.html').write_text('test')
            digest=u.zip_gallery(folder,root/'gallery.zip',{'gramlot':'1.2.3'})
            self.assertEqual(len(digest),64)
            with zipfile.ZipFile(root/'gallery.zip') as z:
                self.assertIn('gramlot-gallery-serverless/index.html',z.namelist())
                self.assertEqual(json.loads(z.read('gramlot-gallery-serverless/versions.json')),{'gramlot':'1.2.3'})

class EventUpdateTests(unittest.TestCase):
    snapshot = UpdaterTests.snapshot

    def run_reconcile(self, ready_values, deploy_effect=None, deadline=100):
        current = {'releases': {}, 'generation': 'old'}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root/'current.json').write_text(json.dumps(current))
            with patch.object(u, 'ROOT', root), patch.object(u, 'releases', return_value=self.snapshot()), \
                    patch.object(u, 'ready', side_effect=ready_values), \
                    patch.object(u, 'deploy', side_effect=deploy_effect) as deploy, \
                    patch.object(u.time, 'monotonic', return_value=0), patch.object(u.time, 'sleep') as sleep:
                u.reconcile(deadline=deadline)
                return deploy.call_count, sleep.call_count

    def test_ssh_entry_rejects_caller_commands(self):
        entry = Path(__file__).with_name('ci-ssh-entry')
        for command in ('id', 'sh', 'scp -t /tmp/file'):
            result = subprocess.run(['sh', str(entry)], env={**os.environ, 'SSH_ORIGINAL_COMMAND': command})
            self.assertEqual(result.returncode, 126)

    def test_privileged_wrapper_rejects_arguments(self):
        result = subprocess.run(['sh', str(Path(__file__).with_name('ci-update')), '--check'])
        self.assertEqual(result.returncode, 126)

    def test_registry_propagation_is_retried_within_the_triggered_job(self):
        self.assertEqual(self.run_reconcile([False, False, True]), (1, 2))

    def test_installed_version_race_is_retried(self):
        self.assertEqual(self.run_reconcile([True, True], [u.ReleasePending('old wheel'), None]), (2, 1))

    def test_browser_or_build_failure_is_not_hidden_by_retry(self):
        with self.assertRaisesRegex(RuntimeError, 'browser failed'):
            self.run_reconcile([True], RuntimeError('browser failed'))

    def test_incomplete_publication_fails_after_the_wait_deadline(self):
        with self.assertRaisesRegex(TimeoutError, 'publication'):
            self.run_reconcile([False], deadline=0)

    def test_authenticated_fetch_reaches_build_verification(self):
        fetch = object()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root/'current.json').write_text(json.dumps({'releases': {}}))
            with patch.object(u, 'ROOT', root), patch.object(u, 'releases', return_value=self.snapshot()) as releases, \
                    patch.object(u, 'ready', return_value=True) as ready, patch.object(u, 'deploy') as deploy:
                u.reconcile(fetch=fetch)
                releases.assert_called_once_with(fetch)
                ready.assert_called_once_with(self.snapshot(), fetch, verified={})
                deploy.assert_called_once_with(self.snapshot(), {'releases': {}}, fetch=fetch)

    def test_identical_release_event_is_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root/'current.json').write_text(json.dumps({'releases': self.snapshot(), 'generation': 'current'}))
            with patch.object(u, 'ROOT', root), patch.object(u, 'releases', return_value=self.snapshot()), \
                    patch.object(u, 'deploy') as deploy, patch.object(u, 'ready') as ready:
                u.reconcile(deadline=100)
                deploy.assert_not_called()
                ready.assert_not_called()

    def test_concurrent_trigger_waits_for_the_lock_instead_of_being_lost(self):
        with tempfile.TemporaryDirectory() as directory:
            with open(Path(directory)/'lock', 'w') as first, open(Path(directory)/'lock', 'w') as second:
                self.assertTrue(u.acquire_lock(first))
                self.assertFalse(u.acquire_lock(second))
                with patch.object(u.time, 'monotonic', return_value=0), \
                        patch.object(u.time, 'sleep', side_effect=lambda _: u.fcntl.flock(first, u.fcntl.LOCK_UN)):
                    self.assertTrue(u.acquire_lock(second, deadline=100))

    def test_concurrent_trigger_has_a_bounded_wait(self):
        with tempfile.TemporaryDirectory() as directory:
            with open(Path(directory)/'lock', 'w') as first, open(Path(directory)/'lock', 'w') as second:
                self.assertTrue(u.acquire_lock(first))
                with patch.object(u.time, 'monotonic', return_value=100):
                    with self.assertRaises(TimeoutError):
                        u.acquire_lock(second, deadline=100)


if __name__=='__main__': unittest.main()
