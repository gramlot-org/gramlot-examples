"""Exercise the actual gallery nginx template on isolated loopback listeners."""
import gzip
import shutil
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('gallery_update',HERE/'update.py')
u=importlib.util.module_from_spec(spec);spec.loader.exec_module(u)

@unittest.skipUnless(shutil.which("nginx"), "nginx executable required for integration check")
class CacheIntegration(unittest.TestCase):
    def test_gzip_revalidation_deployment_and_rollback(self):
        state={'version':'a'}
        class Fixture(BaseHTTPRequestHandler):
            def log_message(self,*args): pass
            def do_GET(self):
                js=self.path.startswith('/assets/')
                body=((f'// {state["version"]}\n'+('const value = 1;\n'*300)) if js else '{"data":"'+('x'*5000)+'"}').encode()
                self.send_response(200)
                self.send_header('Content-Type','application/javascript' if js else 'application/json')
                self.send_header('Cache-Control','no-store')
                self.send_header('Content-Length',str(len(body)))
                self.end_headers();self.wfile.write(body)
        upstream=ThreadingHTTPServer(('127.0.0.1',0),Fixture)
        thread=threading.Thread(target=upstream.serve_forever,daemon=True);thread.start()
        with tempfile.TemporaryDirectory(prefix='gramlot-cache-nginx-') as directory:
            root=Path(directory);root.chmod(0o755);config=root/'nginx.conf'
            # Obtain private ephemeral ports, then hand them to this isolated nginx.
            import socket
            ports=[]
            for _ in range(2):
                with socket.socket() as sock:
                    sock.bind(('127.0.0.1',0));ports.append(sock.getsockname()[1])
            def render(generation):
                text=u.nginx_text((HERE/'nginx.conf').read_text(),0,Path('/generations')/generation/'gallery.zip')
                text=text[text.index('\nserver {',text.index('server {')+1):]
                for port in ports:text=text.replace('listen 443 ssl;',f'listen 127.0.0.1:{port};',1)
                text='\n'.join(line for line in text.splitlines() if 'ssl_certificate' not in line)
                for port in (19182,19183):text=text.replace(f'127.0.0.1:{port}',f'127.0.0.1:{upstream.server_port}')
                config.write_text(f'pid {root}/nginx.pid; error_log {root}/error.log;\nworker_processes 1; events {{ worker_connections 128; }}\nhttp {{ access_log off; include /etc/nginx/mime.types;\nclient_body_temp_path {root}/client; proxy_temp_path {root}/proxy; fastcgi_temp_path {root}/fastcgi; uwsgi_temp_path {root}/uwsgi; scgi_temp_path {root}/scgi;\n'+text+'\n}\n')
            def nginx(*args):
                subprocess.run(['nginx','-p',str(root),'-c',str(config),*args],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
            def get(port,path='/assets/probe.js',etag=None):
                headers={'Accept-Encoding':'gzip'}
                if etag:headers['If-None-Match']=etag
                try:r=urlopen(Request(f'http://127.0.0.1:{port}'+path,headers=headers),timeout=5)
                except HTTPError as error:r=error
                body=r.read();return r.status,r.headers,body
            def until(port,expected,etag=None):
                for _ in range(80):
                    status,h,b=get(port,etag=etag)
                    if h.get('ETag')==expected:return status,h,b
                    time.sleep(.05)
                self.fail('nginx workers did not select the expected generation')
            render('first');nginx('-t');nginx()
            try:
                for port in ports:
                    status,h,body=until(port,'W/"first:/assets/probe.js"')
                    self.assertEqual(status,200);self.assertEqual(h['Content-Encoding'],'gzip')
                    self.assertIn('Accept-Encoding',h['Vary']);self.assertIn('no-cache',h['Cache-Control'])
                    self.assertLess(len(body),len(gzip.decompress(body)))
                    status,checked,body=get(port,etag=h['ETag']);self.assertEqual(status,304);self.assertEqual(body,b'');self.assertEqual(checked['ETag'],h['ETag'])
                    status,h,body=get(port,'/gramlot/rpc');self.assertEqual(status,200);self.assertEqual(h['Cache-Control'],'no-store');self.assertIsNone(h.get('ETag'));self.assertEqual(h['Content-Encoding'],'gzip')
                state['version']='b';render('second');nginx('-t');nginx('-s','reload')
                for port in ports:
                    status,h,body=until(port,'W/"second:/assets/probe.js"','W/"first:/assets/probe.js"')
                    self.assertEqual(status,200);self.assertTrue(gzip.decompress(body).startswith(b'// b\n'))
                    # Old workers may still accept a connection during graceful reload.
                    status, checked, body = until(port, h['ETag'], h['ETag'])
                    self.assertEqual(status,304);self.assertEqual(body,b'')
                state['version']='a';render('first');nginx('-s','reload')
                for port in ports:
                    status,h,body=until(port,'W/"first:/assets/probe.js"','W/"second:/assets/probe.js"')
                    self.assertEqual(status,200);self.assertTrue(gzip.decompress(body).startswith(b'// a\n'))
                print('Both origins: gzip JS/JSON, 304 reuse, changed same-length asset on deployment and rollback, RPC no-store passed.')
            finally:
                nginx('-s','quit');upstream.shutdown();upstream.server_close()

if __name__=='__main__':unittest.main()
