"""Serve the gallery with the separately packaged public mobile module.

TLS terminates at the existing site proxy. No push backend or Remote Edit is enabled.
"""
import argparse
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from gramlot_py_server.gallery import stage
from gramlot_py_server.gallery.modules import stage_module
from gramlot_py_server.uvicorn import serve


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
    with TemporaryDirectory(prefix='gramlot-mobile-gallery-') as temporary:
        root = Path(temporary)
        resources = stage(root, [], '', remote_edit=False, modules=[registration])
        module = stage_module(root / 'mobile-application', pages=PAGES, assets=ASSETS,
                              catalog_file=ROOT / 'catalog.json', prefix=mount,
                              frame_script_url='/gallery/dist/frame.js')
        resources.update({mount + path: resource for path, resource in module.items()})
        serve(root, host=args.host, port=args.port, assets=resources)


if __name__ == '__main__':
    main()
