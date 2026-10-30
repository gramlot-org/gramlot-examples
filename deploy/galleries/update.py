#!/usr/bin/env python3
"""Deploy successful public Gramlot releases as one tested gallery generation."""
import argparse
import fcntl
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import signal
import sys
from functools import partial
import time
from urllib.parse import quote, urlsplit
from urllib.request import Request, urlopen, build_opener, HTTPRedirectHandler
import zipfile

ROOT = Path('/opt/gramlot-galleries')
CONFIG = Path('/etc/nginx/sites-available/gramlot-galleries.conf')
REPOS = ('gramlot', 'gramlot-examples', 'gramlot-js-server', 'gramlot-py-server')
NPM = {'@gramlot/gramlot': 'gramlot', '@gramlot/gramlot-examples': 'gramlot-examples',
       '@gramlot/gramlot-js-server': 'gramlot-js-server', '@gramlot/gramlot-serverless': 'gramlot-js-server'}
PYPI = {'gramlot': 'gramlot', 'gramlot-examples': 'gramlot-examples', 'gramlot-py-server': 'gramlot-py-server'}
DOWNLOAD = '/downloads/gramlot-gallery-serverless.zip'
RETRY_INTERVAL = 30
# Publication jobs that do not gate the galleries: JSR is optional, npm is required.
OPTIONAL_JOBS = {'jsr'}


class ReleasePending(RuntimeError):
    """Published metadata and installed packages have not converged yet."""


class NoGitHubRedirect(HTTPRedirectHandler):
    """Never forward the ephemeral authorization header through a redirect."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def read_github_token(stream):
    token = stream.read(16385).removesuffix('\n')
    if not token or len(token) > 16384 or any(
            c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~+/=' for c in token):
        raise ValueError('Expected one bounded GitHub token on standard input')
    return token


def read_json(url, *, github_token=None):
    headers = {'User-Agent': 'gramlot-gallery-release-updater', 'Accept': 'application/json'}
    parsed = urlsplit(url)
    authenticated = github_token and (parsed.scheme, parsed.netloc) == ('https', 'api.github.com')
    if authenticated:
        headers['Authorization'] = f'Bearer {github_token}'
    request = Request(url, headers=headers)
    open_request = build_opener(NoGitHubRedirect()).open if authenticated else urlopen
    with open_request(request, timeout=30) as response:
        return json.load(response)


def releases(fetch=read_json):
    result = {}
    for repo in REPOS:
        release = fetch(f'https://api.github.com/repos/gramlot-org/{repo}/releases/latest')
        if release['draft'] or release['prerelease']:
            raise RuntimeError(f'{repo}: latest release is not stable')
        tag = release['tag_name']
        if not tag.startswith('v') or not all(c in '0123456789.' for c in tag[1:]):
            raise RuntimeError(f'{repo}: unsupported version tag {tag!r}')
        result[repo] = {'tag': tag, 'version': tag[1:], 'release_id': release['id']}
    return result


def published(run, fetch=read_json):
    if run['status'] != 'completed':
        return False
    if run['conclusion'] == 'success':
        return True
    jobs = [job for job in fetch(f"{run['jobs_url']}?per_page=100")['jobs'] if job['name'] not in OPTIONAL_JOBS]
    return bool(jobs) and all(job['conclusion'] == 'success' for job in jobs)


def ready(snapshot, fetch=read_json, verified=None):
    for repo, release in snapshot.items():
        if verified and verified.get(repo) == release:
            continue
        runs = fetch(f'https://api.github.com/repos/gramlot-org/{repo}/actions/workflows/publish.yml/runs?branch={quote(release["tag"])}&event=workflow_dispatch&per_page=1')['workflow_runs']
        if not runs or not published(runs[0], fetch):
            return False
    for package, repo in NPM.items():
        if fetch(f'https://registry.npmjs.org/{quote(package, safe="")}/latest')['version'] != snapshot[repo]['version']:
            return False
    for package, repo in PYPI.items():
        if fetch(f'https://pypi.org/pypi/{package}/json')['info']['version'] != snapshot[repo]['version']:
            return False
    return True


def run(*args, capture=False):
    print('+', ' '.join(map(str, args)), flush=True)
    return subprocess.run(list(map(str, args)), check=True, text=True, stdout=subprocess.PIPE if capture else None).stdout


def atomic(path, content):
    temporary = path.with_suffix(path.suffix + '.new')
    temporary.write_text(content)
    os.replace(temporary, path)


def compose_file(slot, py_image, js_image):
    services = {}
    for i, (name, image) in enumerate((('python', py_image), ('node', js_image))):
        services[name] = {'image': image, 'ports': [f'127.0.0.1:{19182 + slot * 2 + i}:8080'],
            'read_only': True, 'tmpfs': ['/tmp:rw,noexec,nosuid,size=64m'], 'cap_drop': ['ALL'],
            'security_opt': ['no-new-privileges:true'], 'mem_limit': '512m', 'cpus': 1,
            'restart': 'unless-stopped', 'logging': {'driver': 'json-file', 'options': {'max-size':'10m','max-file':'3'}}}
    services['python'].update({
        'networks': ['default', 'database'],
        'environment': {'PGHOST': 'gramlot-demo-db', 'PGUSER': 'gramlot_gallery',
                        'PGPASSFILE': '/run/secrets/postgres.pgpass'},
        'volumes': [f'{ROOT}/secrets/postgres.pgpass:/run/secrets/postgres.pgpass:ro'],
    })
    return json.dumps({'name': f'gramlot-galleries-{slot}', 'services': services,
        'networks': {'default': {}, 'database': {'external': True, 'name': 'gramlot-demo-db'}}}, indent=2)


def nginx_text(template, slot, archive):
    # The same atomic configuration selects upstreams, ZIP and asset validators.
    return template.replace('__GRAMLOT_GENERATION__', archive.parent.name).replace('127.0.0.1:19182', f'127.0.0.1:{19182 + slot * 2}').replace('127.0.0.1:19183', f'127.0.0.1:{19183 + slot * 2}').replace('/opt/gramlot-galleries/downloads/gramlot-gallery-serverless.zip', str(archive))


def promote(candidate, check, config=CONFIG, execute=run):
    previous = config.read_text()
    try:
        atomic(config, candidate)
        execute('nginx', '-t')
        execute('systemctl', 'reload', 'nginx')
        check()
    except BaseException:
        atomic(config, previous)
        execute('nginx', '-t')
        execute('systemctl', 'reload', 'nginx')
        raise


def zip_gallery(folder, archive, versions):
    (folder / 'README.txt').write_text('Gramlot serverless gallery\n\nExtract the entire ZIP and open index.html. No Python, Node.js or server is required.\nPage execution and endpoints use JavaScript Workers.\n')
    (folder / 'versions.json').write_text(json.dumps(versions, indent=2) + '\n')
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:
        for file in sorted(folder.rglob('*')):
            if file.is_file():
                output.write(file, Path('gramlot-gallery-serverless') / file.relative_to(folder))
    with zipfile.ZipFile(archive) as output:
        if output.testzip() is not None:
            raise RuntimeError('Corrupt offline archive')
    return hashlib.sha256(archive.read_bytes()).hexdigest()


def verify_versions(actual, expected, packages):
    for package, repo in packages.items():
        if actual[package] != expected[repo]['version']:
            raise ReleasePending(f'{package}: resolved {actual[package]} instead of released {expected[repo]["version"]}')


def deploy(snapshot, current, *, fetch=read_json):
    slot = 1 - current.get('slot', 0)
    generation = time.strftime('%Y%m%dT%H%M%SZ', time.gmtime())
    target = ROOT / 'generations' / generation
    target.mkdir(parents=True)
    py_image, js_image = [f'gramlot-gallery-{kind}:{generation}' for kind in ('python', 'node')]
    compose = target / 'compose.json'
    compose.write_text(compose_file(slot, py_image, js_image))
    started = False
    promoted = False
    try:
        for kind, image in [('python', py_image), ('node', js_image)]:
            run('docker', 'buildx', 'build', '--builder', 'gramlot-galleries', '--load', '--pull', '--no-cache', '-f', ROOT / 'automation' / f'Dockerfile.{kind}', '-t', image, ROOT / 'automation')
        py_versions = json.loads(run('docker', 'run', '--rm', py_image, 'python', '-c', 'import json,importlib.metadata as m; print(json.dumps({p:m.version(p) for p in '+repr(list(PYPI))+'}))', capture=True))
        js_versions = json.loads(run('docker', 'run', '--rm', js_image, 'node', '-e', 'console.log(JSON.stringify(Object.fromEntries('+json.dumps(list(NPM))+'.map(p=>[p,require("./node_modules/"+p+"/package.json").version]))))', capture=True))
        verify_versions(py_versions, snapshot, PYPI)
        verify_versions(js_versions, snapshot, NPM)
        # Fail safely if a registry changes while images are being built.
        offline = target / 'offline'
        offline.mkdir(mode=0o777)
        offline.chmod(0o777)
        run('docker', 'run', '--rm', '-v', f'{offline}:/output', js_image,
            './node_modules/.bin/gramlot-serverless', 'gallery', '/output/gallery')
        archive = target / 'gramlot-gallery-serverless.zip'
        digest = zip_gallery(offline / 'gallery', archive, {'python': py_versions, 'javascript': js_versions})
        # Only this project's inactive generation may be replaced.
        started = True
        run('docker', 'run', '--rm', py_image, 'python', '/app/verify-public-proxy.py')
        run('docker', 'compose', '-f', compose, 'run', '--rm', '--no-deps', 'python', 'python', '/app/verify-public-database.py')
        run('docker', 'compose', '-f', compose, 'up', '-d', '--wait', '--wait-timeout', '120')
        run('docker', 'run', '--rm', '--network', 'host', '--shm-size=256m', '-v', f'{offline}:/offline:ro',
            'gramlot-gallery-check:current', 'node', 'smoke.mjs',
            f'http://127.0.0.1:{19182+slot*2}', f'http://127.0.0.1:{19183+slot*2}', 'file:///offline/gallery')
        run('docker', 'run', '--rm', '--network', 'host', '--shm-size=256m',
            'gramlot-gallery-check:current', 'node', 'asqueel-smoke.mjs', f'http://127.0.0.1:{19182+slot*2}')
        if releases(fetch) != snapshot or not ready(snapshot, fetch, verified=snapshot):
            raise ReleasePending('Release set changed during build; retry after publication completes')
        def public_check():
            run('docker', 'run', '--rm', '--network', 'host', '--shm-size=256m', 'gramlot-gallery-check:current',
                'node', 'smoke.mjs', 'https://gallery-py.gramlot.dev', 'https://gallery-js.gramlot.dev')
            run('docker', 'run', '--rm', '--network', 'host', '--shm-size=256m',
                'gramlot-gallery-check:current', 'node', 'asqueel-smoke.mjs', 'https://gallery-py.gramlot.dev')
            for host in ('gallery-py', 'gallery-js'):
                with urlopen(f'https://{host}.gramlot.dev{DOWNLOAD}', timeout=90) as response:
                    if hashlib.sha256(response.read()).hexdigest() != digest:
                        raise RuntimeError(f'{host}: download hash differs')
        receipt = {'releases': snapshot, 'slot': slot, 'generation': generation, 'compose': str(compose),
                   'images': [py_image, js_image], 'archive_sha256': digest, 'previous': current.get('generation')}
        (target/'receipt.json').write_text(json.dumps(receipt, indent=2)+'\n')
        def commit_checked():
            public_check()
            atomic(ROOT / 'current.json', json.dumps(receipt, indent=2) + '\n')
        promote(nginx_text((ROOT/'automation/nginx.conf').read_text(), slot, archive), commit_checked)
        promoted = True
        # Keep the preceding generation available for explicit rollback.
        run('docker', 'compose', '-f', current['compose'], 'stop')
        for old in (ROOT/'generations').iterdir():
            if old.name not in (generation, current.get('generation')):
                old_receipt = old/'receipt.json'
                if old_receipt.exists():
                    for image in json.loads(old_receipt.read_text())['images']:
                        subprocess.run(['docker', 'image', 'rm', image], check=False)
                shutil.rmtree(old)
        print(f'Deployed {generation}: {digest}', flush=True)
    finally:
        if not promoted:
            if started:
                run('docker', 'compose', '-f', compose, 'down')
            for image in (py_image, js_image):
                subprocess.run(['docker', 'image', 'rm', image], check=False)
            shutil.rmtree(target)
        subprocess.run(['docker', 'buildx', 'prune', '--builder', 'gramlot-galleries', '--force', '--max-used-space', '1gb'], check=False)


def interrupted(signum, frame):
    raise InterruptedError(f'Deployment interrupted by signal {signum}')


def pause_until_retry(deadline, reason):
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        raise TimeoutError(reason)
    print(reason, flush=True)
    time.sleep(min(RETRY_INTERVAL, remaining))


def acquire_lock(lock, deadline=None):
    while True:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            return True
        except BlockingIOError:
            if deadline is None:
                print('Another update is running', flush=True)
                return False
            pause_until_retry(deadline, 'Waiting for the preceding gallery update')


def reconcile(*, check=False, deadline=None, fetch=read_json):
    while True:
        current = json.loads((ROOT/'current.json').read_text())
        snapshot = releases(fetch)
        if snapshot == current.get('releases'):
            print(f"Published releases unchanged: {current.get('generation')}", flush=True)
            return
        if ready(snapshot, fetch, verified=current.get('releases')):
            if check:
                print(json.dumps(snapshot, indent=2))
                return
            try:
                deploy(snapshot, current, fetch=fetch)
                return
            except ReleasePending as error:
                if deadline is None:
                    raise
                reason = str(error)
        else:
            reason = 'Waiting for all publication workflows and registries'
            if deadline is None:
                print(reason, flush=True)
                return
        pause_until_retry(deadline, reason)


def main():
    signal.signal(signal.SIGTERM, interrupted)
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--check', action='store_true', help='Read release readiness without deploying')
    mode.add_argument('--wait-seconds', type=int, default=0,
                      help='Bounded wait for concurrent updates and registry propagation')
    parser.add_argument('--github-token-stdin', action='store_true',
                        help='Read the short-lived CI GitHub token from standard input')
    args = parser.parse_args()
    if args.wait_seconds < 0:
        parser.error('--wait-seconds must be non-negative')
    token = read_github_token(sys.stdin) if args.github_token_stdin else None
    fetch = partial(read_json, github_token=token)
    deadline = time.monotonic() + args.wait_seconds if args.wait_seconds else None
    with (ROOT/'update.lock').open('w') as lock:
        if acquire_lock(lock, deadline):
            reconcile(check=args.check, deadline=deadline, fetch=fetch)


if __name__ == '__main__':
    main()
