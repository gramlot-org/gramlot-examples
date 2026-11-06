# Using the gallery

Document ID: **GE-030**.

<a id="ge-030-005"></a>
## 005 · Choose one lesson

Open the [Python gallery](https://gallery-py.gramlot.dev/) or the
[JavaScript gallery](https://gallery-js.gramlot.dev/). Use the navigation tree or
its search field. Search includes branches not yet opened; clearing the field
restores the tree. Choose a result to open its page in a retained tab.

The **Show:** menu at the top of the navigation, above the logo, narrows the tree to the lessons that fit your
environment: **All** lists everything, **Plain** the lessons that need nothing from the server,
**Server** the lessons that call an endpoint, and so on for the other entries. The menu lists only
the filters that match at least one lesson of the gallery you opened. Folders left empty
disappear, a folder left with one entry shows that entry directly, and search works within the
selected filter. The gallery remembers the choice in your
browser.

The root of the tree has tutorial groups first (Fundamentals, Fields and inputs, Data, logic and RPC, Layout and menus, Grid, Charts, Editors and tools, Composition), then the demos (Database demos; Real-time, server and AI demos). A gallery shows only the groups it can fill.

Start with Fundamentals: HTML, Data, value and attribute bindings, styles, Labelboxes, SVG and inspection of Data and Source. Then continue with components, advanced bindings and Logic. Continue to RPC,
containers, menus and composition as needed. The [learning path](../src/gramlot_examples/pages/README.md)
links every topic; it is generated into the manual with the catalogue lessons.

<a id="ge-030-010"></a>
## 010 · Read the three views

- **Example:** interact with the running page. Follow the short instruction above it.
- **Explanation:** understand the mechanism and expected result.
- **Code:** read the Python or JavaScript declaration and any browser Logic.

Use the handle inside Example, Explanation or Code to detach that panel into a
floating window. Arrange the windows side by side to read while trying the example. Closing that
window returns the same panel. The Inspector in the navigation toolbar exposes
Source and Data. A value changing in Data is different from a Source node being
inserted or removed; watch the relevant tree while trying an action.

The public gallery keeps Remote Edit disabled. Editing sample text in a tool is
not permission to save a server file. Closing a page tab releases that page;
switching between open tabs retains its mounted interface.

<a id="ge-030-015"></a>
## 015 · Understand the example's data

A companion `foo_data.tytx` contains the initial Data Bag for `foo.py` or `foo.js`.
It is loaded before rendering. Small interface preferences use `default` on their
bound controls. `dataSetter` remains available for examples teaching explicit
installation writes; it is not required for every bound field.

`default` initializes a missing bound value without overwriting existing Data.
Use `lbl` for a visible field label: the shared labelbox supplies the accessible
association too. Explicit ARIA names remain useful for icon-only actions, SVG
images and landmarks; they do not need an extra visible field label.
Dataset Bags and controller state still need their own initialization.

Some lessons provide Play and Clear. Their instructions explain whether Play
loads values together or replays edits with a short delay. You can always try the
controls yourself. Sample values and local Save actions are not a database.

<a id="ge-030-020"></a>
## 020 · Appearance and screen space

Open Settings from the toolbar. Theme, palette and light/dark mode are separate
choices and are synchronized with example frames without reloading their Data.
The toolbar can occupy the side or bottom; navigation remains a bounded panel.
Use the detach and drawer controls where offered to give an example more room.

<a id="ge-030-025"></a>
## 025 · Documentation playgrounds and servers

The documentation embeds real serverless exports of the JavaScript lessons and
shows both Python and JavaScript source. It does not run Python in Read the Docs.
Open an embedded example in a separate tab for a larger workspace. Use the Python
gallery for Python endpoints and filesystem tools. A browser Worker is not a
place for credentials or a private database connection.

The [Python host manual](https://gramlot-py-server.readthedocs.io/en/latest/)
and [JavaScript host manual](https://gramlot-js-server.readthedocs.io/en/latest/)
provide installation commands. For widgets and shared attributes, use the
[core manual](https://gramlot.readthedocs.io/en/latest/).

<a id="ge-030-030"></a>
## 030 · Maintainers and historical records

The [feature coverage checklist](035-feature-coverage.md) maps components and
shared behaviors to lessons, records gaps and separates teaching coverage from
code quality and browser verification.

The catalogue and lessons live together in this package; hosts consume them
instead of copying their lists. See [the repository map](005-repository-map.md)
for documentation builds and [mobile modules](020-mobile-modules.md) for separately
owned mobile examples. Past implementation notes remain in
[the engineering record](010-gallery.md); they are not current application instructions.

<a id="ge-030-035"></a>
## 035 · Host integration

An adapter reads the common catalogue through `build_gallery()` in Python or
`buildGallery()` in JavaScript. Optional environment catalogues extend it; do not
copy the common lesson list into the host.

The result contains `families`, `routes`, `assets` and `collections`. A route
identifies the Page, optional stylesheet, browser Logic, optional initial Data
companion and its public URL. Stage the same-name companions with the Page and
serve the declared assets at their matching paths. Prepared collection descriptors
must be verified and served through the host's normal collection-resource path.
Only collections required by the selected page enter its bootstrap.

The gallery provides frame theme synchronization and example source views; the
host provides HTTP or Worker transport and enforces its editing permissions.
Use the maintained Python/JavaScript host implementations rather than the older
staging recipes in the historical engineering record. For separately maintained
mobile catalogues, follow [the mobile module contract](020-mobile-modules.md).


<a id="ge-030-040"></a>
## 040 · Explore by feature

Choose **Features**, the last page in the gallery navigation, for a compact capability tree, independent of the lesson chapters.
Select a feature to show its explanation and linked examples, then open an example. It opens in the existing tabs, so
you can switch back to Features without losing a running example or its edits.
The normal lesson tree remains available. Feature labels are neutral until seen,
then green; Tried also has a check mark. A branch turns green when all its
available features have been seen. Its count shows partial progress.

One example can demonstrate several features. Opening it marks all linked entries
**Seen**. Choose **Tried** for each feature you have actually explored, or reset
it to **To discover**. These are personal progress markers, not passed tests.
Progress is stored in the gallery Data Bag and saved in sessionStorage for reloads
within this browser tab's session. It is not saved to an account or server.

Coverage notes are separate from your progress. Missing exercises and quarantined
components have no progress selector. dbSelect and dbComboBox remain in quarantine
until their APIs have been reviewed against the legacy implementation.


<a id="ge-030-045"></a>
## 045 · Public server examples and upload support

The public Python gallery includes **PageStore and WebSocket**, **Kajenn and
Asqueel**, and **Chat**. These are host-specific catalogues; the JavaScript and
file-based galleries do not provide the same Python server endpoints.

The customer lesson uses invented records from the hosted PostgreSQL database.
It can save only the customer name and email. Other columns remain protected,
and Remote Edit remains disabled. PageStore examples demonstrate server binding,
validation and communication between independent pages.

Upload examples are listed, but binary transfer is currently unavailable on the
public Kajenn and JavaScript hosts. A manual upload check on 2026-11-02 returned
**Upload is unavailable in this environment**. Selecting a file is not proof of
upload support. The adapters need a separately verified upload integration;
enabling a capability flag alone is insufficient.


<a id="ge-030-050"></a>
## 050 · Lesson files and minimal code

Each lesson keeps its title, short description and search tags in an adjacent
JSON descriptor. Its Markdown file explains what to try, what changes and why
the declarations work. The catalogue is generated from those descriptors; it is
not an independent source of truth. Python and JavaScript show the same lesson.

A content lesson can declare `"presentation": "content"` in JSON. The shared
gallery wrapper then supplies spacing and the `example-page stack` presentation
in Python, JavaScript and serverless. Its `main(root)` declares only the lesson's
contents. Grid, editor and tool pages keep their own bounded or filling layout;
they do not receive this content wrapper automatically. A wrapper that defines
a Data path, semantic HTML section or layout constraint is still part of the
example.

Index pages introduce a section and are not individual exercises. They may retain
a page title for directory navigation. Likewise, a lesson may explicitly set a
page title when that behavior itself is being demonstrated; title assignment is
not boilerplate required to use Gramlot.

Longer examples retain separate methods and variant groups when they demonstrate
distinct behavior. Removing a variant merely to reduce line count would hide a
feature. Sample Data, component declarations and handlers that produce the
observable result remain available beside the lesson.


<a id="ge-030-055"></a>
## 055 · Charts and their Data

The Charts family separates simple comparisons, temporal snapshots, 3D and maps.
Read its introduction for the engine capability table and Data/configuration model.
Most lessons start with frameGrid: searchOn creates search, chart=True or a type
creates the Chart command. chart_* initializes configuration in the frame's
._chart Data Bag; each chart frame declares its own datapath. Rows come from
storepath and can be shared. Closing the floating chart retains configuration.

Try Bars and live data first. Its integer revenue field changes the same row
shown in the grid and chart. Filter the grid, change the chart type or measure,
and inspect Data. There is no application redraw call. Sample data is adjacent
TYTX; maps use a small fictional GeoJSON dataset, so no database or boundary
service is needed. 3D requires WebGL. Unsupported engine/type pairs are not offered.


<a id="ge-030-060"></a>
## 060 · Lesson view and compact fields

Settings → **Keep view between examples** is enabled by default. Selecting
Example, Explanation or Code carries that view to the next lesson, including
an already open lesson. Disable it to retain each lesson's own selected tab.
The preference persists with the other gallery settings in local storage;
the current and per-lesson views live in the gallery Data Bag. Switching views
keeps the example iframe and its edited Data alive.

The common preview presentation limits ordinary input fields and horizontal
sliders to 28rem, shrinking to the available width on narrow screens. It does
not cap grids, editors or filling panels. Python and JavaScript lesson code
need no extra wrappers or width declarations. The shared preview bridge also
supplies these styles to serverless exports.

Owner confirmation (2026-11-05): “procedi con l’opzione nelle impostazioni,
attiva di default, e rendi più compatte le larghezze degli esempi senza
aggiungere codice inutile.” The view preference is independent of the Multipage option described below.


<a id="ge-030-065"></a>
## 065 · Multipage or one reusable preview

**Settings → Multipage** is enabled by default. Each open lesson retains its
own iframe and Data. Disable it to keep one shared lesson shell, its
Example/Explanation/Code tabs and one preview iframe. Selecting another lesson
changes the iframe URL and replaces its teaching content; unsaved example state
is discarded. The selected teaching tab stays in place. The preference is saved
with the other gallery settings.

Changing mode closes the previous lesson panels and reopens the current choice
in the selected mode. Code and Explanation still load on demand. Their old
Source requests are cancelled before reusing the targets so late responses
cannot overwrite the next lesson. The existing IndexPage navigation, lesson
constructor, guide, content loader and Source request lifecycle are reused;
there is no second navigation implementation.

Owner confirmation (2026-11-05): “aggiungi multipagina true di default […]
contorno e tab restano, si riusa un solo iframe. Va bene perdere lo stato quando
cambio esempio.” Multipage is enabled by default; single-page mode is optional.
