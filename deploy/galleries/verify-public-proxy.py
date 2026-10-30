"""Check that only the container's host gateway can assert forwarded HTTPS."""
import asyncio
import importlib.util
import os
from pathlib import Path
from unittest.mock import patch
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

spec = importlib.util.spec_from_file_location('gallery_entry', Path(__file__).with_name('serve-mobile.py'))
entry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(entry)
route = 'Iface Destination Gateway\neth0 00000000 010011AC\neth0 000011AC 00000000\n'
with patch.object(Path, 'read_text', return_value=route), patch.dict(os.environ):
    entry.trust_container_proxy()
    assert os.environ['FORWARDED_ALLOW_IPS'] == '127.0.0.1,172.17.0.1'
    async def capture(scope, receive, send):
        return scope['scheme']
    proxy = ProxyHeadersMiddleware(capture, trusted_hosts=os.environ['FORWARDED_ALLOW_IPS'])
    async def check():
        for host, expected in [('172.17.0.1', 'wss'), ('172.17.0.2', 'ws')]:
            scope = dict(type='websocket', scheme='ws', client=(host,1234),
                         headers=[(b'x-forwarded-proto', b'https')])
            assert await proxy(scope, None, None) == expected
    asyncio.run(check())
with patch.object(Path, 'read_text', return_value='Iface Destination Gateway\n'):
    try:
        entry.trust_container_proxy()
    except RuntimeError:
        pass
    else:
        raise AssertionError('Missing gateway must not widen proxy trust')
print('PASS proxy: trusted host gateway preserves HTTPS; other container addresses cannot spoof it')
