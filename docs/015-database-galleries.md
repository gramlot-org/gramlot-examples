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
| invoice | 5 | 60,179 |
| product | 4 | 1,695 |
| invoice_row | 6 | 410,429 |

The three dedicated copies retain every row, types, nullability, keys and four
relations. Only columns are reduced. No logical-deletion policy is inferred.
Source test_invoice_pg_xl remains read-only; no records or credentials belong here.

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
HTML templates are sanitized and record values are inserted as text. Connections and concrete models belong to the server integration; Python page
endpoints query through its injected service.

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


<a id="ge-015-045"></a>
## 045 · State and customer (Asqueel)

The Asqueel runner adds base/asqueel-catalog.json to the common Base catalog.
Open Asqueel selectors → State and customer. Choose State, then Customer. Changing
State retains the old customer and displays an error when it no longer qualifies.
The checkbox changes the hard filter into a preference: searches retry without it
only when no match exists, and an outside selection is valid. Required dbSelect
selects a sole candidate after a condition change; otherwise the old key remains.

The declaration uses condition='$state=:state', condition_state='^.state' and
weakCondition='^.weak'. This capability is Asqueel-only; no equivalent expression
translator is installed for SQLAlchemy or Django. The database remains read-only.


<a id="ge-015-045"></a>
## 045 · XL invoice-row Grid — 2026-10-29

Block ID: **GE-015-045**.

Owner requested the XL source for Base and a resident invoice-row Grid with
limits through 100,000, server timings, related customer name/state, invoice
number/date, product, quantity, unit price and total. This is an additional Base
example, not the separate Application/Invoice management project. Asqueel serves
it under Grid · Database. It uses the existing native models and typed JSONL (selected 2026-10-30); the
whole result is resident and only the displayed rows are virtualized.
See lesson ge-db-grid-03. The source choice supersedes the smaller Base snapshot.


<a id="ge-015-050"></a>
## 050 · Separate selection-transfer experiments — 2026-10-29

Block ID: **GE-015-050**.

> Historical record: complete-response comparisons retired on 2026-10-30; JSONL is selected for resident invoice loading.

Owner requested separate complete-response and progressive JSONL pages with
query, transfer, Bag and search timings. The optional `base/selection-trial-catalog.json`
adds Grid · Transfer experiments, with `83-selection-trials/01-json` and `02-jsonl`.
It is not part of the standard Base/Asqueel catalogues. The local integration
runner opts in with `--selection-trials` and the separately built experimental
`gramlot_selection_trial` collection. Existing invoice-row examples are unchanged.

Both comparison pages use HTTP and the same fully fetched XL invoice query,
attribute-mode Bag, per-grid search/sort and nine limits through 100,000. The
original lesson continues using ordinary WebSocket RPC. Python declares the UI,
Data and bindings; transport/decoder behavior belongs to the experimental core
component, not page JavaScript. A completed selection replaces the previous one
only after valid EOF/completion; cancellation and failures never publish partial data.

The cards distinguish query/fetch, request-to-headers, body reception, decoding,
client insertion, server Bag construction and request-to-Bag-ready. JSON decoding
also hydrates its Bag, so those client costs are combined. JSONL reception overlaps
decoding/insertion and server encoding waits, and is not isolated network time.
Search measures existing synchronous applyFilter, excluding the 100 ms debounce
and rendering. Blank values mean not applicable or not yet measured. See the
paired lesson explanations ge-db-grid-04/05 for the same measurement boundaries.


<a id="ge-015-055"></a>
## 055 · Historical record: withdrawn progressive WebSocket trial

Block ID: **GE-015-055**.

On 2026-10-29 the owner requested immediate appends via DataBinder, then discarded
the solution: "scarterei quest asoluzione". It delivered the first 500 rows in
666.10ms at a 100,000-row limit, but synchronous per-row collection-view index
reconciliation made subsequent appends increasingly slow. The run was stopped;
there is no final 100,000-row browser time. The page, block component and test-only
protocol were removed. No silent-write/index workaround was adopted.

<a id="ge-015-060"></a>
## 060 · Complete WebSocket RPC comparison — 2026-10-29

Block ID: **GE-015-060**.

> Historical record: complete-response comparisons retired on 2026-10-30; JSONL is selected for resident invoice loading.

Owner next requested checking whether ordinary WebSocket transfer is faster than
HTTP. The optional trial catalogue adds 03-websocket-rpc (ge-db-grid-07), using
existing dataRpc and the same load_trial_json endpoint as JSON / HTTP. Timing ends
before Data publication to keep the boundary consistent. Server query/Bag timings
and search remain visible. The complete WebSocket path includes gallery family
routing and codec work; this is not an isolated network protocol benchmark.

<a id="ge-015-065"></a>
## 065 · Asqueel-only cached invoice rows — 2026-10-29

Block ID: **GE-015-065**.

Optional cached-trial-catalog.json adds Grid · Asqueel only, page
84-cached-selection/01-invoice_rows. Max rows includes 200,000 and 500,000.
The query uses the XL Base invoice-row model with customer/state, invoice/date,
product, quantity, unit price and total. Threshold defaults to 1,000 actual rows,
configurable by the integration launcher. Small selections remain fully loaded;
larger selections use native cachedFetch and normally only 200 browser rows.

Source uses DataBinder and the isolated windowSelection component. PageStore owns
cache lifetime, per-page sort/search and request validation. There is no application
DOM construction or custom fetch. Click a header for its direction, Shift-click
adds/toggles criteria; badges show priority/direction. Search matches all words
across text columns, with a 200 ms debounce. It does not expose typed searchOn.

Displayed timings distinguish count, materialization, first window ready, server
window read, scroll-to-ready, server search, search-to-ready and server sort.
Ready excludes paint. Search total includes debounce. Unloaded row heights are
estimated; no manual row reorder/resize is enabled in this experiment. Reload
rebuilds the snapshot. Page close cleans its own cache; abrupt process death has
no automatic TTL. Setup and limited privileges: GP-035 cached-selection section.

<a id="ge-015-070"></a>
## 070 · JSONL selected for resident invoice rows — 2026-10-30

Block ID: **GE-015-070**.

Owner selected JSONL and explicitly included the floating invoice-row page.
82-grid-database/02-invoice_rows now shares the JSONL loader and load_trial_rows
query with 83-selection-trials/02-jsonl. Dates/Decimals remain typed and the new
selection is published only after valid completion. Reload and limit changes
cancel/supersede older loads. The floating layout and local sort/filter remain.

The footer displays Query, Encode and Ready (through Bag readiness, before paint).
The JSON HTTP and complete WebSocket comparison pages/endpoint are retired. Their
lesson IDs ge-db-grid-04 and ge-db-grid-07 are retired, not reused; measurements
remain historical evidence in GC-375. The index retains JSONL and the separate
Asqueel-only cachedFetch family. Use the local Base/Asqueel launcher or release
preview with the core `gramlot.collections.selection_trial` collection; both expose JSONL.
