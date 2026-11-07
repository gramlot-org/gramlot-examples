"""The customer lesson starts with a loaded record and offers real customer keys."""
import importlib.util
import sqlite3
from pathlib import Path

import pytest

pytest.importorskip("asqueel")
from asqueel import AsqueelDb  # noqa: E402

TRIAL = Path(__file__).parents[1] / "src/gramlot_examples/trials/kajenn_db"


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class SessionAccess:
    """The host role: one Asqueel session for the synchronous store code of a test."""

    def __init__(self, session):
        self.session = session

    def db(self, name=None):
        return self.session


@pytest.fixture
def store(tmp_path):
    database = tmp_path / "customers.sqlite"
    with sqlite3.connect(database) as db:
        db.execute("CREATE TABLE customer (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)")
        db.executemany("INSERT INTO customer VALUES (?, ?, ?)", [
            ("UOoM_JZuPLyFcrTUxRxEIQ", "Zeno Verdi", "zeno@example.com"),
            ("b8Kq2mXwTn0aP4rLs1eYvA", "Anna; Bianchi", "anna@example.com"),
        ])
    model = load(TRIAL / "model.py", "kajenn_db_model")
    page = load(TRIAL / "pages/91-kajenn_db/01_customer.py", "kajenn_db_customer")
    asqueel = AsqueelDb(model.customer_model(database))
    with asqueel.session() as session:
        store = page.PageStore()
        store._database_access = SessionAccess(session)
        store.start()
        try:
            yield store
        finally:
            store.close()
    asqueel.close()


def test_store_starts_with_the_first_customer_by_name_loaded(store):
    assert store.data["customers.values"] == (
        "b8Kq2mXwTn0aP4rLs1eYvA:Anna, Bianchi;UOoM_JZuPLyFcrTUxRxEIQ:Zeno Verdi")
    assert store.data["request.pkey"] == "b8Kq2mXwTn0aP4rLs1eYvA"
    assert store.data.get_node("customer").attr["status"] == "loaded"
    assert store.data["customer.record.name"] == "Anna; Bianchi"


def test_a_choice_loads_that_customer(store):
    store.data.set_item("request.pkey", "UOoM_JZuPLyFcrTUxRxEIQ")
    assert store.data.get_node("customer").attr["pkey"] == "UOoM_JZuPLyFcrTUxRxEIQ"
    assert store.data["customer.record.email"] == "zeno@example.com"
