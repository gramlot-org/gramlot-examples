# Visual Source editor chat trial

Document ID: **GE-TRIAL-VISUAL-CHAT**. Updated: **2026-11-01**.

<a id="ge-trial-visual-chat-001"></a>
## 001 · Scope and execution

This Python-first local trial composes the current visual editor with Gramlot
ChatPane and ChatPageStore. It uses the extracted core VisualEditor composition and runs inside the real gallery.
The generic gallery editor remains usable without provider configuration. The trial uses the
Uvicorn WebSocket channel and the active models reported by Anthropic.

With the matching core, adapter and examples source roots on PYTHONPATH, their
JS dependencies installed and core built, run from gramlot-examples:

```sh
python scripts/serve_visual_chat.py --port 50787 --gramlot-docs /path/to/gramlot/docs_llm --anthropic-secret-ref 'op://vault/item/field'
```

The launcher reads 1Password into its process environment only. Alternatively,
provide ANTHROPIC_API_KEY in the launcher environment. Anthropic SDK is needed
only by this trial. The launcher stages the real gallery and adds its application PageStore to the
editor page. Core owns editor behavior and styles; no implementation is copied.
Add --python-page /absolute/path/page.py for the confirmed Python draft and Save
mode. This enables remote_edit only for that mapped file; model edits alone do
not write or execute it.

<a id="ge-trial-visual-chat-002"></a>
## 002 · Editing contract

At Send, the editor supplies its current page-only Source, selection and widget
metadata. Each tool operation is validated on a detached Source and applied
through existing Source/editor APIs. An acknowledgement returns its actual
result and current Source to the provider before the next model step. The
canvas, Source tree and properties follow each selected edited node immediately.
A rejected candidate leaves Source untouched and can be corrected by the model.
A manual edit or New/Open during a run stops subsequent operations. There is a
12-operation limit per instruction. Earlier successful edits remain on failure;
there is no whole-request rollback or persistent conversation history.

The bounded trial accepts text instructions, visual widgets, literal text,
scalar attributes and ordinary bindings. Generated scripts/handlers and file
attachments are unsupported. Credentials remain server-side; the current Source
and widget metadata are sent to Anthropic for the requested editing operation.

<a id="ge-trial-visual-chat-003"></a>
## 003 · Original trial verification (historical record)

25 editor tests, an additional typed-metadata check and 49 Python tests pass in the integration worktrees. The three
acknowledgement tests cover waiting, duplicate/stale replies, rejection feedback,
completion and stopping for a manual change. A real browser request created a
heading, tabContainer, titled formlet and three bound fields progressively.
A second request changed heading text/color and a field label while preserving
bindings. The initial unacknowledged queue exposed an invalid model path and was
replaced by the current per-operation feedback cycle. Two adapter upload tests pass using pytest-asyncio in a temporary test
environment. Actual WebSocket editing is verified. Full parameter types and
common presentation metadata are supplied after the real trial exposed a string
column count; the repeated trial confirmed integer columns=2 and two visual
columns. Owner acceptance, reusable packaging and later inspector
integration remain pending. Nothing has been published or deployed.

<a id="ge-trial-visual-chat-004"></a>
## 004 · Topic-driven documentation

The chat now receives a topic/document catalogue and can request a document table
of contents or one exact section using read_gramlot_doc. It reads matching
docs_llm from the explicit --gramlot-docs root and the current examples checkout.
The catalogue spans 11 topics and 13 documents; code-fence comments are excluded
from section headings. Document status, anchors and digests accompany results.
Eight lookups per request are independent of the twelve-edit limit. Lookup results
persist across browser acknowledgements; a failed lookup returns a correctable
error without changing Source. No arbitrary path or URL reading is exposed.
See GE-040 for the maintained topic list and document map.

Real-provider lookup verified on 2026-11-01: components/Contents and section
085 · Formlet, groupBox and switch were read before three acknowledged edits
created the requested two-column formlet and bound fields. The local trial runs
on 50788; the earlier 50787 document was not restarted.


<a id="ge-trial-visual-chat-005"></a>
## 005 · Common page-code draft

The reusable editor takes code_document/codeDocument with explicit language
python or javascript. Chat Code mode uses edit_code and acknowledges replace_code;
it never saves or executes the draft. Python draft syntax is checked before
delivery; each host validates the language again on explicit Save. The current
provider/PageStore service is Python-hosted. The JavaScript editor has the same
browser draft protocol, but Node/Bun do not yet provide a live chat PageStore.

Verified: 33 shared editor tests, 26 connected Python checks and 37 adapter tests
on each JavaScript runtime. Browser Save and saved-preview execution work on Node
and Bun, and a second session's stale revision is rejected while retaining its
draft. A real provider request for JavaScript was not performed in this run.


<a id="ge-trial-visual-chat-consolidation"></a>
## Common-base integration — 2026-11-01

The reusable editor and optional harness are integrated locally. The preceding
real-provider observations belong to the original trial; this consolidation tests
provider acknowledgements and documentation lookup with fixtures, not a paid live
request. Core and adapter regression results are recorded in GC-070 and PORT-0029.
The launcher keeps the rest of the gallery read-only even when one configured
Python editor document is writable. Inspector integration remains future work.
No publication, deployment or TestFlight upload is part of this consolidation.
