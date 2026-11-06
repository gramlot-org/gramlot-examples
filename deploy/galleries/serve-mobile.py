"""Serve the gallery with the separately packaged public mobile module.

TLS terminates at the existing site proxy. No push backend or Remote Edit is enabled.
"""
import argparse
import sys
import os
import socket
import struct
from importlib.resources import files
from pathlib import Path
from tempfile import TemporaryDirectory
from gramlot_py_server.gallery import stage
from gramlot_py_server.gallery.modules import stage_module
from gramlot_py_server.gallery.base.selection_trial import SelectionTrialApplication
from kajenn import AsgiServer
from kajenn.config.templates import DefaultConfiguration
from kajenn_db.asqueel import AsqueelDbHandler
from public_database import configure, catalogs, wire_pages, customer_model


def trust_container_proxy():
    """Trust forwarded HTTPS only from this container's host gateway."""
    routes = Path('/proc/net/route').read_text().splitlines()[1:]
    gateways = [socket.inet_ntoa(struct.pack('<I', int(row.split()[2], 16)))
                for row in routes if row.split()[1] == '00000000']
    if len(gateways) != 1:
        raise RuntimeError('Expected one Docker default gateway for the HTTPS proxy')
    os.environ['FORWARDED_ALLOW_IPS'] = '127.0.0.1,' + gateways[0]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--modules', type=Path, required=True, help='Parent of mobile_application')
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()
    sys.path.insert(0, str(args.modules.resolve()))
    from mobile_application import ROOT, PAGES, ASSETS, CATALOG
    mount = '/mobile-application'
    registration = dict(catalog=CATALOG, mount=mount,
                        integration=mount + '/device-provider.js', prerequisites=[])
    trust_container_proxy()
    configure()
    trials = Path(str(files('gramlot_examples').joinpath('trials')))
    page_catalogs = catalogs() + [(trials / name / 'catalog.json', trials / name / 'pages')
                                 for name in ('page_store', 'kajenn_db', 'chat_base', 'ai')]
    with TemporaryDirectory(prefix='gramlot-mobile-gallery-') as temporary:
        root = Path(temporary)
        resources = stage(root, page_catalogs, '', serverless_download_url='/downloads/gramlot-gallery-serverless.zip',
                          remote_edit=False, modules=[registration])
        module = stage_module(root / 'mobile-application', pages=PAGES, assets=ASSETS,
                              catalog_file=ROOT / 'catalog.json', prefix=mount,
                              frame_script_url='/gallery/dist/frame.js')
        resources.update({mount + path: resource for path, resource in module.items()})
        wire_pages(root)
        class Site(DefaultConfiguration):
            def applications_section(self, cfg):
                cfg.databases(handler_class=AsqueelDbHandler).database(
                    code='default', source=customer_model())
                cfg.applications().application(
                    code='pages', mount='', app_class=SelectionTrialApplication,
                    pages=root, assets=resources, websocket=True).request(body='raw')

        AsgiServer(config=Site).serve(host=args.host, port=args.port)


if __name__ == '__main__':
    main()
