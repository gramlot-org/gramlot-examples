# 015 · Base and Application galleries

Document ID: **GE-015**.

> Local integration candidate; not a published release.

<a id="ge-015-005"></a>
## 005 · Open the examples

Block ID: **GE-015-005**.

Base and Application are separate catalogs in this package, served by
matching gramlot-py-server launchers. Base adds a shared customer lesson to the
ordinary gallery; Application shows the Invoice branch. The pages contain Source,
Data bindings and components. Connections, native models and dataset tooling belong
to the server integration. See its GP-035 guide for setup.

```sh
python -m gramlot_py_server.gallery.base --backend asqueel --port 61401
python -m gramlot_py_server.gallery.base --backend sqlalchemy --port 61402
python -m gramlot_py_server.gallery.base --backend django --port 61403
python -m gramlot_py_server.gallery.application --port 61404
```

Each command serves the same-origin gallery on localhost. Open its port and select
the customer lesson. Use Code to inspect the Python declaration. Remote Edit stays
disabled. The two customer pages declare only the inputs collection.

<a id="ge-015-010"></a>
## 010 · Base dataset

Block ID: **GE-015-010**.

base/model.json defines a fixed physical dataset, not a universal ORM model:

| Table | Columns | Rows in the verified copy |
| --- | ---: | ---: |
| state | 2 | 8 |
| customer | 4 | 3,200 |
| invoice | 5 | 256 |
| product | 4 | 1,695 |
| invoice_row | 6 | 806 |

The three dedicated copies retain every row, types, nullability, keys and four
relations. Only columns are reduced. No logical-deletion policy is inferred.
Source test_invoice_pg remains read-only; no records or credentials belong here.

<a id="ge-015-015"></a>
## 015 · What to try

Block ID: **GE-015-015**.

Search by account name, choose a record and inspect the caption, locality and state.
Reopen and clear the selection. Type into dbComboBox: Enter keeps the text; arrows
or a click explicitly choose a suggestion. Application additionally shows the
invoice count and an HTML record template. All changes stay in the page Data.

The Application model contains 76 physical tables and 808 columns. Customer has
20 physical and 19 virtual fields; other application behavior is not yet ported.
The SQL equivalent used for customer_score is documented in GP-035. This is a
read-only selector trial, not a complete invoice application or form/save framework.

<a id="ge-015-020"></a>
## 020 · One page across providers

Block ID: **GE-015-020**.

Base receives selector_parameters from its runner. SQLAlchemy exposes state_name
through an outer join; Django through an F annotation. Asqueel resolves the relation
from its own model. This is ordinary Python page configuration, not a new browser API.

<a id="ge-015-025"></a>
## 025 · Direct auxiliary relations

Block ID: **GE-015-025**.

Declare auxColumns='@state.name' for Asqueel. No aliasColumn or per-field auxiliary
registration is required. The returned _state_name is used by
selected__state_name='.state_name' and by {_state_name} in templates. Invalid model
paths produce an error. SQLAlchemy/Django retain their explicit native projections.
HTML templates are sanitized and record values are inserted as text. Only the
server integration accesses models and queries.

<a id="ge-015-030"></a>
## 030 · Integration checkpoint

Block ID: **GE-015-030**.

The Base and Application example deliveries were 9962b09 and 610fe5b. Their separate
worktrees remain preserved. This local consolidation uses the current gallery and
shared server architecture, rather than recovering obsolete HTTP or staging code.
The earlier requirement to register each Asqueel auxiliary field has been superseded
by direct model resolution. Database pages do not activate every gallery collection.
Local verification and acceptance precede develop consolidation; publication and
deployment are separate decisions. Grid, new form-state management and full legacy
selector parity remain outside this tranche.
