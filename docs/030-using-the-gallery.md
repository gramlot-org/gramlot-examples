# Using the gallery

Document ID: **GE-030**.

<a id="ge-030-005"></a>
## 005 · Choose one lesson

Open the [Python gallery](https://gallery-py.gramlot.dev/) or the
[JavaScript gallery](https://gallery-js.gramlot.dev/). Use the navigation tree or
its search field. Search includes branches not yet opened; clearing the field
restores the tree. Choose a result to open its page in a retained tab.

Start with HTML and SVG, then fields, Data bindings and Logic. Continue to RPC,
containers, menus and composition as needed. The [learning path](../src/gramlot_examples/pages/README.md)
links every topic; it is generated into the manual with the catalogue lessons.

<a id="ge-030-010"></a>
## 010 · Read the three views

- **Example:** interact with the running page. Follow the short instruction above it.
- **Explanation:** understand the mechanism and expected result.
- **Code:** read the Python or JavaScript declaration and any browser Logic.

Use the handle inside Code to detach it into a floating window. Closing that
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
