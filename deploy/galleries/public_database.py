"""Public demo database wiring; credentials belong to the deployment, never assets."""
import atexit
import json
from importlib.resources import files
from pathlib import Path

from asqueel import AsqueelDb, SqlDatabaseConfig
from gramlot_py_server.db.asqueel import AsqueelSelect
from gramlot_py_server.gallery.base import service, sales_charts
from gramlot_py_server.gallery.base.sales_geography import SalesGeography

EXAMPLES = Path(str(files('gramlot_examples')))
MODEL = Path(str(files('gramlot_py_server').joinpath('gallery/base/asqueel_model/invc')))
DATABASE = 'test_invoice_pg_xl'
CACHE_THRESHOLD = 100


def customer_model():
    """Map the save-demo's logical customer to the existing Invoice table."""
    source = SqlDatabaseConfig()
    db = source.source.db(DATABASE, implementation='postgres',
                          conninfo=f"dbname={DATABASE} options='-c statement_timeout=120000'")
    customer = db.packages().package('app', sqlschema='invc', sqlprefix=False).table(
        'customer', pkey='id', sqlname='invc_customer')
    customer.column('id', dtype='C', size='22')
    customer.column('name', dtype='T', sqlname='account_name')
    customer.column('email', dtype='T')
    return source


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
    chart_data = Path("/app/chart-data")
    sales_charts.report_provider = sales_charts.SalesCharts(database)
    sales_charts.report_geojson = json.loads((chart_data / "states.geojson").read_text())
    sales_charts.geography_provider = SalesGeography(database, sales_charts.report_geojson, chart_data / "sal")
    service.database = AsqueelSelect(database).register('customers', 'invc.customer',
        identifier='id', caption='account_name', columns=('suburb', 'state'), order_by=('account_name', 'id'))
    service.database.register('states', 'invc.state', identifier='code', caption='name',
        columns=('code',), order_by=('name',))
    service.cached_database = create_database(cached=True)
    atexit.register(service.cached_database.close)


def catalogs():
    return [(EXAMPLES / 'base' / name, EXAMPLES / 'base/pages') for name in
            ('catalog.json', 'asqueel-catalog.json', 'selection-trial-catalog.json', 'cached-trial-catalog.json', 'chart-reports-catalog.json')]


def wire_pages(root):
    for path in ('80-database/01-customers', '81-asqueel/01-state_customers', '81-asqueel/02-checkbox_customers',
                 '82-grid-database/01-customers', '82-grid-database/02-invoice_rows',
                 '83-selection-trials/02-jsonl'):
        with (root / f'pages/{path}.py').open('a') as stream:
            stream.write('\nfrom gramlot_py_server.gallery.base.service import database\nPage.database = database\n')
    with (root / 'pages/84-cached-selection/01-invoice_rows.py').open('a') as stream:
        stream.write('\nfrom gramlot_py_server.gallery.base.service import cached_database\nPageStore.database = cached_database\n')
        stream.write(f'PageStore.cache_threshold = {CACHE_THRESHOLD!r}\n')

    for name in ('sales', 'australian_timeline'):
        with (root / f'pages/85-chart-reports/{name}.py').open('a') as stream:
            stream.write('\nfrom gramlot_py_server.gallery.base.sales_charts import report_provider, report_geojson\nPage.provider = report_provider\nPage.geojson = report_geojson\n')
    with (root / 'pages/85-chart-reports/australian_geography.py').open('a') as stream:
        stream.write('\nfrom gramlot_py_server.gallery.base.sales_charts import geography_provider\nPage.provider = geography_provider\nPage.geojson = geography_provider.states\n')
