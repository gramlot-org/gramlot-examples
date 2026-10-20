# Gramlot examples

The [gallery](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md) presents the same examples in Python and
JavaScript, in four families:

- [`html_svg/`](html_svg/): thirteen HTML and SVG pages, without binding.
- [`binding/`](binding/): eleven pages whose DOM follows the Data through pointers,
  editing, booleans, style, SVG and freeze. The last three take the content of
  `html_svg` examples 06, 08 and 12 and add the binding.
- [`controllers/`](controllers/): twenty-two pages with formulas, controllers, named
  logic in the `Logic` class of the page module, inline expressions, node methods, buttons,
  events, the end-to-end story, `dataRpc` calls to the endpoints of the page, `remote`
  fragments and `dataRemote` values.

- [`components/`](components/): twenty-five lessons for inputs, labelbox, layout,
  command buttons and validation, with compact desktop/touch presentation.

Each example is a file page: `NN_name.py`, its JavaScript equivalent `NN_name.js`,
its README `NN_name.md`, and where needed a same-name stylesheet `NN_name.css`.
`NN_name.js` exports `Page`, and `Logic` when the page names client methods: the
JavaScript page uses both, the Python page takes `Logic` from it. A page without client
methods exports no `Logic`. The pages use only what the core `GramlotFileServer` serves:
the base theme, `Page.css` for the stylesheets added after it, the same-name stylesheet,
the `Logic` of the page module, the endpoints and the Source fragments of the page. The gallery
adds its own files: the frame script, a staged `<key>_aux.js` per example and its
assets ([GE-010 §025](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md#ge-010-025)).

The pages depend only on the Gramlot core. Shared visual styling is the
`gramlot-base` theme shipped in the core package. The server links it to every page
(its `css_theme` option, `cssTheme` in JavaScript), so no page lists it in `Page.css`;
it is served at `/themes/gramlot-base/theme.css`.

## Learn through the release sequence

The sections follow the chronological growth of Gramlot. Start with Source, then
return to the same interface as later releases add Data bindings, controllers,
endpoint calls and remote content. The same example may appear more than once:
compare the earlier code with the later declaration, identify what is removed and
explain why the result still works. Repetition for this comparison is intentional.

Use the [core release-by-release learning route](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md#gc-025-015) for the milestones and
references. These labels name **core** releases, not the independent release
numbers of this package. The gallery's maintained pages are not frozen executable
copies of old packages: historical forms must be labelled, not installed through
pinned/downgraded dependencies. Each of the 41 lessons opens with a short description and feature scope.
Section introductions state which library features are used at each release stage.
Guided trials, exercises and limits remain available under **More detail**, closed
initially so the gallery starts with just the introduction. Before/after comparisons distinguish reduced
coordination from added behavior; the complete-page lesson retains its local stage and adds a separate endpoint
trial; explicitly blocked advanced topics remain separate work. The identity-aware auth walkthrough lives in the Kajenn
adapter guide.

| Stage | Existing examples | Comparison to make |
| --- | --- | --- |
| 0.1.x Source foundation | e01–e13, beginning with e01 | Structure, native controls and SVG before Data binding. The maintained live Source demonstrations add later inline browser actions. |
| 0.2.0 binding and controllers | b01–b11, c01–c08, c15 and the first part of c16 | Return to forms e06→b09, SVG e08→b10 and composition e12→b11. Follow Data instead of manually synchronizing presentation. c08 combines local behavior. |
| 0.2.3 Data-srcdoc sandbox | Later section of c16 | Distinguish bound text from a separate sandboxed HTML preview. |
| 0.2.5 page module and Data exchange | c03, c17 and the shared Logic beside Python | Save/restore the same form record; distinguish TYTX from JSON/XML exports. The public utility path changed in 0.2.10. |
| 0.2.14 endpoints | c09–c11, then return to c08’s later section | Move from local effects to a Page method returning a value into Data. Explain success, error and default refusal. |
| 0.2.15 Source authorization | Later section of c11; identity-aware adapter guide | Server removes refused Source subtrees. Common pages do not demonstrate authenticated allow/deny. |
| 0.2.16 remote and lazy Data | c12–c14 | Compare returning a value with mounting Source and with loading a value only when read. |

Within a stage, use prerequisites to understand a page; they do not reorder the
release narrative. c08 retains its original local stage and appends a labelled 0.2.14 quote trial.
Return there after c09/c11: compare live local totals with an explicit server
snapshot, failure retaining the last quote, and recovery.
The runtime naming changes between the page module and endpoint milestones are
covered in the core reference, without inventing extra example stages.

## Setup and use

Basic Python, an editor and a browser are enough for the Python route. Follow the
[core setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md#gc-025-010)
to open a gallery and create a separate editable page. The gallery shows source;
it does not save edits to source files. Python builds Source on its server; the
JavaScript Logic beside it runs in the browser. JS Pages also run on Node/Bun or
in a standalone Worker. After saving a change, reload/reopen as the environment
guide explains. Predict the result first, then explain it using Source and Data.

For example, in c01 changing VAT alone does not recalculate gross; changing
quantity afterwards uses the new VAT. This exercise checks ^ versus =; it is not
a reason to move the lesson out of its release stage.

## Current teaching limits

The catalogue now has 41 lessons: the 38 revised pages and three focused additions.
c15 demonstrates lifecycle, c16 templates/mask and sandboxed srcdoc, and c17 local
Data exchange; b01/c02/c11 add paths, path filtering and Source authorization.
Keys remain stable; the controller menu places c15/c16/c17 before c09 to follow
core 0.2.0 → 0.2.3 → 0.2.5 → 0.2.14, not numeric key order.
The nested-Date initialization extension of c17 is blocked by an owning-library
defect; dates/decimals are not claimed as covered by that page. Mail/HTTP need
explicit actions or environment-owned fixtures. Named resource groups need
genro-kajenn. c08 now includes its bounded later endpoint exercise. D6 checks
qualify the local teaching candidate in the eight documented environments; owner
teaching acceptance remains separate. See the dated qualification record linked
from [the gallery guide](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/010-gallery.md#ge-010-030).
c13/c14 separate the basic trial from advanced cache/error/lifetime exercises.
In c13, “Mounted fragments” counts successful mounts; HTTP calls must be observed
independently. c14 has an explicit read button to distinguish a stored snapshot
from a later response. A startup check alone does not qualify every exercise in an
environment.

The common FileServer gallery has no named resource groups: css_requires,
js_requires and named connect_on handlers need genro-kajenn's resource host.
The Kajenn adapter's auth capability is separate from that resource system.
Authentication allow/deny needs an identity-aware environment; c11 demonstrates
anonymous refusal. Planned lessons are not part of this catalogue until delivered.

The environment controls CSP: a strict named-Logic starter project cannot execute
inline gallery code unchanged. A standalone Worker is not an external server and
does not provide secret storage or database access. Keep these limits visible
when adapting a lesson.
