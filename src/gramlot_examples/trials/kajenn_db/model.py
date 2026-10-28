"""Asqueel model for the optional SQLite customer gallery."""
from asqueel import SqlDatabaseConfig


def customer_model(database):
    source = SqlDatabaseConfig()
    db = source.source.db('gallery_customers', implementation='sqlite')
    db.connection('main', database=str(database))
    customer = db.packages().package('app', sqlschema='main', sqlprefix=False).table('customer', pkey='id')
    customer.column('id', size=':22')
    customer.column('name', notnull=True)
    customer.column('email', notnull=True, unique=True)
    return source


CUSTOMERS = (
    {'id': '1', 'name': 'Mario Rossi', 'email': 'mario@example.com'},
    {'id': '2', 'name': 'Anna Bianchi', 'email': 'anna@example.com'},
)
