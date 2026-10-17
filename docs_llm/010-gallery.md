# The gallery package

<!-- Document ID: GE-010 -->
<a id="ge-010-005"></a>

## 005 · Contents

- PyPI `gramlot-examples` (module `gramlot_examples`), npm `@gramlot/gramlot-examples`.
  Depends only on `gramlot` / `@gramlot/gramlot` 0.2.17 or later. No server code.
- Pages `src/gramlot_examples/pages/<family>/NN_name.{py,js}` (each registry its
  language; `NN_name.js` exports `Page` and `Logic`, in both packages) with `.md`,
  `.css`; family READMEs; `catalog.json`.
- Gallery page `gallery/page.py` / `gallery/page.js` + `gallery-page.js`,
  `gallery.css`, built bundle `gallery/dist/`. `gallery/browser/` is not published.
- Theme and logo from the core: wheel `gramlot/resources/{themes,assets/branding}/…`,
  npm exports `@gramlot/gramlot/themes/*`, `@gramlot/gramlot/assets/branding/*`.

<a id="ge-010-010"></a>

## 010 · `catalog.json`

`{"environment"?, "families": [{key, title, examples: [{key, title, folder,
description, explanation}]}]}`. Family folder = family `key`; `folder` = file stem.
The common catalogue has no `environment`; an environment catalogue has one.

<a id="ge-010-015"></a>

## 015 · Keys

- Common: `e01`–`e13`, `b01`–`b11`, `c01`–`c22`. Environment: `<environment>-NN`.
- Keys are stable within a release; 0.2.8 renumbered the controllers after removing
  the remote Source example; 0.2.10 added `c09`–`c11` (`dataRpc`), 0.2.11 added `c12`–`c14` (`remote`,
  `dataRemote`).
- Family keys, example keys and `index` share one namespace.
- Errors: environment in the common catalogue; no environment in an environment
  catalogue; key outside `<environment>-NN`; duplicate key; missing page file.

<a id="ge-010-020"></a>

## 020 · `build_gallery` and `buildGallery`

`build_gallery(catalogs=())`, `buildGallery({catalogs = []})`; `catalogs` = pairs
(environment `catalog.json`, pages folder). Result:

- `families`: all families, each with `path`;
- `routes`: key → `page` (`.py` / `.js`), `stylesheet`, `logic` (`NN_name_aux.js`, else
  `NN_name.js`, else `None`; the server reports both); `index` = gallery page;
- `assets`: URL → `file`, `type` (theme, logo, `/gallery/gallery.css`,
  `/gallery/dist/*`, `/pages/<family>/<file>`). Only `gallery/dist/*.js` is
  `application/javascript`.

Nothing is written or served.

<a id="ge-010-025"></a>

## 025 · Serving a gallery from an environment

1. Stage one module per example key: extend the Page, append
   `script(src="/gallery/dist/frame.js")`.
2. Copy `stylesheet` beside it as `<key>.css`; serve `logic` as JavaScript and stage
   `<key>_aux.js` = `export {Logic} from "<its URL>";`.
3. Stage `index` as a gallery page subclass with `catalogs`, and `logoUrl` /
   `galleryScript` when served elsewhere (e.g. under the mount); same names and defaults
   in `page.py` and `page.js`.
4. Serve `assets` with their media types; a server that links `Page.css` under its mount
   (`/py/themes/…`) serves the stylesheets under the mount too.

Gallery commands that follow these steps: `gramlot <environment> gallery`
(`gramlot-py-server`, extra `gallery`); `gramlot node|bun gallery`
(`@gramlot/gramlot-js-server`); `gramlot-serverless gallery <folder>`
(`@gramlot/gramlot-serverless`, a static folder opened from disk). The earlier runner
(`runner/serve.py`, `server.mjs`, `build-standalone.mjs`) remains only in the history
of this repository.

<a id="ge-010-030"></a>

## 030 · Gallery page behavior

- Introduction first; title list by family; one tab per opened example: README,
  resizable preview, source tabs; Python adds a `logic.js` tab for the nonempty Logic class, JavaScript a tab only
  for an `NN_name_aux.js`.
- Explicit IDs (`open-e01`, `tab-e01`, `panel-e01`, `divider-e01`, `index-theme`);
  `gallery/browser/` connects events; page-local Bag for tabs, keyboard, theme, split.
  [Gramlot constitution](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md):
  exception recorded by 11.44 for the runner in the core; 11.56 supersedes it, the
  gallery left the core for this repository.
- Keyboard navigation, collapsible/resizable sidebars, light/dark theme passed to frames.

### Learning with the gallery

The [shared reading route](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/README.md)
follows core release chronology and identifies missing advanced exercises. A page
may return in a later stage to compare the code replaced by a new feature;
prerequisites are supporting links. Preserve the earlier stage and label each
revision. Maintained catalogue entries are not historical package snapshots.
The gallery displays source; it does not edit/save page files. Open an editable
project through the chosen environment and compare a predicted result after reload.
Page executes in the Python/JS host (or Worker); Logic executes in the browser.

Check the installed catalogue before interpreting test counts: the current source
lists 45 common pages, but older installed packages can have fewer. A startup
check is not a check of every explained behavior. Follow the environment's setup
instructions to update both examples and core, then restart or rebuild the export.

The lesson pages open with a brief description of what is on the page,
what it teaches and which library features it uses. Family introductions state
the feature boundary of each release stage; later additions are explicitly labelled.
The original guided trials, exercises, prerequisites and limits remain available
inside a closed native **More detail** disclosure. Reading them is optional.
This keeps the preview readable without discarding the detailed teaching material.
The Markdown is shared by both language galleries; the paired manual records the
teaching policy. Example and core release numbers remain independent.

c13 counts mounted fragments separately from transport observations; c14's named
read action copies the current stored value while the resolver may load a later
response. These are bounded teaching changes. c15/c16/c17 add lifecycle, projection and
local Data exchange. They precede c09 in the menu to preserve release order while
keeping every older key stable. The owner deferred the Date/Decimal extension pending
[Bag #69](https://github.com/genro-org/genro-bag/issues/69); the current lesson
uses the verified types and this omission no longer blocks teaching acceptance;
named resource groups need a separate host and mail/HTTP need environment fixtures.
c08 preserves the local 0.2.0 story and now adds a separately labelled 0.2.14
quote/result/error trial, to revisit after c09/c11. Inputs alone make no quote
request; success updates the snapshot and clears errors, failure retains the
previous quote. Its independent exercise changes only the endpoint's delivery
charge. The dated D6 qualification record in
[GC-070 §775](https://github.com/gramlot-org/gramlot/blob/main/docs/internal/070-work-status.md#gc-070-775)
distinguishes local candidate teaching packages, installed dependencies and owner
teaching acceptance. It is historical qualification evidence. The later integrated release includes
the cache corrections; see the repository README for the published version.

The c15–c17 lessons are included in the published package. Their stage labels
refer to core features, not the independent version of the examples package.


Source tabs follow the environment: Python servers show the Python Page;
JS/Worker servers show the JavaScript page module, which may also export Logic.
A Python application can attach a JS file containing only its browser Logic;
the shared Page/Logic modules in this catalogue are an examples-authoring choice,
not a requirement on Python applications.

The optional second tab is **logic.js**. For the shared examples it shows only
the final exported `Logic` class, with the originating filename on hover. It is
a class excerpt, not a renamed or newly created file. Empty Logic classes have
no second tab. JS page modules already display their own Logic; a separate
companion, when present, uses the second tab. The shared examples place Logic
last; tests compare each excerpt with the exported class's own source to enforce
that layout. This presentation uses no parser or extra dependency and does not
change module loading. Source-tab switching preserves previews and scroll;
arrows, Home and End navigate the visible tabs. Ordinary per-example IDs follow
the existing gallery convention, with no core component or marker.

The full-width footer has a small **Settings (⚙)** button and **Inspector (🔍)**.
Settings opens a native popover with Theme (Base, Compact, mimi, GenroPy
Gioanna), Color mode (Light/Dark), Keyboard navigation, Label position and Install
app. Escape, the close button or an outside click dismiss the popover without
changing the workspace size. Compact and Light are the defaults.

Theme and color apply independently to the shell and its previews. The generated
appearance map embeds canonical core CSS; the Source-owned style value is replaced
when switching profiles. Direct example pages keep their declared `Page.css`.

Label position is a gallery preview override for labelled input components. It
updates their Source `lbl_position`, never their DOM or application Data. **As in
the example** restores the original declarations, including pointers. This choice
is remembered per origin and gallery path. The Textbox/labelbox lesson retains its
local selector to teach reactive positioning; other lessons avoid repeating it.
The example-specific controls (live editing, readonly, columns) remain in the
lessons where they explain the component. No generic settings are invented for them.

The navigation sidebar starts at 240px. Its vertical
separator supports pointer dragging and Left/Right (10px), Home and End keys,
independently of the navigation keyboard checkbox. It is bounded between 120px
and the smaller of 460px or 60% of the viewport. Resizing the viewport clamps the
visible width; switching lessons or themes preserves it. Theme, color mode and
both sidebar widths and their visibility are saved in browser localStorage and restored on reload.
Preferences are separate per origin and gallery path (so Python and Node on different
ports keep independent choices). A narrow viewport limits the visible width without
overwriting the preferred width. Invalid saved values are ignored. If the browser
denies storage or its quota is exhausted, controls still work for the current page;
reload persistence is unavailable, including file exports where the browser disallows
localStorage. Source owns the controls and ARIA values; the local Bag owns current
interaction state. Only display preferences are stored, not example data.
Pointer capture and listeners are released during cleanup.
The top toolbar shows the gallery title and Navigation/Code toggles. Closing either
sidebar returns its space to the example without reloading it. The code sidebar
starts at 420px, resizable from 200px to 60% of the viewport. Its separator supports
pointer dragging and Left/Right (10px), Home and End; Left enlarges the right pane.
Introduction and category pages have no code: the Code toggle is disabled there.
Returning to an example restores the visibility preference and selected source tab. Long navigation labels may wrap;
the explanation occupies at most 28% of viewport height, leaving room for the
preview and source.

Server setup quick starts belong to the integration documentation, not gallery
sections. Default Python and Node/Bun galleries contain the common examples;
standalone additionally retains Registration form. Explicit environment catalogues
remain supported for application examples.

<a id="ge-010-035"></a>

## 035 · Checks

`npm run build`, `npm test`, `bun test ./tests`, `python -m unittest discover -s tests`.
Browser (CI `browser`): `serve_pages.py` / `serve_pages.mjs` (core `GramlotFileServer`) +
`verify_pages_browser.mjs` (every catalogue entry, both languages; fail on missing
behavior coverage; static structure, bindings, Logic, lifecycle, file exchange,
endpoints of c08–c11/c14 and fragments of c12/c13). Exported
`verifyExample(page, key, calls)` reuses these checks in integrations; `calls` holds
observed request envelopes, separate from fragment mounts
+ `verify_e10_e13_browser.mjs`. The gallery commands are checked in a browser in the
server repositories.
Fixture catalogue: `tests/fixtures/environment/`.

`node scripts/verify_gallery_browser.mjs <gallery-URL> [...]` checks every common
lesson in delivered galleries: primary source visible height/width, a single
selected source, switching/keyboard, scroll preservation and retained previews.
Run it against Python, JS and Worker galleries after changing their presentation.

<a id="ge-010-040"></a>

## 040 · Release

Same version in `pyproject.toml` and `package.json`. `publish.yml` by hand on the tag
on `main`: validate, `tests.yml`, build, bundle check, GitHub release with
`SHA256SUMS`, PyPI and npm with trusted publishing (environment `release`).


<a id="ge-010-042"></a>

## 042 · Try the inspector here

This playground runs the JavaScript **Pointers** example entirely in your browser.
Read the Docs serves the page, its Worker and all Gramlot assets together with
this manual; no external CDN or application server is needed. The block contains
only the example and its small 🔍 Inspector button, with no gallery navigation or code pane.
Every lesson in this manual has the same kind of block for its own example.
Endpoint and remote-fragment lessons run their page methods in the browser Worker.

1. Change **Caption**, then leave the field: the heading follows the Data.
2. Open **Inspector** with 🔍 above the example. Select **Data**, expand
   `settings` and select `caption` to see its value. Edit that value in the
   Properties grid and press Enter: the example updates in the other direction.
3. Switch to **Source** to inspect the declarations behind the rendered page.

Reloading resets the playground. On a small screen, open it in a separate tab.

```{raw} html
<p><a href="../playgrounds/b01/index.html" target="_blank" rel="noopener">Open the inspector playground in a separate tab</a></p>
<iframe src="../playgrounds/b01/index.html" title="Gramlot Pointers and inspector playground"
        width="100%" height="620" loading="lazy" style="border: 1px solid #ddd;"></iframe>
```

In the full gallery, the **Inspector** footer button opens one floating palette in the gallery shell.
Its selector offers the shell and the visible example; changing the gallery tab
selects the new example. You can inspect the shell while an example remains open,
and on Introduction. Close also clears the footer button.
The right −/+ title-bar button beside Close collapses/expands the palette without losing size,
selection or breakpoints; live updates continue while collapsed. The left-aligned
title and compact tabs use the same text scale as the tree.

Click a Data or Source node to edit its scalar value or attributes in the Properties
grid. Leaving a row or pressing Enter saves; Escape reloads. The + button adds an
attribute and the hover trash icon removes one. External changes block stale drafts.
The inspector never resolves lazy Data. Bag branches, arrays, Decimal, resolver
values and internal metadata remain protected. No keyboard shortcut is assigned.

The grey outlined circle to the left of a tree row appears on hover or keyboard focus when inactive. Set breakpoints stay visible: red without a condition, yellow with a condition.
It opens that path's breakpoint dialog without selecting the row. Debugger pauses
in the browser developer tools; Console logs the event. Conditions use `evt`, `node`,
`value`, `oldvalue`, `attrs_diff`, `reason` and `path`, compiled under the inspected
page's CSP. Invalid or blocked conditions do not replace an existing breakpoint.
The Properties counter opens the active list. Switching targets preserves each
page's breakpoints; closing the palette or reloading that page clears them.

Python, Node and direct-file serverless use the same optional tool and gallery
assets. Dedicated MessagePorts connect explicitly registered frames to the shell;
the target page executes edits and breakpoints on its real Bags. The palette uses
passive copies, with node identity/revision checks before writes. Window readiness
and connection messages validate the owning parent/frame. Each bundle reuses its
running runtime's classes and embeds the styles. Rebuild the core package before
the gallery browser assets when working from local checkouts.


<a id="ge-010-045"></a>

## 045 · Reuse the index and install the gallery

The gallery extends the core `IndexPage`: grouped
navigation, iframe tabs, the sidebar splitter and the standard footer are reusable
without importing gramlot-examples. The gallery adds its README/source panels and
inspector. See the [Python-first index guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/095-writing-pages.md#gc-095-110).

The root enables `installable` and uses the core's 512×512 PNG app icon, included
in the gallery asset map. Python and Node expose `app.webmanifest`; the serverless
gallery export includes that file. Only the root links it. Theme, color mode and
sidebar-width preferences retain the gallery's existing storage key.

**Install app** in the footer explains browser installation and displays an
Install button when the browser offers a prompt. Safari on macOS Sonoma or later
uses File → Add to Dock. Keep the Python/Node server available; for serverless,
serve the exported directory over HTTPS or localhost. Direct-file execution still
works, but is not the installation route. No offline cache or service worker is
added. Installation is a browser action chosen by the user.


Lessons c18/c19 (introduced in core 0.2.18) revisit c06 with page/self topics,
authored references, native ask and direct parent/child postMessage. They require
core 0.2.18 or later. Earlier release
lessons remain unchanged. See their short introductions and More detail exercises.


c20 completes the core 0.2.18 action/ask/reference lesson: action + ask,
`_ask_if`, dictionary `_if`, legacy `askIf`, and explicit local Source/DOM references.
c21 follows it with the core 0.2.19 additions: plain `html_button` and
button `_delay` with grouped click counts. It requires core 0.2.19 or later;
0.2.18 does not provide these two additions. Both lessons have
Python and JavaScript pages with a shared Logic companion and browser checks.


Development verification (2026-10-15): c20/c21 passed in Chromium and WebKit
against Python and Node pages and direct-file serverless exports. The updated
manual covers 45 lessons, with strict Sphinx and local-link checks passing.
These additions are included in core 0.2.19. No native Safari or Firefox result is claimed.

<a id="ge-010-050"></a>

## 050 · Updating packages versus rebuilding checkouts

Block ID: **GE-010-050**.

The gallery's browser bundles include the footer inspector. Its source is in the
core, but the gallery builds it into `src/gramlot_examples/gallery/dist/`.
Consequently, pulling Python files or the core alone does not refresh an already
built inspector. This applies even when Python serves the gallery.

For **registry installations**, use the
[Python package update](https://github.com/gramlot-org/gramlot-py-server/blob/main/docs/020-command.md#gp-020-025)
or [npm/serverless update](https://github.com/gramlot-org/gramlot-js-server/blob/main/docs/010-tutorial.md#gn-110-035).
Those packages ship the build output; their users do not need to rebuild it.

For **source development**, stop the server and update each checkout from its
chosen branch (`git pull --ff-only` on a clean, already selected branch). Resolve
local changes deliberately; do not reset them. The following assumes sibling
`gramlot/`, `gramlot-examples/` and server repositories, and Node.js 22 or later.
Run the blocks from the stated directories, in this order.

**1. Core, from `gramlot/js/`:**

```sh
npm install --package-lock=false
npm update --package-lock=false @genrojs/bag @genrojs/builders @genrojs/tytx
npm run build
```

This builds the runtime and optional inspector artifacts, including browser
resources used by the Python core. Stop on build failure before continuing.

**2. Examples, from `gramlot-examples/`:**

```sh
npm install --package-lock=false
npm install --no-save --package-lock=false --install-links=false @gramlot/gramlot@file:../gramlot/js
npm run build
node --input-type=module -e "console.log(import.meta.resolve('@gramlot/gramlot/page'))"
```

The local link is for development only; do not save a filesystem dependency in
`package.json`. Run this step after a core inspector/theme change as well as after
a gallery change. The build emits `gallery.js`, `frame.js` and `inspector.js`;
`git pull`, `pip install -e` and a browser refresh do not run it for you.

**3a. Python host:** in the virtual environment used by the Python server,
from the directory containing the sibling repositories:

```sh
python -m pip install --upgrade "gramlot-py-server[uvicorn,gallery]"
python -m pip install --upgrade -e ./gramlot -e ./gramlot-examples
python -m pip check
python -c "import sys, gramlot, gramlot_examples; print(sys.executable); print(gramlot.__file__); print(gramlot_examples.__file__)"
python -m gramlot_py_server.cli uvicorn gallery --port 8080
```

This core/examples development setup updates the published Uvicorn adapter first.
For another adapter, keep its extras and command, plus your port/mount options. The core
build in step 1 is necessary for editable Python sources too.

**3b. Node/Bun or serverless host, from `gramlot-js-server/`:**

```sh
npm install --package-lock=false
npm install --no-save --package-lock=false --install-links=false @gramlot/gramlot@file:../gramlot/js @gramlot/gramlot-examples@file:../gramlot-examples
node --input-type=module -e "console.log(import.meta.resolve('@gramlot/gramlot/page'))"
node server/src/cli.mjs node gallery --port 8080
```

The core path printed here must be the same as in step 2. Different physical
copies can fail a Page subclass identity check even if their version numbers
match. Reapply the local links after npm operations that replace them; do not
change runtime type checks to hide the mismatch. For Bun, select `bun` in the
host command. For serverless, replace the host start with:

```sh
node serverless/src/cli.js gallery gallery-updated
```

Open the newly generated export; previous exports remain unchanged. Finally,
reload the browser and verify a lesson's behavior and the inspector tabs using the
[update checklist](https://github.com/gramlot-org/gramlot/blob/main/docs/public/018-quickstart.md#gc-018-025).
If the check fails, include the exact commands, resolved paths and installed
versions in the report; restarting the browser cannot correct an old bundle.


<a id="ge-010-135"></a>
## 135 · Pointer templates and expressions

Lesson c22 follows c21 without changing earlier release stages. It
revisits CSS width with `:{}px`, read-only state with `:=!{}`, and formatted text
with `format`/`mask` before introducing expression-local `_F` for a title attribute.
Python and JavaScript twins keep the same Data and interactions. This lesson
requires core 0.2.20 or later.

<a id="ge-010-140"></a>
## 140 · Input components

The **Input components** section follows the earlier native HTML,
binding and controller examples. w01 shows two textboxes sharing one value and live
editing; w02 distinguishes the field lbl from the checkbox label; w03 keeps the
codes of two radioButtonText groups independent. These let you move the label. w04 adds multiline text (`textBoxArea`), w05 password
entry (`passwordbox`), w06 separate boolean `radioButton` controls, w07 a
`colorpicker`, and w08/w09 horizontal and vertical sliders sharing numeric Data.
The new cards are capped at 24rem and fit narrow screens. Each lesson explains
its native control, shared value, live/commit policy and current limitations.

The application explicitly selects `inputs` in `gallery/collections.py` and
`gallery/collections.js`. Both use the generated metadata of the core collection;
Python reads JSON and JS calls toDocument(). `build_gallery`/`buildGallery` returns
`collections` entries with `grammar` and `module`, alongside families, routes and
assets. Hosts pass these to the core server. `npm run build` generates the separate
browser `gallery/dist/inputs.js`. The source examples need no loading boilerplate.

Install the current core, examples and host packages together using the update
procedure in §050. For a checkout, rebuild both the core runtime and
this package's browser assets and restart the gallery. The static gallery must be
exported again. The standard gallery commands keep their existing syntax.

`node scripts/verify_components_browser.mjs PLAYWRIGHT_ENTRY PYTHON_URL NODE_URL STATIC_URL`
checks all nine pages and the gallery iframe in Chromium and WebKit, including
radio arrow navigation, real slider drags and compact layout at 360px. STATIC_URL
may be the file:// directory URL of an exported gallery. This checks runtime
behavior, keyboard interaction and compact presentation.


<a id="ge-010-145"></a>
## 145 · Typed input editors

w10 **Number editing** demonstrates locale comma input, integer limits and an
exact Decimal beyond JavaScript Number precision. w11 **Date editing** accepts
calendar dates and words such as `oggi`/`domani`, with a fixed workdate for a
repeatable lesson. w12 **Time editing** demonstrates hours, minutes, seconds and
milliseconds. They reuse labelbox, reactive labels, readonly/live controls and
24rem cards. Their Python pages initialize Decimal/date/time; the JS twins carry
the same typed values. The numeric JS page imports Bag inside its async Page.main: typed initialization
runs on the host, while the same module supplies an empty client Logic.

Invalid text remains visible with an error and does not overwrite Data. Empty
input writes null. Enter/change commit; Escape cancels; live editing commits only
complete valid values. These are text editors with Gramlot formatting, not native
number/date/time pickers. This increment does not add the full validation engine.
See the core component guide for parsing rules and type/precision limits.

Portable collection JSON now uses TYTX dtype signatures. Development installs
need the matching Builder JS/Python changes, core and rebuilt browser assets;
these changes have not been published as packages yet. Existing install/update
instructions apply once the coordinated versions are published.

`node scripts/verify_typed_components_browser.mjs PLAYWRIGHT_ENTRY PYTHON_URL NODE_URL STATIC_URL`
checks all three lessons in Chromium and WebKit: localized typing, invalid drafts,
null, exact Decimal, date words, time precision, labelbox, readonly and 360px layout.
This complements the first-nine-controls browser test in §140.


<a id="ge-010-150"></a>
## 150 · Local and callback choices (0.3 development)

w13 Filtering select adds searchable local code/caption pairs; w14 Callback select
searches 100 random samples generated once into a Data Bag by named browser Logic.
Both Python-first pages have JS twins, shared labelbox, readonly controls and
compact fields. Native HTML select remains unchanged. Follow the same progression
as the collection: first learn values, then replace the local source with a callback.

A selection stores its string code, while its caption appears in both bound fields.
The callback receives _querystring or _id and returns {rows, identifier, caption},
synchronously or as a Promise. Random values do not change on each search. No
network endpoint is used. Unknown text cannot overwrite the current code; clearing
commits null. Keyboard navigation, errors and pending-response cleanup belong to
the shared component. See the core component guide GC-105 §055 for the full contract.

The gallery still requires the coordinated development core and generated inputs
collection; this is not a package release. Reload the gallery to see both lessons.
`node scripts/verify_choice_components_browser.mjs PLAYWRIGHT_ENTRY PYTHON_URL NODE_URL STATIC_URL`
checks both pages on Chromium and WebKit, including keyboard/mouse selection,
code/caption synchronization, invalid/null edits, random-data stability, labelbox,
readonly and 360px layout.


<a id="ge-010-155"></a>
## 155 · Free text and multiple local choices (0.3 development)

w15 Combo box continues the local-choice lesson: suggestions help typing, while
unlisted text remains valid. Its value is text, including the caption of a selected
suggestion; empty edits write an empty string. Compare w13's constrained code.

w16 Checkbox group uses checkBoxText for several selected codes, stored as a
comma-separated string or null when all options are cleared. Two groups share
the same Data value. Change columns, label position and readonly without replacing
the retained controls. This is the inline group; popup/store-backed choices are
not included. Both lessons are Python-first with JS twins and compact cards.

The same selected inputs collection supplies both controls. Source checkouts
require rebuilt core/collection and gallery assets; no extra library is needed.
`node scripts/verify_local_choices_browser.mjs PLAYWRIGHT_ENTRY PYTHON_URL NODE_URL STATIC_URL`
checks both lessons in Chromium and WebKit for all three environments: free text,
suggestions, synchronized codes, null/empty, keyboard, readonly, labelbox and
360px layout. Core GC-105 §§060–065 documents the contracts.


<a id="ge-010-160"></a>
## 160 · Date calendar and optional popup

**w17 · Date calendar** shares a civil D value between an inline dateCalendar, a dateTextBox with its default popup, and a text-only dateTextBox (`calendar=False`). All three use the existing Data binding. Cards are limited to 24rem, fields to 14rem. The lesson demonstrates selection, null clearing, fixed workdate, readonly and reactive labelbox positions. **w11 · Date editing** also compares the popup and text-only variants.

Use Alt+Down to open the popup, Escape to close, and arrow keys to navigate days; Enter/Space select. Home/End move within a Monday-first week and PageUp/PageDown browse months. Browsing alone leaves Data unchanged. Month/day captions follow the page locale. Calendar UI commands remain English until localization is implemented. No date ranges, date constraints or time popup is implied.

Reproducible browser verification is in `scripts/verify_calendar_components_browser.mjs`: pass the Playwright module path followed by gallery base URLs, including a `file://` export. Chromium and WebKit cover the same Python, Node and serverless lesson.


<a id="ge-010-165"></a>
## 165 · Required values and length

**w18 · Required values and length** compares an editable draft with the last accepted Data value. A required name must have 2–8 characters, an optional note has only a maximum length, and a required numeric field demonstrates that zero is valid. Invalid edits remain visible with a shared message; correcting them updates the Data and the second view. The live switch compares input-time validation with ordinary change/blur confirmation.

Uses validate_notnull, validate_len and their *_error messages, shared labelbox and compact cards. Rules belong to Gramlot; compatible native required/custom validity supports presentation without native maxlength truncation. This lesson adds no form/save engine or remote validator.

`scripts/verify_input_validation_browser.mjs` verifies the same interaction in Chromium and WebKit across Python, Node and the file:// export.

Validation presentation (w18): invalid fields stay red, with a temporary floating
message that does not move the layout. Focus/hover shows it again; Escape hides
it. Dismissal does not clear the error or change the last valid Data.


The Theme selector also includes **mimi** and **joanna**.
These compact profiles adapt the legacy Mimi/Joanna light palettes, with separate
Gramlot dark adaptations. The selected appearance reaches input shadow roots,
calendar and choice popups, labels and error messages. Existing preferences retain
the choice. See the [core theme guide](https://gramlot.readthedocs.io/en/latest/public/096-themes-and-css.html#gc-096-017)
for application CSS paths and shared tokens.


<a id="ge-010-170"></a>
## 170 · Normal and mobile previews

Block ID: **GE-010-170**.

Use **Normale / Mobile** above the running example. Mobile keeps the same iframe,
constrains its width to 390 CSS pixels (or the available space), and activates
Gramlot touch sizing. Normale restores the available width and automatic device touch sizing.
Switching preserves accepted Data, rejected drafts and the running page; changing
lesson tabs also retains each preview choice. Preview mode is session-only.
The Mobile button's tooltip reports Page.devices when declared; unspecified does
not mean incompatible. w01, w17 and w18 demonstrate declarations.

Themes and light/dark mode remain independent. The same bridge and preview work
with Python, Node and serverless exports. This checks layout and control sizing;
it does not emulate the mobile keyboard, OS dialogs or actual touch gestures.
Standalone examples automatically use touch sizing when the primary pointer is
coarse. See the [component guide](https://gramlot.readthedocs.io/en/latest/public/105-components.html#gc-105-080).


<a id="ge-010-175"></a>
## 175 · Aligned left labels

Block ID: **GE-010-175**.

Selecting **L** in the gallery settings gives labelled components a shared 8rem
label column, right-aligned label text and a flexible control column. The preview
unifies outer/label padding and lets control containers fit the remaining width,
so examples with different authored padding still align, including Mobile view.
This uses existing labelbox attributes through the gallery's Source override; it
is not a formlet and does not measure the longest label.

Choosing another position restores authored widths and padding while applying the
new label position. **Example** also restores the original lbl_position, including
a reactive pointer. Repeated settings messages do not overwrite the saved source
declarations. Fields and accepted Data are not rebuilt or reset. The dedicated
labelbox lesson's own position control continues to demonstrate its authored
layout when the gallery override is set to Example.


<a id="ge-010-185"></a>
## 185 · Formlet, groupBox and switch examples

The gallery activates the inputs and layout collections together. w19 demonstrates
formlet columns, shared left-label widths and an explicit field override; layout
changes retain the field instance and uncommitted draft. w20 combines a responsive
formlet with groupBox: the header copies its Data scope as TYTX, or values-only
JSON from its menu. Browser clipboard permission is required; denied copies
report an error without changing Data. w21 compares checkbox and switch variants
bound to the same boolean, including readonly/disabled and keyboard interaction.
All three are Python-first, have matching JavaScript pages, and run on Python,
Node and serverless. The gallery label-position preview applies to input fields,
leaving group headings independent. Normal/Mobile keeps the same page and Data.


<a id="ge-010-190"></a>
## 190 · Builder alignment and whole-gallery checks

The c16 attribute-projection lesson uses explicit pointer templates: `title="^.name:Customer: {customer}"`. A named slot reads current Source attributes without consuming them. Ordinary `${customer}` is literal text; use `:` for templates and `:=` for typed expressions. The Data-srcdoc preview remains sandboxed.

After updating dependencies and building the core/gallery, the complete catalogue can be checked in real browsers with:

```sh
node scripts/verify_all_gallery_pages_browser.mjs /path/to/playwright/index.mjs http://127.0.0.1:8205/ http://127.0.0.1:8207/ http://127.0.0.1:8212/
```

Pass your running Python, Node and exported-serverless gallery URLs. The verifier opens the index and every catalogue example in isolated Chromium and WebKit pages, waits for startup requests, checks rendering and collects errors. The component-specific browser scripts additionally exercise editing, choices, validation, calendars, layouts and commands; startup checks do not replace those interactions.

<a id="ge-010-195"></a>
## 195 · Command components preview

Lessons w22–w24 cover button versus html_button, a boolean toggle with LED, and one split dropdown. Normal menu selection executes only; Shift+selection also changes the main command and caption. With persist enabled, a stable id scopes the saved item code to this page. The three lessons use compact layouts and the same Source/Data behavior in Python, Node and serverless. Button bars remain deferred.


<a id="ge-010-200"></a>
## 200 · Automatic formlet labels

Component lessons group related fields in formlets. Choosing Left in gallery settings changes only lbl_position: it does not inject label widths, CSS tracks or padding overrides. The library measures the widest label per rendered column and keeps the controls aligned. Labels remain right-aligned with a small theme-controlled gap; authored field padding and explicit styling are retained. Changing columns, resizing the preview or changing labels preserves the current fields and Data. Use lbl_width only for a deliberate explicit override, not to obtain normal alignment. See the core component guide GC-105 §085.


<a id="ge-010-935"></a>
## 935 · Validation playground — 2026-10-17

Lesson w25, “Validation rules and callbacks”, groups varied widgets inside one labelled groupBox and one compact formlet. It demonstrates required text/date/selection, text length, numeric bounds, normalization, warnings, conditions and local/asynchronous endpoint callbacks. Expand Accepted Data to compare stored values with rejected drafts. Left labels align automatically without fixed widths. Python and JavaScript pages share the same example.

Verified with 96 JavaScript and 16 Python gallery tests and Chromium/WebKit interaction checks, including the actual Python endpoint. This is a local development example, not a new publication.

The w25 group copy control exports the accepted `profile` Bag: TYTX by default, JSON from its menu. Invalid drafts are not copied. Both copy formats and the existing validations were checked in Chromium and WebKit.


<a id="ge-010-055"></a>
## 055 · Hosted gallery download

Block ID: **GE-010-055**.

Hosted Python and Node galleries can display a footer link to a serverless ZIP.
Pass `--serverless-download /downloads/gramlot-gallery-serverless.zip` to
`gramlot uvicorn gallery` or `gramlot node gallery`. The deployment serves that
static file; the gallery does not generate an archive per request. Omit the option
when no archive is available. Custom gallery subclasses use
`serverless_download_url` (Python) or `serverlessDownloadUrl` (JavaScript).

Build the archive with `gramlot-serverless gallery OUTPUT`, include the complete
output directory, and tell users to unzip it and open `index.html`. Both hosted
galleries may serve the same artifact: Python server execution is not embedded in
the download; the serverless gallery uses the JavaScript equivalents and browser
Workers. Its named endpoints execute locally, without a Python or Node server.

The public [Python gallery](https://gallery-py.gramlot.dev/) and [Node gallery](https://gallery-js.gramlot.dev/) offer the same offline archive. Successful stable releases of any of the four product repositories trigger a coordinated rebuild, checked every ten minutes. Both galleries and the ZIP are verified before promotion; failure keeps the preceding deployment. [Deployment runbook](https://github.com/gramlot-org/gramlot-examples/blob/main/deploy/galleries/README.md).


<a id="ge-010-205"></a>
## 205 · Responsive gallery on phones and tablets

Block ID: **GE-010-205**.

Below 1024 CSS pixels, the gallery offers **Esempio**, **Codice** and
**Inspector** as separate views. The example and source each use the full width;
Inspector fills the content area. The menu button opens navigation over the
current view. Selecting a page, tapping the backdrop or pressing Escape closes
navigation. The drawer supports keyboard focus and makes the covered view inert.
Code is unavailable on introduction/category pages; Inspector can inspect the
shell as well as the current example.

Views hide their existing panels: no iframe is moved, reloaded or replaced.
Accepted Data, rejected field drafts and the running example survive switching.
The same inspector remains mounted and keeps its selected target/node; normal
editor behavior still applies (leaving a property row commits it). Desktop
navigation/code visibility preferences are restored when returning to a wider
window. Open pages remain reachable through navigation on mobile.

The **Normale / Mobile** preview controls are shown on desktop only. On a phone,
the example already occupies the device width. Normale uses automatic device
pointer detection for touch sizing; an explicit Mobile preview forces it on.
This does not make every authored example responsive: its own component layout
must also fit the available space. Python and Node share these behaviors and the
serverless gallery uses the same bundle. No separate mobile copy of a lesson or
its Data is created.

The hosted bootstrap declares `width=device-width,initial-scale=1`, as the
serverless bootstrap already does. The inspector must come from a core build
that supports dynamic `docked` presentation; ship the updated core and examples
together. `scripts/verify_gallery_mobile.mjs PLAYWRIGHT_ENTRY PYTHON_URL NODE_URL`
checks both engines and hosts, identity/Data retention, inspector editing,
rejected drafts, navigation and the desktop round trip.
