# 015 · Base database gallery

Document ID: **GE-015**.

> Local integration candidate; not a published release.

<a id="ge-015-005"></a>
## 005 · Open the examples

Block ID: **GE-015-005**.

Base adds a shared customer lesson to the ordinary gallery, served by matching
Python server launchers. Pages contain Source, Data bindings and components.
Connections, native models and dataset tooling belong to the server integration.
See GP-035 for setup. The Application/Invoice gallery is excluded from this local
release candidate and preserved separately.

```sh
python -m gramlot_py_server.gallery.base --backend asqueel --port 61401
python -m gramlot_py_server.gallery.base --backend sqlalchemy --port 61402
python -m gramlot_py_server.gallery.base --backend django --port 61403
```

Each command serves the same-origin gallery on localhost. Open its port and select
the customer lesson. Use Code to inspect the Python declaration. Remote Edit stays
disabled. The customer page declares only the inputs collection.

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
or a click explicitly choose a suggestion. All changes stay in the page Data.
This is a read-only selector trial, not a form/save framework.

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

The owner corrected the candidate scope on 2026-10-29: Invoice is outside the
current release. Its pages and model remain on
`codex/invoice-local-preserved-20261029`; this candidate contains Base only.
Existing develop worktrees remain untouched. Common selector corrections remain
qualified independently of Invoice. Publication and deployment are separate
steps; grid, form-state management and full legacy parity remain outside this tranche.

<a id="ge-015-035"></a>
## 035 · Deferred Application trial

Block ID: **GE-015-035**.

Historical record: the compact Invoice template was reviewed in an earlier local
checkpoint. It is not shipped in this candidate. Its separate preserved branch
retains contact fields and model formulas for future evaluation.

<a id="ge-015-040"></a>
## 040 · Consolidated local candidate

Block ID: **GE-015-040**.

Owner accepted the Gallery tray correction into the local approach release on
2026-10-29, explicitly keeping Invoice out. Gallery tray cards have rotation,
zoom and layer tools on the left and an opt-in removal cross on the right.
Removing a card removes its Source subtree and keyed layout row; remaining cards
stay live. The displayed count follows the Bag, while fresh keys use a separate
Data sequence. Python and JS lessons share the same Logic.

Core's 46 targeted tests and the local browser add/remove/add check pass. Candidate
wheels match installed package contents. The Base-only scope and preserved Invoice
branch in §030 remain unchanged. This is local consolidation, not publication.
