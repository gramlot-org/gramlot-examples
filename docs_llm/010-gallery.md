# The gallery package

<!-- Document ID: GE-010 -->
<a id="ge-010-005"></a>

## 005 · Contents

- PyPI `gramlot-examples` (module `gramlot_examples`), npm `@gramlot/gramlot-examples`.
  Depends only on `gramlot` / `@gramlot/gramlot` 0.3.6 or later. No server code.
- Pages `src/gramlot_examples/pages/<family>/NN_name.{py,js}` (each registry its
  language; `NN_name.js` exports `Page`, and `Logic` when the page names client methods, in both packages) with `.md`,
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
   `<key>_aux.js` = `export {Logic} from "<its URL>";` (`export * from` also serves a module
   without `Logic`).
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
a class excerpt, not a renamed or newly created file. A module without `Logic`, or with
an empty one, has no second tab. JS page modules already display their own Logic; a separate
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
the same typed values. The numeric JS page imports `createDecimal` from `@gramlot/gramlot/page`: typed
initialization runs on the host, and the module names no client Logic.

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

Use **Normal / Mobile** above the running example. Mobile keeps the same iframe,
constrains its width to 390 CSS pixels (or the available space), and activates
Gramlot touch sizing. Normal restores the available width and automatic device touch sizing.
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

The gallery index no longer displays the serverless ZIP link, including when a
deployment supplies a download URL. Owner decision, 2026-10-18: “lo toglerei”.
This replaces the previous footer-link presentation; archive generation and the
deployment's download endpoint remain available independently of the index.

Build the archive with `gramlot-serverless gallery OUTPUT`, include the complete
output directory, and tell users to unzip it and open `index.html`. Both hosted
galleries may serve the same artifact: Python server execution is not embedded in
the download; the serverless gallery uses the JavaScript equivalents and browser
Workers. Its named endpoints execute locally, without a Python or Node server.

The public [Python gallery](https://gallery-py.gramlot.dev/) and [Node gallery](https://gallery-js.gramlot.dev/) offer the same offline archive. Successful stable releases of any of the four product repositories start a coordinated rebuild directly from CI after publication completes. Registry propagation is handled by bounded retries; there is no periodic release poll. Both galleries and the ZIP are verified before promotion; failure keeps the preceding deployment. [Deployment runbook](https://github.com/gramlot-org/gramlot-examples/blob/main/deploy/galleries/README.md).


<a id="ge-010-205"></a>
## 205 · Responsive gallery on phones and tablets

Block ID: **GE-010-205**.

Below 1024 CSS pixels, the gallery offers **Example**, **Code** and
**Inspector** as separate views. The example and source each use the full width;
Inspector fills the content area. The menu button opens navigation over the
current view. Selecting a page, tapping the backdrop or pressing Escape closes
navigation. Expanding, collapsing or selecting a section keeps navigation open,
so its examples remain reachable without reopening the menu. The drawer supports
keyboard focus and makes the covered view inert.
Code is unavailable on introduction/category pages; Inspector can inspect the
shell as well as the current example.

Views hide their existing panels: no iframe is moved, reloaded or replaced.
Accepted Data, rejected field drafts and the running example survive switching.
The same inspector remains mounted and keeps its selected target/node; normal
editor behavior still applies (leaving a property row commits it). Desktop
navigation/code visibility preferences are restored when returning to a wider
window. Open pages remain reachable through navigation on mobile.

The **Normal / Mobile** preview controls are shown on desktop only. On a phone,
the example already occupies the device width. Normal uses automatic device
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


Border layout increment (development): l01 demonstrates live splitters, drawer styling/placement and retained validation drafts; l02 demonstrates nested borders, headline/sidebar and fixed drawers. Both Python and JavaScript sources use the same layout collection and are included in the serverless gallery. Requires the corresponding unreleased core border implementation; no gallery deployment is implied.

l03 adds explicit outer/inner rounded outlines, four live splitters/drawers and
calendar, choice and validation popovers. `scripts/verify_rounded_border_browser.mjs`
checks both browser engines against Python/Node layout-folder servers and the
file:// manual playgrounds, including clicks beyond the inner outline, all corner
hit tests, retained invalid drafts and narrow-screen drawer reopening.

Border visual follow-up: l02/l03 use the Gramlot filteringSelect for Headline/Sidebar,
with a neutral inset focus indication and a slightly inset popup. Regions use
contrasting theme surfaces. Drawer handles follow the legacy attached-tab shape,
with rounded corners only on their exposed edge. l03 binds `rounded` on both
containers to the same live slider; explicit bindings make their shared radius
visible in the Python/JS sources.

The Containers lesson **l04 · Drawers: handles, content and retained Data** demonstrates icon/caption minimization, automatically rotated side labels and compact touch interaction. Drawer styling uses the existing drawer_ attributes and theme variables. Hover leaves content geometry and Data unchanged. The Python browser probe scripts/verify_drawer_handles_browser.mjs covers natural sizing with larger fonts/padding, explicit Source colors, automatic contrast, dragging from closed and touch press/rest.

Drawer defaults in Python l04: drawer_label is small and oriented by region. drawer_minimize defaults to True and reveals icon and caption together on hover/focus. The resting grip stays thin, without a square icon slot. Explicit False keeps both visible. Touch keeps the content compact and readable. The example needs no drawer presentation classes or CSS dimensions.

The Python development lesson **l05 · Nested regions playground** combines five border containers, seven compact region-size sliders, reactive design/radius/minimize and retained editable widgets. Data paths under regions drive pane width/height with pointer suffixes. Splitter dragging remains local geometry and does not write slider values back. Node/serverless parity is deferred to final release preparation.

The Python development lesson **l06 · Border events and controllers** demonstrates Source-local closable_change and splitter_resize, their payloads, Data-driven visibility and completion-only resize counters. Drawer state, invalid drafts and accepted Data keep their existing lifecycle. JavaScript/serverless parity remains deferred to final release qualification.


Python development previews l07 (Tabs, selection and closing) and l08 (Demo carousel and live preview) exercise shared selection, named/index bindings, controller notifications, synchronous close veto, Source removal and retained Data/drafts. JavaScript/serverless example alignment is deferred until final qualification.


<a id="ge-010-210"></a>
## 210. Reactive tab presentation (Python preview)

In Containers → Tabs, selection and closing, change Tabs/Underline and Top/Bottom/Left/Right. The Notes icon, unread badge and badge color are bound to Data; changing them while Customer is selected leaves that panel mounted. The gallery appearance menu supports visual comparison of mimi and joanna, light/dark. Demo carousel and live preview uses a compact slider to select among live miniature demo iframes. These remain Python previews until final JS/serverless qualification.


<a id="ge-010-215"></a>
## 215. Catalogue thumbnails in a stack (Python preview)

Containers → Demo carousel and live preview (l08) reads the common catalogue and creates one persistent iframe per other demo (currently 78). The zero-based slider selects a panel and the selected subscription updates its title. Each page renders at half scale using CSS and keeps its independent Data when hidden. Native lazy loading controls when frames load; only l08 itself is excluded to prevent recursion. Chromium/WebKit checks cover slider endpoints, bound edits, document identity, scale and narrow layout.


<a id="ge-010-220"></a>
## 220. Drawer carousel and delayed center preview (Python)

The l08 carousel now occupies a resizable borderContainer drawer. Its slider updates the thumbnail stack immediately. A dataController with _delay=350 updates the center stack only after selection settles. Center iframes have no src before their first settled visit; their URLs remain set afterward. Rapidly traversed demos are not loaded in the center. Thumbnail and full-size pages keep independent Data, both preserved across switching. Closing the drawer releases the center width without resetting either stack. Verified in Chromium/WebKit and the Python gallery suite.


<a id="ge-010-225"></a>
## 225. Container-based Python gallery and explanations

The Python development gallery uses a borderContainer for Navigation, the running lesson and Code. Navigation and Code have live splitters and compact drawer handles; toolbar switches operate the same panes. Resizing and closing preserve the mounted examples. The general IndexPage still supports its original layout; this gallery explicitly selects component-based layout.

Each lesson has **Example** and **Explanation** tabs. Explanation presents the lesson Markdown as a readable, scrollable document instead of a compact header. Switching does not reload the iframe or reset Data. The old **Normal / Mobile** preview choice is removed; responsive behavior and phone views for Example, Code and Inspector remain.

The Containers family provides a dedicated drawer workspace and eight expanded explanations with concrete steps and expected outcomes. The basic regions lesson concentrates on splitters; the drawer lesson combines search, filters, editable customer details and shared output. Gallery controls and lesson text remain English.

Python-first development preview. JavaScript/serverless shell authoring alignment and qualification are deferred until acceptance, together with the existing pending container-example ports; shared browser assets are not release-ready for the old JS shell. No publication in this increment.


<a id="ge-010-230"></a>
## 230. Guided drawer demo (Python preview)

Open **Containers → Drawers: handles, content and retained Data** inside the Python gallery. The lower **Guide** drawer provides eight narrated/captioned steps. **Start / Resume** runs the sequence, **Pause** suspends it, **Next** executes the next unvisited step; after Back, it only reviews already visited steps. **Back** reviews the previous explanation without undo. **Stop** keeps the current example values. Starting after Stop or completion begins the tour again; this is not a full application reset.

**Voice** is off initially. When an English browser voice is available, it reads the same caption; the speed selector controls speech rate. Each automatic step waits for speech completion plus its observation interval. Pausing cancels speech; resuming reads the current caption again, then continues with the next action not yet executed. Reviewing a step never overwrites edits by replaying its action. Missing/failed speech leaves the text tour usable. Closing the teaching drawer, leaving Example, switching examples/mobile views or hiding the browser document pauses the sequence.

The first lesson changes drawer visibility, Filters width, delivery, customer and note through the example's real Data and existing bindings. Closing drawers and switching presentation keep the iframe and Data. Steps are Python-authored records of title, text, changes and seconds; this is a bounded gallery player, not a core event recorder or a public replay API. Other examples and JavaScript/serverless authoring remain deferred until owner acceptance.

Verified with the Python suite, player unit tests and Chromium/WebKit integration. Voice synchronization/cancellation is tested with deterministic browser synthesis doubles; the actual installed voice's quality must be tried on the user's device.


<a id="ge-010-235"></a>
## 235. Lessons for learners and compact Guide handle

The Containers introduction and all eight container explanations now guide a learner through a concrete task before introducing the relevant concepts. Each lesson explains what to observe, why it happens and when the technique is useful. Full source remains in Code; Explanation is readable prose, not an expandable source dump. The first drawer tour uses the same teaching approach and gives captions longer reading time.

Drawer captions now minimize by default in core. Explicit drawer_minimize=False requests a visible caption. The gallery's Guide handle minimizes icon and caption together to a thin grip, revealing both during interaction; touch keeps the content readable in a compact handle. Existing CSS variables control its compact proportions. Tested in the Python gallery; other gallery families are not yet rewritten as tutorials.


<a id="ge-010-240"></a>
## 240. Shared containers and review-safe teaching playback

The Python gallery now uses the same tabContainer for open lessons, Example/Explanation and Python/Logic source files. Page selection and responsive preferences live in galleryIndex Data. Code, explanation and mobile navigation change presentation without replacing the example iframe. The page stylesheet defines the responsive threshold; JavaScript reads its flag rather than repeating the number.

The guided drawer lesson distinguishes the explanation being read from the last action applied. Back, then Next or Resume, cannot replay an old action over an edit made in the example. Start after Stop or completion deliberately starts the lesson again. The same Source-driven guide and component defaults remain in use; no replay framework or extra authoring parameters were added.

Python-only development qualification continues. JavaScript/serverless shell alignment and publication await the owner's final release phase.


<a id="ge-010-245"></a>
## 245. Visible tab variants (Python preview)

The owner requested visible comparisons rather than only presentation selectors. The existing l07 lesson now starts with eight working cards: tabs/underline crossed with top/bottom/left/right. Each card shows the exact Python options, a Profile editor, Messages with icon and reactive badge, and Activity. Selection is independent per card; fields share ordinary Data bindings. The previous selection/closing playground remains below the comparison.

The grid adapts to one column on narrow screens, using normal declarative layout. Chromium and WebKit checks cover all eight variants, both mimi/joanna appearances, shared edits and phone overflow; Python page qualification passed four tests and 93 route subtests. JavaScript example parity remains deferred. Alignment along the strip is distinct from side position and is not supported yet: the owner subsequently approved tabAlign=start/center/end (see §250).


<a id="ge-010-250"></a>
## 250. Tab alignment (Python preview)

Owner-approved tabAlign defaults to start and accepts center/end or a Data pointer. Position chooses the side; alignment places the labels along that side. The l07 lesson now contains fourteen real comparisons, including horizontal left/center/right and vertical top/center/bottom. One shared Python helper constructs all cards, and the interactive editor includes a bound alignment selector.

Both modes and four sides were checked with all alignments in Chromium and WebKit, including safe overflow, Home/End, shared values and phone width, with mimi and joanna. The new parameter preserves mounted fields and selection. Python remains the current acceptance surface; no JavaScript/serverless release is claimed.


<a id="ge-010-255"></a>
## 255. Python, JavaScript and offline gallery alignment

The final preparation phase supersedes the Python-only qualification limits in §§215–250. Both gallery shells use borderContainer drawers and tabContainer for pages, Example/Explanation and source files. Python shows Python declarations with separate Logic where present; JavaScript shows its actual Page/Logic module, with a separate tab only for a companion. The eight container lessons, fourteen tab comparisons and guided drawer tour are available in both languages.

The carousel reads the common catalogue. Hosted pages use route keys; the static exporter supplies `galleryUrls` (Python `gallery_urls`) mapping each key to its relative file URL. The catalogue is also served as /catalog.json for the JavaScript page's module import. The paused selection loads a full-size demo once, retaining visited frames and their Data. Thumbnail and full-size instances remain independent.

Source parity tests compare the Python and JavaScript declarations of every example and the guided lesson, including values, bindings and controller scripts. The comparison accounts for Python's trailing-underscore spelling (`class_`, `for_`) and ignores the random ids of authored references. An endpoint parity test sends the same request envelopes to the endpoints and fragments of both languages and compares the values, the error classes and the Source. Browser qualification checks actual layout, themes, mobile presentation and retained frames separately; equivalent Source alone is not a visual check. Release qualification and publication status are recorded in GC-070.


<a id="ge-010-260"></a>
## 260. Settings dismissal and compact footer

Owner requested removing the ZIP link from the index and closing Settings on an outside click. Python and JavaScript footers omit the link. The native auto popover dismisses on outside clicks in the main document. The gallery settings service also closes it when focus enters an example iframe, whose pointer events do not reach the parent document. Clicks inside keep Settings open; Escape and its Close button continue to work. The focus listener and scheduled frame are released on disposal; no parallel popup state is added.


<a id="ge-010-265"></a>

## 265 · Create tabs on first selection

Owner, 2026-10-18: “si procedi così per entrambe le gallery: crea il tab solo al click, riusa quello già aperto e poi verifica quanto migliorano i tempi”, clarified as inserting the pane with its iframe into Source on click.

The initial gallery Source contains navigation and Introduction only. No example/category panel, example iframe, README body or code viewer is authored in advance. Selecting a navigation entry inserts its contentPane into the existing tabContainer Source. The selected lesson is built through the registered `lesson` Source method; example code uses the same method with `view="code"`. Categories have no code request. Unknown keys/views are rejected. The Node catalogue reads lesson files only when their content is requested.

The shared index waits only for the requested example Source and starts its iframe once. Code and the Explanation body are loaded separately when their panels become visible; they do not block iframe startup. Already opened tabs reuse their Source, DOM, iframe and example Data. Concurrent clicks on the same entry share the pending creation; an older response cannot override a newer selection. Background completions become available tabs. Loading failures remove incomplete Source and expose a retry message; selecting the entry again retries. Source removal retains the existing remote request cancellation contract. The guided tool attaches only after its lesson has been created.

`mountIndexPage` retains generic navigation/selection ownership. Its container layout accepts a `createEntry(entry)` callback returning a promise and `onLoad(key, status, error)` for loading feedback; the gallery owns its fragments and content rendering. Selection and opened/requested keys remain in the index Data Bag. This does not change Source code activation, the component container contract or dependency implementations.

Qualification and deployment evidence are recorded in GC-070 and deploy/galleries/reports. Both public galleries and the official ZIP passed Chromium/WebKit verification after the CI update. Cache validators change with the generation. The first selection builds Source on demand and can cost more than before; index startup and tab reuse are measured separately.

Publication authorized by the owner: “Sì, pubblica e aggiorna le gallery”. The isolated release candidate excludes unpublished c23 and passes 19 Python and 109 JavaScript tests. Both galleries and the serverless archive are updated by the existing release-driven CI pipeline.


Owner refinement, 2026-10-18: “contenut di codice e di descrizione possono essere òazy e scattare solo se sono visibili”. The gallery observes actual panel visibility, including closed drawers, inactive tabs and mobile views. It requests `lesson(view="code")` or `lesson(view="description")` only on first visibility. The returned Source is retained; simultaneous observations and behavior remounts share an in-flight request. Markdown sanitization and code highlighting run after the content arrives. A secondary request failure keeps the example alive and allows retry by closing/reopening the panel. Source removal retains normal remote request cancellation.

The outer code pane remains stable for index selection; only its inner `code-tabs-<key>` Source is replaced. This is gallery-owned behavior using the existing `remoteSource` contract, with no core or adapter change and no hidden iframe preloading. Categories render their README when selected because that content is visible.

Published examples 0.3.6 passes 112 JavaScript and 19 Python tests, plus Chromium/WebKit desktop/mobile visibility and Data-retention checks for both hosted galleries and the file-based serverless export. Timing evidence and publication status are tracked in GC-070 and the deployment report.


Examples 0.3.6 was published through the authorized CI and deployed as generation `20261018T180418Z`. Both public galleries and the downloaded ZIP pass the visibility checks in Chromium/WebKit on desktop/mobile. Gzip and conditional cache validation remain enabled; the new generation invalidates previous validators. Controlled median first-click improvement with Code open: Python 1274→1083 ms (15%), JavaScript 1316→1003 ms (24%); with Code closed: 1250→1040 ms and 1351→963 ms. Public post-deployment observations are about 1.05 s / 1.02 s. Small samples are environment-dependent; detailed methods, raw samples and CI evidence are in `deploy/galleries/reports/2026-10-18-visible-content.json`.


<a id="ge-010-270"></a>
## 270 · Published numeric splitter binding — 2026-10-18

The owner authorized the numeric splitter correction, publication of both galleries
and regeneration of the serverless ZIP. The `l05` nested layout now binds all seven
regional dimensions directly to numeric Data values, shared with their sliders.
Dragging a splitter writes constrained pixels before pointer release; keyboard
resize and slider changes use the same Data. No transformed `:{}px` pointer or
separate region state is involved.

Core 0.3.4 and examples 0.3.7 are published. Generation `20261018T193539Z` serves
both public galleries and the official ZIP. Chromium and WebKit pass the seven
bindings, live drag before pointer release, keyboard resize, reverse slider
updates and retained customer content on both HTTPS hosts and the downloaded
ZIP opened with `file://`. No browser errors were recorded. Both hosts retain
gzip and generation-specific conditional validators (old validator: 200; current:
304). The ZIP matches its deployment receipt and the released versions.

The owner also authorized temporary CI authentication for GitHub release checks
after the server exhausted anonymous API requests. Tokens travel over SSH stdin,
remain in updater memory, and are sent only to the exact HTTPS GitHub API origin;
authenticated redirects are refused. They are not saved, logged or inherited by
build processes. All 28 updater tests pass on the server, including nginx
integration. Publication gates remain mandatory. Evidence, successful CI links,
archive hash and recovery notes are in
[the release report](https://github.com/gramlot-org/gramlot-examples/blob/main/deploy/galleries/reports/2026-10-18-border-binding.json).


<a id="ge-010-275"></a>
## 275 · Published slider quantization — 2026-10-18

The owner authorized publishing the slider correction, updating both galleries and
regenerating the serverless ZIP. Core 0.3.5 and examples 0.3.8 are published;
generation `20261018T205005Z` serves both HTTPS galleries and the official archive.
The slider projects externally supplied finite values through its native
min/max/step constraints and writes a differing result through its existing plain
reactive value pointer. The splitter continues to write numeric pixels. Compatible
constraints are required when several sliders share Data.

Chromium and WebKit pass all seven regional bindings on both public hosts and the
downloaded archive opened with `file://`. The explicit external value `176.73`
becomes `177` in Data, slider, label and panel size. The probe records two writes:
the external assignment and one corrective write, with no loop. Real fractional
splitter drags remain synchronized before pointer release; keyboard resize,
reverse slider updates and retained content also pass, without page errors.

The runtime, input collection and layout collection on both hosts invalidate old
cache validators (200) and accept current ones (304), retaining gzip. ZIP integrity,
version receipt and deployment SHA-256 agree. Release gates, including JSR, remain
mandatory. Detailed evidence and successful CI links are in
[the release report](https://github.com/gramlot-org/gramlot-examples/blob/main/deploy/galleries/reports/2026-10-18-slider-quantization.json).


<a id="ge-010-060"></a>

## 060 · Source identity migration

Pages and gallery use `nodeId` in Python and JavaScript. Update old `node_id`
declarations and attribute reads/writes; rebuild gallery bundles after updating
source checkouts. Upgrade Gramlot and both Builder packages with the examples.
Source-local topics retain their names and payloads; DOM `id` stays independent.
There is no old-name alias. System callbacks and namespaced parameters such as
`node_label`, `node_position`, `target_id` retain their spelling.
