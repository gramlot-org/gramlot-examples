"""Qualify the public demo's database permissions, cache isolation and disposal."""
import importlib.util
import psycopg
from psycopg.errors import InsufficientPrivilege
from public_database import CACHE_THRESHOLD, EXAMPLES, create_database

with psycopg.connect(dbname='invoice_demo') as connection:
    privileges=connection.execute("SELECT rolsuper, rolcreatedb, rolcreaterole FROM pg_roles WHERE rolname=current_user").fetchone()
    assert privileges==(False,False,False), privileges
    for table in ('invc_state','invc_customer','invc_invoice','invc_product','invc_invoice_row'):
        rights=connection.execute("SELECT has_table_privilege(current_user,%s,'SELECT'), has_table_privilege(current_user,%s,'INSERT,UPDATE,DELETE,TRUNCATE')",(f'invc.{table}',f'invc.{table}')).fetchone()
        assert rights==(True,False),(table,rights)
    try:
        with connection.transaction():
            connection.execute('UPDATE invc.invc_customer SET account_name=account_name WHERE false')
    except InsufficientPrivilege:
        pass
    else:
        raise AssertionError('Business-table update must be denied, even with zero affected rows')
    try:
        with connection.transaction():
            connection.execute('SELECT 1 FROM adm.adm_user WHERE false')
    except InsufficientPrivilege:
        pass
    else:
        raise AssertionError('Unrelated administration tables must not be readable')
    total=connection.execute('SELECT count(*) FROM invc.invc_invoice_row').fetchone()[0]
    assert total>CACHE_THRESHOLD

spec=importlib.util.spec_from_file_location('public_cached_page',EXAMPLES/'base/pages/84-cached-selection/01-invoice_rows.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
database=create_database(cached=True)
stores=[module.PageStore(),module.PageStore()]
for store in stores:
    store.database=database;store.cache_threshold=CACHE_THRESHOLD;store.start()

def request(store,**kwargs):
    args=dict(request_id='public-check',limit='1000',seed='',sorted_by='',start=0,count=200,refresh=False)
    args.update(kwargs)
    store.publish('selection_request',args)
    result=store.data['selection_window']
    assert not result['error'], result['error']
    return result

try:
    first,second=stores
    assert request(first,limit='100')['mode']=='resident'
    one=request(first);two=request(second)
    assert one['mode']==two['mode']=='cachedFetch'
    assert first._owner!=second._owner
    assert one['window']['total']==two['window']['total']==min(total,1000)
    assert len(one['rows'])==200
    assert request(first,start=200)['window']['start']==200
    assert request(first,seed='zzzz-no-such-public-row')['window']['total']==0
    assert request(second)['window']['total']==min(total,1000)
    result=request(first,sorted_by='quantity:d')
    values=[node.attr['quantity'] for node in result['rows'].nodes]
    assert values==sorted(values,reverse=True)
    with database.session() as session:
        expected=session.table('invc.invoice_row').query(columns='$id,$quantity',order_by='$quantity DESC,$id',limit=200).fetch()
        assert values==[row['quantity'] for row in expected]
    first.close()
    with database.session() as session:
        table=session.table('_asql_._asql_cached_fetch')
        assert table.query(where='$owner=:owner',owner=first._owner).count()==0
        assert table.query(where='$owner=:owner',owner=second._owner).count()>0
    assert request(second)['window']['total']==min(total,1000)
finally:
    for store in stores:
        store.close()
    with database.session() as session:
        for store in stores:
            assert session.table('_asql_._asql_cached_fetch').query(where='$owner=:owner',owner=store._owner).count()==0
    database.close()
print('PASS public database: restricted role, denied business writes, resident/cached windows, sorting, search, independent owners and cleanup')
