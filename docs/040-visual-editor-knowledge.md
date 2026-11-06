# 040 · Visual editor knowledge index

Document ID: **GE-040**. Updated: **2026-11-06**.

<a id="ge-040-005"></a>
## 005 · Topics

The owner requested a topic list and an index of pertinent Gramlot documentation.
The chat receives this catalogue at the start of each instruction, alongside the
current Source, selection and installed widget metadata. Document bodies are read
only when requested through `read_gramlot_doc`.

| Topic | Use it for | Documents |
| --- | --- | --- |
| Pages and Source | Nodes, hierarchy, HTML/SVG, identity, page composition and Source serialization. | `writing-pages`, `composition` |
| Data and behavior | Data roots, relative paths, bindings, formulas, named Logic, controllers, server calls and lazy data. | `data-binding`, `server-calls`, `remote-content` |
| Containers and layout | Parent/child attributes, regions, page title/pageName, framePane, tabContainer and floating windows. | `widgets`, `components`, `menus` |
| Forms, labels and validation | Formlet columns, groupBox, lbl_/box_, typed values, choices and validation. | `components`, `widgets` |
| Commands, menus and toolbars | The slot-bar use case: menu(presentation="bar"), menuline, spacers, command routing and overflow. | `menus`, `data-binding`, `widgets` |
| Appearance and density | CSS attributes, themes, spacing, colors, compact controls and label position. | `styles`, `widgets` |
| Trees and grids | Data/Source trees, search, rows, columns and frameGrid; check current editing limits. | `components`, `widgets`, `grid` |
| Files and document transfer | Uploader, download, copy Source, .grmlt and the scoped edited document. | `components`, `writing-pages`, `visual-editor` |
| Components and collections | Declarations, parameters, composition, preparation and activation; helpers are not runtime widget tags. | `composition`, `components` |
| Visual editor workflow | Selection, properties, catalogue, contextual required parameters, cut/copy/paste and the named clipboard. | `visual-editor`, `editor-chat` |
| Chat-assisted editing | Shared chat composition, context, acknowledged edit operations and current trial limits. | `chat`, `editor-chat` |

<a id="ge-040-010"></a>
## 010 · Document catalogue

| ID | Document | Scope |
| --- | --- | --- |
| `writing-pages` | [Writing pages](../../gramlot/docs/public/095-writing-pages.md) | reference |
| `data-binding` | [Data binding and controllers](../../gramlot/docs/public/097-data-binding.md) | reference |
| `components` | [Controls, forms, validation and trees](../../gramlot/docs/public/105-components.md) | reference |
| `widgets` | [Widget and parameter reference](../../gramlot/docs/public/345-widget-reference.md) | development reference; installed metadata decides availability |
| `menus` | [Menus, toolbars, frames and windows](../../gramlot/docs/public/350-menus-toolbars-and-windows.md) | reference |
| `styles` | [Themes, CSS and density](../../gramlot/docs/public/096-themes-and-css.md) | reference |
| `composition` | [Components, collections and authoring](../../gramlot/docs/public/340-components-and-collections-guide.md) | reference |
| `server-calls` | [Server calls and endpoints](../../gramlot/docs/public/098-server-calls.md) | reference |
| `remote-content` | [Remote content and lazy Data](../../gramlot/docs/public/099-remote-content.md) | reference |
| `grid` | [Resident grid and frameGrid](../../gramlot/docs/internal/375-frame-grid.md) | bounded development implementation; read-only grid |
| `chat` | [Shared ChatPane and ChatPageStore](../../gramlot/docs/internal/390-chat-component.md) | development implementation |
| `visual-editor` | [Visual Source editor](../src/gramlot_examples/pages/07-tools/02-visual_source.md) | reusable editor; gallery integration trial |
| `editor-chat` | [Natural-language Source editing](../src/gramlot_examples/trials/visual_editor_chat/README.md) | Source edits and code drafts; no whole-request rollback |

<a id="ge-040-015"></a>
## 015 · Retrieval and editing contract

Call `read_gramlot_doc(document="widgets")` to list its actual headings, then
``read_gramlot_doc(document="widgets", section="`formlet`")`` for the complete
formlet section. Heading text is exact; fenced code comments are not sections.
Each result includes repository, relative path, status, anchors and a SHA-256
digest of the indexed document. The loader snapshots the matching local
`docs_llm` manuals at startup; rebuild/restart after documentation changes.

The explicit catalogue limits reads to known documents and sections. No arbitrary
filesystem paths, URLs or credentials can be requested. Missing manuals fail
startup. The initial index contains no document bodies. Eight lookups per request
are allowed independently of the existing twelve-edit limit. Successful reads
appear in chat feedback. Tool results remain in the model conversation when an
edit waits for the browser acknowledgement.

Current manuals explain usage; installed metadata and Source validation determine
available tags, types and direct-child contracts. A documented authoring helper
is not necessarily a runtime Source tag. Development/trial status is retained;
historical proposals and the unbounded work-status/constitution records are not
loaded into the model context. Missing capabilities are reported rather than
silently replaced with a different widget.

<a id="ge-040-020"></a>
## 020 · Local setup and verification

The launcher requires `--gramlot-docs /path/to/matching/gramlot/docs_llm`.
The examples documents come from the installed `gramlot_examples` package.
Provider SDK and retrieval code stay in gramlot-examples; the core has no model
provider or arbitrary-file reading endpoint. Existing Source editing, acknowledgements
and manual-edit conflict checks remain unchanged.

Nine provider-free tests pass for catalogue integrity, all section references,
fenced headings, bounded lookup, requested-section-only context, recoverable read
errors, lookup budget and the existing editing acknowledgement cycle.
Real-provider browser verification passed: the model read the components table of
contents and “085 · Formlet, groupBox and switch”, then created a two-column
formlet and two bound fields with labels above through three acknowledged edits.
The scoped server log records the exact document ID, heading and digest; no
credentials or user Source are logged. The separate trial is running on 50788.
The reusable editor is now extracted; inspector integration remains separate pending work.
The earlier nine-test retrieval check is superseded by the assessment verification below.


<a id="ge-040-025"></a>
## 025 · Assess before editing

Owner requested preflight routing on 2026-11-01 after a database-grid request
created a tab and then failed on a missing Bag store. The harness initially
exposes only `read_gramlot_doc` and `assess_request`; it rejects mutation calls
until assessment allows editing in the current mode. Assessment covers the
whole request, including data prerequisites, before any scaffolding is inserted.

- `edit` enables the current mode's tool and the existing acknowledged loop.
- `code` returns a proposal to choose Code in the chat target selector. It is
  valid only from Source with a writable host-configured code document.
- `clarify` returns a focused question with no edits.

Source context includes the configured code language and writability, without
sending code contents in Source mode. The prompt distinguishes Python/JavaScript
knowledge from Source-tool capabilities: no Data initialization, query or server
method is executed by Source tools. A documented API is not evidence that this
host has a database, table or Bag store. Missing identities, schema or access
must be clarified; real data must not be replaced with invented sample rows.

Unresolved user/assistant turns remain in `editing.pendingRequest` so short
replies retain their meaning. Fresh mode and Source are supplied on each send;
confirmation alone never switches mode. Chat reset clears pending intent on the
next send. Code editing still changes only a draft, followed by explicit Save.
This gate makes the assessment mandatory, not infallible: it does not establish
database connectivity or make a sequence of accepted Source edits atomic.


Verified on 2026-11-01: 25 harness/retrieval/acknowledgement tests and 38 core
editor tests pass; core and gallery builds pass. In the real provider trial,
the invoice-grid request proposed Python with no Source mutation. After explicit
Code selection, the assistant asked for schema/access and left the draft unchanged.
A replacement request for one h2 was assessed and applied successfully in Source.
The initial trial's reference to unspecified standard fields was corrected in the
prompt before the final test. No database connection or query execution is claimed.

<a id="ge-040-030"></a>
## 030 · Visual editor with assistant on the hosted gallery — 2026-11-06

Owner decision, 2026-11-06: “per ora mettiamoli e usiamo le mie chiavi. tanto tra
oggi e domani la provano solo quelli di softwell. poi faremo la registrazione e
keycloak” and “mettiamo solo sonnet 5.5 e haiku per anthropic”.

The lesson `ai-02` of the `ai` catalogue (GE-010 section 955) is this editor with
its chat, as an ordinary gallery lesson. `02-visual_editor.py` composes
`VisualEditor` and `add_editor_chat`; its PageStore is `SourceAssistantStore`.
The generic Tools editor stays without chat. The local launcher
`scripts/serve_visual_chat.py` is unchanged.

The examples documents of the catalogue (`visual-editor`, `editor-chat`) are read
from the installed `gramlot_examples` package: `documentation.json` gives their
paths relative to the package. The core manuals come from `GRAMLOT_DOCS_ROOT`.
The core wheel does not contain `docs_llm`; the public Python image takes it from
the GitHub tag of the installed core release (`deploy/galleries/fetch-gramlot-docs.py`)
and fails its build when a catalogued manual is missing.

Without `ANTHROPIC_API_KEY` or `GRAMLOT_DOCS_ROOT` the lesson shows “AI examples
are not configured on this server.” `GRAMLOT_AI_MODELS` restricts the model
selector and the server rejects any other model before the first provider call.
Each editor instruction counts as one message of the page session
(`GRAMLOT_AI_MAX_MESSAGES`); one instruction can still make up to twelve edit
steps and eight manual reads, each a provider request.
