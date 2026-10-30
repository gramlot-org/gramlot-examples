"""Public demo database wiring; credentials belong to the deployment, never assets."""
import atexit
from importlib.resources import files
from pathlib import Path

from asqueel import AsqueelDb, SqlDatabaseConfig
from gramlot_py_server.db.asqueel import AsqueelSelect
from gramlot_py_server.gallery.base import service

EXAMPLES = Path(str(files('gramlot_examples')))
MODEL = Path(str(files('gramlot_py_server').joinpath('gallery/base/asqueel_model/invc')))
DATABASE = 'invoice_demo'
CACHE_THRESHOLD = 100


def create_database(*, cached=False, catalog_only=False):
    class Configuration(SqlDatabaseConfig):
        def main(self, root):
            options = '-c statement_timeout=120000'
            if not cached:
                options += ' -c default_transaction_read_only=on'
            db = root.db(DATABASE, implementation='postgres', conninfo=f"dbname={DATABASE} options='{options}'")
            if cached:
                db.options().cachedFetch()
            if not catalog_only:
                db.packages().package('invc', path=str(MODEL), sqlschema='invc', sqlprefix=False)
    return AsqueelDb(Configuration)


def configure():
    database = create_database()
    with database.session() as session:
        if session.execute('SHOW transaction_read_only').fetchone()[0] != 'on':
            raise RuntimeError('Read-only connection required')
    atexit.register(database.close)
    service.database = AsqueelSelect(database).register('customers', 'invc.customer',
        identifier='id', caption='account_name', columns=('suburb', 'state'), order_by=('account_name', 'id'))
    service.database.register('states', 'invc.state', identifier='code', caption='name',
        columns=('code',), order_by=('name',))
    service.cached_database = create_database(cached=True)
    atexit.register(service.cached_database.close)


def catalogs():
    return [(EXAMPLES / 'base' / name, EXAMPLES / 'base/pages') for name in
            ('catalog.json', 'asqueel-catalog.json', 'selection-trial-catalog.json', 'cached-trial-catalog.json')]


def wire_pages(root):
    for path in ('80-database/01-customers', '81-asqueel/01-state_customers',
                 '82-grid-database/01-customers', '82-grid-database/02-invoice_rows',
                 '83-selection-trials/02-jsonl'):
        with (root / f'pages/{path}.py').open('a') as stream:
            stream.write('\nfrom gramlot_py_server.gallery.base.service import database\nPage.database = database\n')
    with (root / 'pages/84-cached-selection/01-invoice_rows.py').open('a') as stream:
        stream.write('\nfrom gramlot_py_server.gallery.base.service import cached_database\nPageStore.database = cached_database\n')
        stream.write(f'PageStore.cache_threshold = {CACHE_THRESHOLD!r}\n')
