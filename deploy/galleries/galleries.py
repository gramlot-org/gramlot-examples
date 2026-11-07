"""The three applications of the hosted Python site, on one Kajenn server.

- ``/gallery/``: the main gallery (application ``gallery``);
- ``/chart_gallery/``: the chart gallery (application ``chart_gallery``);
- ``/``: the tab page, one tab per gallery, each an iframe on its mount (application ``tab_page``).

Kajenn gives a request to the application whose mount is its first path segment, without
that segment, and every other request to the application at the site root.
"""
from importlib.resources import files
from pathlib import Path

from gramlot_py_server.gallery import stage
from gramlot_py_server.kajenn import Application

EXAMPLES = Path(str(files('gramlot_examples')))
TAB_PAGE = Path(__file__).resolve().parent / 'tab_page'
GALLERY = 'gallery'
CHART_GALLERY = 'chart_gallery'


def chart_catalogs():
    """The catalogues of the chart gallery: its common catalogue and the chart types.

    The chart types family is ``"public": false``: the main gallery does not stage it.
    """
    return [(EXAMPLES / 'chart_gallery/catalog.json', EXAMPLES / 'chart_gallery/pages'),
            (EXAMPLES / 'base/chart-types-catalog.json', EXAMPLES / 'base/pages')]


def stage_chart_gallery(folder):
    """Write the pages of the chart gallery into ``folder``; return the assets to serve."""
    resources = stage(folder, chart_catalogs(), '/' + CHART_GALLERY, remote_edit=False)
    # stage() adds the Python tools catalogue to every gallery. The chart gallery does not list it;
    # its pages stay staged and unlisted.
    with (folder / 'index.py').open('a', encoding='utf-8') as stream:
        stream.write("\nPage.catalogs = [pair for pair in Page.catalogs"
                     " if not pair[0].endswith('/.gallery-tools/catalog.json')]\n")
    return resources


def declare_applications(cfg, *, gallery_class, gallery_pages, gallery_assets, chart_pages, chart_assets):
    """Declare the three applications in the ``applications`` section of a Kajenn site recipe."""
    applications = cfg.applications()
    applications.application(code=GALLERY, mount=GALLERY, app_class=gallery_class, pages=gallery_pages,
                             assets=gallery_assets, websocket=True).request(body='raw')
    applications.application(code=CHART_GALLERY, mount=CHART_GALLERY, app_class=Application,
                             pages=chart_pages, assets=chart_assets).request(body='raw')
    applications.application(code='tab_page', mount='', app_class=Application,
                             pages=TAB_PAGE).request(body='raw')
