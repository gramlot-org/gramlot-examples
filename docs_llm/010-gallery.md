# The gallery package

For using the gallery, start with the [learning path](https://gramlot-examples.readthedocs.io/en/latest/lessons/index.html).
For API lookup, use the [widget reference](https://gramlot.readthedocs.io/en/latest/docs/public/345-widget-reference.html).
This package guide also retains dated engineering and delivery records below;
those records describe their stated revision, not current API guarantees.


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

`{"environment"?, "families": [{key, folder, title, examples: [{key, title, folder,
description, explanation}]}]}`. Family `folder` is the physical directory; example `folder` is its nested family-relative stem. Keys identify lessons; public URLs preserve physical paths.
The common catalogue has no `environment`; an environment catalogue has one.

<a id="ge-010-015"></a>

## 015 · Keys

- Common: `e01`–`e13`, `b01`–`b11`, `c01`–`c23`. Environment: `<environment>-NN`.
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
- `routes`: key → `page` (`.py` / `.js`), `url` (nested path), `stylesheet`, `logic` (`NN_name_aux.js`, else
  `NN_name.js`, else `None`; the server reports both); `index` = gallery page;
- `assets`: URL → `file`, `type` (theme, logo, `/gallery/gallery.css`,
  `/gallery/dist/*`, `/pages/<family>/<file>`). Only `gallery/dist/*.js` is
  `application/javascript`.

Nothing is written or served.

<a id="ge-010-025"></a>

## 025 · Serving a gallery from an environment

1. Stage one module at each route `url`: extend the Page, append
   `script(src="/gallery/dist/frame.js")`.
2. Copy `stylesheet` beside it as `<key>.css`; serve `logic` as JavaScript and stage
   `<url>_aux.js` = `export {Logic} from "<its URL>";` (`export * from` also serves a module
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

> Historical record — the carousel layout described here is superseded by [the single central stack (§370)](#ge-010-370).

In Containers → Tabs, selection and closing, change Tabs/Underline and Top/Bottom/Left/Right. The Notes icon, unread badge and badge color are bound to Data; changing them while Customer is selected leaves that panel mounted. The gallery appearance menu supports visual comparison of mimi and joanna, light/dark. Demo carousel and live preview uses a compact slider to select among live miniature demo iframes. These remain Python previews until final JS/serverless qualification.


<a id="ge-010-215"></a>
## 215. Catalogue thumbnails in a stack (Python preview)

> Historical record — the carousel layout described here is superseded by [the single central stack (§370)](#ge-010-370).

Containers → Demo carousel and live preview (l08) reads the common catalogue and creates one persistent iframe per other demo (currently 78). The zero-based slider selects a panel and the selected subscription updates its title. Each page renders at half scale using CSS and keeps its independent Data when hidden. Native lazy loading controls when frames load; only l08 itself is excluded to prevent recursion. Chromium/WebKit checks cover slider endpoints, bound edits, document identity, scale and narrow layout.


<a id="ge-010-220"></a>
## 220. Drawer carousel and delayed center preview (Python)

> Historical record — the carousel layout described here is superseded by [the single central stack (§370)](#ge-010-370).

The l08 carousel now occupies a resizable borderContainer drawer. Its slider updates the thumbnail stack immediately. A dataController with _delay=350 updates the center stack only after selection settles. Center iframes have no src before their first settled visit; their URLs remain set afterward. Rapidly traversed demos are not loaded in the center. Thumbnail and full-size pages keep independent Data, both preserved across switching. Closing the drawer releases the center width without resetting either stack. Verified in Chromium/WebKit and the Python gallery suite.


<a id="ge-010-225"></a>
## 225. Container-based Python gallery and explanations

> Historical record — the Code drawer described here is replaced by [the detachable third tab (§395)](#ge-010-395).

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

> Historical record — the carousel layout described here is superseded by [the single central stack (§370)](#ge-010-370).

The final preparation phase supersedes the Python-only qualification limits in §§215–250. Both gallery shells use borderContainer drawers and tabContainer for pages, Example/Explanation and source files. Python shows Python declarations with separate Logic where present; JavaScript shows its actual Page/Logic module, with a separate tab only for a companion. The eight container lessons, fourteen tab comparisons and guided drawer tour are available in both languages.

The carousel reads the common catalogue. Hosted pages use route keys; the static exporter supplies `galleryUrls` (Python `gallery_urls`) mapping each key to its relative file URL. The catalogue is also served as /catalog.json for the JavaScript page's module import. The paused selection loads a full-size demo once, retaining visited frames and their Data. Thumbnail and full-size instances remain independent.

Source parity tests compare the Python and JavaScript declarations of every example and the guided lesson, including values, bindings and controller scripts. The comparison accounts for Python's trailing-underscore spelling (`class_`, `for_`) and ignores the random ids of authored references. An endpoint parity test sends the same request envelopes to the endpoints and fragments of both languages and compares the values, the error classes and the Source. Browser qualification checks actual layout, themes, mobile presentation and retained frames separately; equivalent Source alone is not a visual check. Release qualification and publication status are recorded in GC-070.


<a id="ge-010-260"></a>
## 260. Settings dismissal and compact footer

Owner requested removing the ZIP link from the index and closing Settings on an outside click. Python and JavaScript footers omit the link. The native auto popover dismisses on outside clicks in the main document. The gallery settings service also closes it when focus enters an example iframe, whose pointer events do not reach the parent document. Clicks inside keep Settings open; Escape and its Close button continue to work. The focus listener and scheduled frame are released on disposal; no parallel popup state is added.


<a id="ge-010-940"></a>

## 940 · An editable stay estimate — 2026-10-18

Owner follow-up: “tipo camera quanti ospiti e piu calcli in catena”. This revises the earlier two-field estimate into c23, a Python-first stay estimate with room choice, guests and nights. Seven formulas connect the room rate and guest supplement to nightly price, subtotal, long-stay discount, total and rounded deposit. The complete Page is 42 nonblank Python lines, with CSS and host configuration disclosed separately. The summary controller still takes a snapshot only on click.

Chromium and WebKit verify all seven results, room selection, the discount boundary in both directions, rejected/empty drafts preserving accepted Data, correction, click-snapshot timing and three actual source edits (guest limit, discount threshold, guest supplement), plus mobile width. The website distributes the canonical source snapshot, editable project and real recording. The paired JavaScript Page has mount smoke qualification. No framework or dependency implementation changes; no publication authorized.

Historical record — initial two-field revision: c23 previously used hours × rate in 23 nonblank lines. It passed its own checks before this owner-requested expansion. The initially considered Reset action was not retained: unchanged accepted Data intentionally does not clear a rejected field draft. This remains why the teaching action is Prepare summary.

Inspector follow-up (owner, 2026-10-18): the real gallery inspector follows the Data chain in Chromium/WebKit, and the website adds a dedicated recording. Editing the inline discount text in live Source reaches the node but is refused by the runtime on the next trigger, as constitution 11.53 requires. No workaround or core edit is authorized. Owner confirmed: “inspector per seguire i dati, poi cambiamo la formula nel Python e ricarichiamo per vedere il risultato. lasciamo invariato il contratto”. The permission/activation proposal was not approved or implemented. The demo now uses the real Python-file save, normal development-server reload and browser reload.

Completed recording: Data inspection → actual Python threshold edit (7 to 5) → normal development-server reload and browser reload → re-enter the same five-night stay. Chromium/WebKit verify Data subtotal 450, discount 45, total 405 and rounded deposit 122. Reload starts with default inputs; the comparison explicitly re-enters five nights. The runtime contract and framework implementation remain unchanged.


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


<a id="ge-010-280"></a>

## 280 · Bag-tree navigation — development increment, 2026-10-20

The owner requests Gramlot's tree for gallery navigation, suitable CSS classes and resolver-backed sections. Python and JavaScript pages now declare `galleryIndex.navigation` as a Bag, one `dataRemote(cacheTime=-1)` section value, and a tree bound through `storepath`, `labelAttribute="title"` and `selectedPath="^galleryIndex.navigationSelection"`. Opening a section reads its resolver; rendering the initial gallery does not load section children. Reopening uses the Bag resolver cache. Existing deferred lessons, explanation/code panels and retained tab state remain in place. Selecting a tab also selects its tree row. The tree has its own arrow-key/Enter navigation, independent of the legacy link keyboard preference.

The `tree` collection is included in the gallery's Python grammar descriptors, JS collection list and served assets. The collection module imports the existing core runtime rather than bundling another Bag constructor; the core import map maps both `@gramlot/gramlot` and `@gramlot/gramlot/page` to that same runtime. This increment therefore requires the matching development core, not merely an older released package.

Example **w26 — Bag tree**, under Input components, is authored in Python and JS. Documents is a loaded Bag; Catalog is a dataRemote resolver returning a Bag. Buttons show bound selection, live insertion and caption updates. `26_bag_tree.md` explains the same contract. Icons distinguish folder/file and open folders; callback-defined icons, badges and hover actions remain later increments.

The gallery uses `.gallery-navigation-tree`, the example `.example-bag-tree`. Both style the shared component through CSS parts: `tree`, `group`, `node`, `branch`, `leaf`, `row`, `branch-row`, `leaf-row`, `selected-row`, `expander`, `spacer`, `icon`, `branch-icon`, `leaf-icon`, `opened-icon`, `closed-icon`, `caption`. Internal classes also expose opened/closed, selected, loading and error states. CSS variables with the --gramlot-tree- prefix control row height and hover/selection colors. Dark sidebar contrast belongs to gallery CSS, not a hard-coded tree theme.

Qualification: 22 gallery integration tests pass, including section laziness/cache, selection, remount and failed-lesson retry. Six Python gallery tests pass. The 115-test examples suite passes 114 tests; the existing binding/01_pointers symbolic Source lookup remains unresolved. `verify_gallery_tree_browser.mjs <url>` passes Chromium/WebKit against both local Python and Node galleries, including lazy Catalog, retained tab state and mobile. Screenshots were reviewed. Existing browser scripts navigate through `gallery-navigation.mjs`, which expands the actual tree; it is test code, not an application loader. The broader lazy-tabs script reaches its separate guided-demo availability timeout after its navigation/content/mobile checks. Core tracking: GC-197 §065, GC-070 §1520 and PORT-0017-bag-tree. No publication or deployment is included; owner visual acceptance remains pending.


Owner follow-up, 2026-10-20: “fai nella navigaxione il tree auto collapse”. Both gallery pages now set `autoCollapse=True` (Python) / `autoCollapse: true` (JS). Expanding a section closes its siblings while retaining resolver cache and descendant state. Switching tabs reveals the selected row and closes sibling sections. The example tree keeps its existing independent expansion. The 22 integration tests and six Python tests pass; Chromium/WebKit pass on Python and Node, including sibling collapse, external tab reveal, cached reopen and mobile. This requires the matching core increment (GC-197 §070; GC-070 §1525).


<a id="ge-010-285"></a>

## 285 · Toolbar inspector and bottom settings drawer — development increment, 2026-10-20

> Historical record. Settings now uses the floating formlet in §335; Inspector uses the rail in §330.

Owner requests Navigation/Code only on drawer labels, a bottom drawer opening configuration directly, and Inspector at the toolbar's far right with an icon and small caption. Implemented: Python/JS pages move Inspector to that location and share it with mobile Inspector presentation; Settings is a 180px bottom contentPane, initially drawer="close", containing configuration directly instead of a popover. Theme, appearance, keyboard preference, label position and installation controls remain in that panel. The existing shared drawer owns open/close behavior.

Verified: 23 gallery integration tests, six Python gallery tests and local build; `node scripts/verify_gallery_drawers_browser.mjs <gallery-url>` checks Chromium/WebKit, desktop/mobile Inspector open/close, direct Settings access and theme changes. Both local Python and Node hosts passed. Owner visual acceptance remains pending.

Navigation/Code toolbar removal is pending: core mountIndexPage still requires those controls during panel and drawer updates. Core authorization was requested under constitution §3; no hidden substitute controls or application workaround was added. The two toolbar controls remain until that decision is resolved. GC-070 §1530 tracks this boundary. The maximum-tab/LRU proposal remains unconfirmed. No release or deployment.


<a id="ge-010-290"></a>

## 290 · FramePage, IndexPage and directory navigation — 2026-10-20

Owner implementation instruction: “bene procediamo con questa struttura e usiamo la gallery per verificarla”. This supersedes §285's pending core authorization. The reusable frame declares region hooks; the index adds only its tree, URL-identified tabs and panel lifecycle. The gallery owns top title/Inspector, right Code, bottom Settings and navigation branding. Navigation and Code now appear only on their shared drawer labels. No tab-count limit or eviction is implemented.

The navigation store is a Bag. Python `navigation_directory` and JS `navigationDirectory` read one filesystem level. A directory returns a node with a relative `directory` path; an index.py/index.js adds its own `url`. The browser's NavigationResolver loads children on expansion and recursively installs child resolvers. Directory-label selection opens its own page without expanding children. Known catalogue entries retain their current page URLs and teaching metadata; additional filesystem pages use `pages/<relative-path>`. The local example `HTML / SVG → nested → child` demonstrates independent folder pages and nested loading. Route staging discovers available files at startup; this does not eagerly load their child Bags in the browser.

The gallery uses a normal Logic module: galleryInitialize installs resolvers on `_onBuilt`, before the tree's first render; galleryMount starts presentation on `_onStart`. Core classes and mountIndexPage come from the actual shared runtime. The coordinator transports the selected node's attributes in a one-node Bag to index_panel; panel(pane, node) authors the first panel, then its Source and frame are retained. Clicking another tab while a panel is pending determines the final selection. Errors remove incomplete panels and permit retry.

Verification: 24 focused JS gallery/navigation tests, 34 Python core/gallery/staging tests and four Node staging tests pass. The Python and Node galleries pass the same Chromium/WebKit scenario for lazy nested directories, their index pages, URL tabs, retained example state, Code, Inspector, Settings and responsive drawers. The local static exporter also passes ten directory/gallery tests, including nested output paths and the ordinary root Logic. Broader pre-existing checks are tracked separately in GC-070 §1535. Owner visual acceptance remains pending; no release or deployment.


<a id="ge-010-295"></a>

## 295 · Nested borderContainer lessons — 2026-10-20

Owner requests deeper gallery navigation with related border pages grouped below an introductory page. Containers now contains a `border` filesystem directory with an `index.py`/`index.js` introduction and six existing lessons. Select the branch label for the five-region overview; expand its arrow to resolve the lesson list. Tabs and Demo carousel remain siblings. The catalogue stores family-relative paths, while lesson keys/URLs (`l01`–`l06`), browser Logic, Code and Explanation remain attached to each lesson. Source assets and documentation playground links preserve nested paths. This is a gallery organization change using the existing FramePage/IndexPage and NavigationResolver contracts.


<a id="ge-010-300"></a>

## 300 · Topic groups — 2026-10-20

Owner: “fai gruppaggi logici allora”. The five main sections now use topic directories with their own introductory Python/JavaScript pages. Each directory is a lazy navigation branch. Existing lesson keys, routes and content remain unchanged. Single lessons stay directly in their section; no one-lesson groups are introduced.

- **HTML / SVG**: HTML basics; Native HTML controls; SVG drawing; Composing complete pages.
- **Binding**: Data paths and updates; Editing bound values; Binding the presentation.
- **Controllers**: Formulas and page logic; Actions and commands; Events and lifecycle; Calling the server; Remote content and Data; Putting page logic together.
- **Input components**: Text inputs; Checkboxes and switches; Selecting values; Numbers and sliders; Dates and times; Forms and validation; Buttons and commands.
- **Containers**: Border containers (six lessons); Tabs and Demo carousel stay at the section level.

All 81 catalogue lessons remain reachable. The filesystem carries the group hierarchy; the catalogue carries lesson titles, teaching content and stable keys. No separate navigation manifest or core change is added.


Topic grouping verification — 2026-10-20. The 81 lessons now sit in 21 topic directories with paired introductory pages, or remain directly in their family when no useful multi-lesson group exists. Python tests: 26 passed with 120 subtests. JavaScript suite: 119/120 passed; the existing b01 symbolic pointer failure (`cannot resolve ^#settings.caption`) remains outside this grouping scope. All 30 Source parity checks pass, including every topic introduction. Connected adapters: nine Python checks and seven Node/static-export checks pass. Sphinx builds successfully; all 81 lesson playgrounds, two paired guides and local links/anchors validate. Live Python navigation verifies Input components → text → Textbox and the group's own introduction. Live Node verifies Controllers → logic → Named logic, nested source display and reactive Logic (price 120 → final 108). Implemented and verified; owner visual acceptance remains pending. No release or deployment.


Source identity alignment — 2026-10-20. Owner: “ok riallinea esempi e dipendenze senza perdere il lavoro sulla gallery e verifica che i test passino”. Migrated remaining authored node_id attributes and direct identity lookups to canonical nodeId in the current examples, guided demo and gallery, together with lesson explanations and catalogue text. No paths, groups or lessons were removed: all 81 lessons and 21 topic groups remain. Example package requirements now match the already approved identity release (Gramlot >=0.3.7, without an upper bound). The connected core installs Builder JS 0.7.0 and Python 0.30.0, with required TYTX 0.16.3. Full examples verification: 140 JS tests and 26 Python tests plus 120 subtests pass. Connected gallery integration: nine Python tests and seven Node/static export tests pass. All prior b01 pointer failures are resolved. Shared runtime and gallery bundles rebuilt; local servers restarted. The Python gallery opens b01 through Binding → paths and updates → Pointers; editing Caption updates the heading and #settings.caption while the read-once value remains Pointers. No publication or deployment.


Tree presentation examples — 2026-10-20. The catalogue now has 83 lessons and 22 directory groups. Input components → tree groups w26 (Bag tree, lazy Catalog and live hideValues), w27 (label attributes and node/open/closed/selected classes) and w28 (named Logic callbacks returning text/HTML, custom icons and caption classes). Their Python pages remain primary; JavaScript twins and Logic accompany them. The filesystem directory is a resolver and its own index explains the group. Navigation explicitly hides scalar values; the Bag tree example starts with hideValues=False. Drag/drop remains a separate core contract proposal.


Tree increment verification — 2026-10-20. All 143 gallery JS tests pass. Focused core/examples Python: 37 tests and 132 subtests pass, with one previously diagnosed upstream expected failure. Gallery adapters: nine Python and seven Node/static checks pass. Sphinx and all 83 lesson playground/link/anchor checks pass. Live Python w26 verifies scalar values, immediate hideValues binding and lazy Catalog; Python gallery w28 verifies text/HTML callbacks, open state and selection with a custom star icon; Node w27 verifies open/selected/node classes and live caption updates. Implemented and verified, pending owner visual acceptance; no release or deployment.


<a id="ge-010-305"></a>

## 305 · Internal tree drag lesson — 2026-10-21

Input components → tree → Internal tree drag and drop (w29) adds a Python-first page and JavaScript twin with shared Logic. Dragging a document into Inbox or Projects copies its snapshot to the destination Bag; Locked archive rejects it. Repeating a copy updates the entry with the same key. The source Bag stays unchanged. The example declares type/tag/effect restrictions and a synchronous target predicate, then writes Data in onDrop. onDragEnd displays the browser effect, not an application-success claim. No application DOM construction or event wiring is used.

The catalogue now has 84 lessons in 22 groups. All 144 JavaScript tests and 19 Python tests pass, including the two-tree event integration check for accepted copy, rendered child, rejected archive and completion text. The gallery bundle builds. The Python gallery opens w29, but automated browser drags delivered dragover only to the origin and ended with none. A successful real browser drop and preview remain unverified; manual verification is needed before visual acceptance. Core qualification is recorded in GC-070 §1560. Cross-window drag, typed callbacks, custom Source previews and external files remain pending; unsupported nested TYTX values are owner-deferred. No release or deployment.


<a id="ge-010-310"></a>

## 310 · Numbered filesystem navigation — 2026-10-21

Owner confirms numeric sibling prefixes in physical names, lowercase and underscores (`00-html_svg`), nested paths, `00-index` as the hidden directory index, `Page.title` for executable titles and the first Markdown H1 for `00-index.md`. This supersedes the physical naming and short public URL descriptions in blocks 290–300. Catalogue keys remain lesson identities; required family `folder` and lesson `folder` locate the files. No route aliases or core loader extensions are introduced.

All 84 lessons retain their Python, JavaScript, prose and stylesheet companions. Navigation sorts directories and pages together by filename, resolves one level on expansion, and opens the directory index on label selection. The root introduction appears when no tab is selected and is not a tree leaf. Markdown-only indexes use the existing sanitized gallery prose renderer. A dedicated descriptive-index directory demonstrates this path.

The host stages each executable `route.url`, including parent directories. Hosted and offline carousel URLs retain their respective mount-relative or file-relative paths. Environment catalogues explicitly declare family `folder`; numbered routes work in Python, Node/Bun and the static exporter. Owner authorizes the connected integration update with “Sì, adegua anche le integrazioni”. The existing executable indexes were renamed, not deleted or replaced. Verification and visual acceptance are separate; no release or deployment is included.

Verification: 146 JavaScript tests; 27 Python tests and 124 subtests; all 84 manual playgrounds built. Clean Sphinx build and coverage/link checks pass for 84 lessons and both paired guides. Live Python/Node checks confirm ordered trees, hidden executable/Markdown indexes and nested URLs; the Python Code drawer retains its source. Owner visual acceptance remains pending.

<a id="ge-010-060"></a>

## 060 · Source identity migration

Pages and gallery use `nodeId` in Python and JavaScript. Update old `node_id`
declarations and attribute reads/writes; rebuild gallery bundles after updating
source checkouts. Upgrade Gramlot and both Builder packages with the examples.
Source-local topics retain their names and payloads; DOM `id` stays independent.
There is no old-name alias. System callbacks and namespaced parameters such as
`node_label`, `node_position`, `target_id` retain their spelling.


### Build the public documentation from source

Run `python scripts/prepare_docs_dependencies.py` before staging the manual. It
checks out the public `main` branches of the core and JavaScript host, builds
prepared collections, and installs the generator locally for this build. No npm
or PyPI publication is required. Read the Docs pull-request previews and CI
preview runs explicitly select `develop`; public `latest` uses `main`.
`GRAMLOT_SOURCE_REF` selects the coordinated branch for verification. Commit
identities are printed in build logs; first-party dependencies are not pinned.

`python scripts/prepare_docs.py` exports 90 real playgrounds. Ordinary lessons
share one exported directory runtime, while the optional Typst engine stays in
its own export. The Source-authored playground index is available at
`playgrounds/index.html`. Each lesson keeps its original playground URL. Run
Sphinx and `python scripts/check_docs.py` to check the resulting documentation.


<a id="ge-010-065"></a>

## 065 · Same-name initial Data Bag

An optional `foo_data.tytx` beside `foo.py`/`foo.js` contains the initial Data Bag. `build_gallery` and `buildGallery` expose its path as route.data, or None/null when absent. Each host copies it beside the staged page under that page's stem plus `_data.tytx`; this is essential when wrapping or renaming a lesson. The documentation exporter also copies it before bundling its Worker.

The gallery exposes the example file as readable source, and the manual includes it beside Python/JS. Production file hosts do not automatically serve Data companion URLs. Data arrives before defaults and rendering; invalid files fail startup. Existing dataSetter and dynamic endpoints/resolvers remain supported. The static lessons use shared TYTX companions for sample records, nested Bags, dates, Decimals and node attributes. Interface control state uses `default` or `default_<attribute>`. Scenario traces and counters with no editable control are part of the scenario's initial Bag. Production records normally arrive from server endpoints/resolvers; these companion files are teaching fixtures, not a recommendation to hard-code application data.

The dedicated setters/defaults lesson retains its ordered `dataSetter` declarations. The catalogue carousel separately demonstrates host-generated metadata: its URLs and labels depend on the current deployment and are initialized explicitly rather than frozen into a sample file. Gallery-shell initialization and the shared guided tour are not lesson fixtures.

Lesson b12 also offers a second, initially empty form. Type manually or press **Play · fill sample** to copy the customer Bag into an independent draft. Clear and retry. The paced load preserves typed values and node attributes, uses ordinary bindings, and does not simulate keyboard input or input validation. No character-by-character playback API is introduced.


<a id="ge-010-320"></a>

## 320 · Paced Play and bounded carousel startup — development follow-up, 2026-10-24

> Historical record — the carousel layout described here is superseded by [the single central stack (§370)](#ge-010-370).

Owner requests a brief delay between fields during Play and correction of the
file-export carousel crash. In b12, Play copies the current customer into an
independent snapshot: name immediately, city after 300 ms through a bound
`dataController(_delay=300)`. Clear cancels pending playback; another Play restarts
it. This is Data loading through bindings, not synthetic typing or input validation.

In l08, both thumbnail and full-size iframe `src` values now come from `.opened`.
Only a settled selection (350 ms) assigns them, preserving visited frames and
their edits. A rapid sweep does not start every lesson. This supersedes §215–220's
reliance on native lazy loading for thumbnails: file-origin Chromium started
89 thumbnail navigations and dozens of Workers, while the hosted version did not.
No runtime, exporter or dependency workaround is involved.

Verification: focused behavior and Python/JS Source/layout parity pass; Play passes
Chromium and WebKit on Python, Node, HTTP exports and file exports (8 combinations).
Carousel loading, rapid traversal, editor startup and retained text edits pass
both engines on Python, Node and file exports (6 combinations). This resolves the
file-carousel crash recorded in GC-070 §1885 for the reproduced scenario; it does
not set a memory bound for retaining every visited application. Owner trial is
still pending. No publication or package release.


<a id="ge-010-325"></a>

## 325 · Responsive gallery toolbar — development trial, 2026-10-24

Owner confirms: “framePane con toolbar a sinistra, navigazione in alto e
impostazioni in fondo. Su mobile spostiamo la toolbar sotto, poi la provo.”
The Python gallery and its JS twin wrap the existing IndexPage content in a
framePane. Its left region holds one `menu(presentation="bar")`: Navigation,
an elastic spacer, then Settings. Both menulines use SVG images, tooltips,
44px targets and a checked background reflecting the actual drawer visibility.
Opening or closing a drawer through its handle keeps the toolbar state aligned.

At the gallery's existing narrow breakpoint (1023px), the same region becomes
the bottom region and the same menu becomes horizontal. No second toolbar or
lesson instance is created. Existing tabs, example Data, Code, Inspector, themes
and panel splitters remain available. Navigation and Settings still use the
existing drawers. This first trial changes the gallery, not the core IndexPage
API; generalization awaits owner feedback after use.

Verified: Python gallery authoring tests, gallery runtime regressions and real
Chromium/WebKit trials on Python and Node. Geometry, icon actions, drawer-handle
synchronization, theme switching and retained iframe identity/data across viewport
changes are covered by `scripts/verify_gallery_rail_browser.mjs`. Desktop/mobile
screenshots were inspected. Owner visual acceptance is pending; no publication.


<a id="ge-010-330"></a>

## 330 · Inspector in the rail and continuous shell color — 2026-10-24

Owner requests Inspector directly above Settings, removal of the unexplained blue
line, and a visually continuous, slightly darker title/left area. Inspector is
now an SVG menuline in the same toolbar, immediately before Settings. The existing
inspector connection/lifecycle remains; checked reflects the visible palette.
On mobile it moves with the other toolbar entries and still opens docked.

The decorative top border is removed. Header and rail share
`--gallery-chrome-background`, mixed from the current theme's subtle surface and
ink colors. Their adjoining vertical border is removed, producing one continuous
surface in light and dark modes without changing global theme defaults.

Verified: 26 gallery JS tests and seven Python authoring tests; Chromium/WebKit on
Python and Node cover Inspector opening/closing and checked state, desktop/mobile
placement, identical header/rail color, absence of the top border, drawer actions,
theme switching and retained lesson Data. Light, dark and mobile screenshots were
inspected. Owner visual acceptance remains pending; no publication.


<a id="ge-010-335"></a>

## 335 · Floating Settings formlet and simplified navigation — 2026-10-24

Settings now uses a nonmodal `floatingPane` containing its `framePane` and a
single-column `formlet`. This supersedes the bottom drawer described in §285.
The gear toggles the window; its checked state and the titlebar close button use
the same `galleryIndex.settingsOpen` binding. Moving, resizing and collapsing use
the existing floating component. Clicking the example does not dismiss Settings.

Theme, Colors, Color mode and Label position are `filteringSelect` widgets with
required choices; keyboard navigation uses a bound `checkbox`. Labels align on
the left. Preferences apply immediately through Data subscriptions, preserving
existing local storage and preview forwarding. Install app remains expandable.
The floating stays inside the viewport on mobile; the rail still moves below the
page. Example iframes and their Data are retained.

Navigation opens and closes only from its toolbar button. The drawer tab is hidden
with the existing `drawer_display` style, while the separator remains resizable.
Inspector has a dedicated SVG showing a lens around connected nodes.

Verified: 29 JS gallery/editing tests and seven Python authoring tests pass.
The rail browser scenario passes Chromium and WebKit on both Python and Node:
nonmodal interaction, theme/color/label changes, titlebar closure and gear state,
hidden navigation tab with working splitter, mobile bounds and retained lesson
Data. Light/dark desktop and mobile screenshots were inspected. Owner visual
acceptance is pending; the local Python preview is http://127.0.0.1:8098/.
No publication or release was performed.


<a id="ge-010-340"></a>

## 340 · Neutral rail selection — 2026-10-24

The owner requests no permanent background change for an open navigation panel.
Rail icons keep their checked semantics but use a transparent selected background.
Pressing an icon gives temporary feedback; the standard hover is unchanged.
This uses existing gallery CSS and does not change other toolbars or the core.
Chromium and WebKit checks pass on the Python preview; visual acceptance pending.


<a id="ge-010-345"></a>

## 345 · Compact desktop proportions — 2026-10-24

> Historical record: dimensions superseded by [§375](#ge-010-375).

At the owner's request, the desktop rail is 46px wide with 38px buttons; the title
region is 34px tall. Navigation starts below the title line, beside the panel.
On mobile the same toolbar keeps 44px targets, a 56px bottom region and no extra
top offset. The responsive coordinator restores desktop sizes on return.
The rail browser check covers Python/Node with Chromium/WebKit, including panel
toggles and unchanged lesson iframe/Data. Owner visual acceptance pending.


<a id="ge-010-350"></a>

## 350 · Mela appearance and comparison lesson — 2026-10-24

Owner approves Mela for desktop/mobile and light/dark. Choose **Settings → Theme
→ Mela** and **Colors → Theme default** to see its neutral surfaces and blue accent.
Other palettes remain independent. Desktop fields have a 28px minimum; narrow
(up to 640px) or coarse-pointer layouts use 44px fields/targets and 16px text.

**Containers → Mela: desktop and touch** (l09) has Python/JS authoring, a frame
with toolbar and hierarchical menu, shared draft fields, a modal dialog and a
nonmodal floating window. Commands update local status only; they do not export
or save to a server. Theme changes retain entered values.

Verified: 26 gallery JS and seven Python tests; Chromium/WebKit on Python/Node
exercise both color modes at desktop and phone widths, menu/submenu, disabled
entry, modality, viewport bounds and retained draft. Screenshots inspected.
Visual acceptance pending; no publication or release.


<a id="ge-010-355"></a>

## 355 · Collections belong to the environment

Block ID: **GE-010-355**. Updated 2026-10-30.

The gallery declares its prepared collections once in `gallery/collections.py`
and `gallery/collections.js`. Its Page base exposes inputs, layout, tree, grid,
chat, editors, Typst, Grouplets and the menu trial to every example. Examples
import Page and use their Source methods without repeating collection imports.
A custom trial collection outside that environment still declares its dependency.
The host prepares and reuses the complete grammar for this selection.

<a id="ge-010-360"></a>
## 360 · External engines load on first use

Block ID: **GE-010-360**. Updated 2026-10-30.

The bootstrap activates Gramlot component definitions. The generator preserves
components' dynamic module imports: CodeMirror, Jodit, ProseMirror and Typst live
in separate verified files and are fetched only when their component uses them.
HTTP cache and the browser module cache reuse those immutable resources. A textbox
page can therefore use any environment component without fetching editor engines.
The file-origin serverless profile still embeds engine bytes in its verified
derived bundles; it does not yet provide deferred downloads.

<a id="ge-010-365"></a>
## 365 · Try toolbar placement

Block ID: **GE-010-365**.

Open Settings with the gear icon and choose Toolbar: Automatic, Left or Bottom.
The choice changes the same Source-authored toolbar immediately. It lasts for the
open gallery page; reloading starts with Automatic. It does not change the theme,
input density or the current example's Data.

In this provisional gallery rule, Automatic puts the toolbar below the content
when the viewport is narrower than 1024 CSS pixels and its height is at least its
width. A landscape window uses the left edge, preserving its limited vertical
space. Wider windows retain the left toolbar even in portrait orientation.
Explicit Left and Bottom override placement at every size. The existing narrow
panel layout still follows width; a landscape phone continues to show one panel
at a time and uses 36-pixel toolbar buttons. Moving the toolbar does not recreate
its controls, the example iframe or its Data, or reset the active narrow panel.

Try a portrait phone, rotate it to landscape, force Bottom, then return to
Automatic. On desktop, choose Bottom to compare it with Left. The settings remain
in the existing nonmodal floating formlet. This trial changes only the gallery;
it does not redefine the framework's device classification or touch policy.


In the narrow layout, navigation uses a 260 px column whenever at least 360 px remain for the example, after subtracting a lateral toolbar. This applies with either toolbar orientation, including portrait tablets. Smaller windows keep the full-width, single-panel navigation. Resizing updates both the width and content visibility without rebuilding the active lesson. These dimensions are provisional gallery presentation settings.

<a id="ge-010-370"></a>
## 370 · Single-view demo carousel

Block ID: **GE-010-370**.

Owner request, 2026-10-24: use one central stackContainer with the slider above,
so each demo has only one version. The l08 lesson now has a top region with its
title/slider and a center with one stack. The miniature drawer and second stack
are removed. Each demo has one iframe and one Data instance; visited pages stay
mounted, while skipped pages never acquire a URL. The 350 ms delay remains: the
current demo stays visible until the slider settles. The slider uses default=0;
host-dependent URL/title metadata remains dynamically initialized.

Python and JavaScript produce equivalent Source and page options. Chromium and
WebKit checks pass on Python, Node and file exports: one stack, slider above it,
bounded initial loading, rapid traversal, retained edits and narrow geometry.
The lesson, catalogue and executable documentation are updated. No core/runtime
changes or publication; owner visual trial pending.


<a id="ge-010-375"></a>
## 375 · Uniform gallery chrome

Block ID: **GE-010-375**.

Owner request, 2026-10-24: “porterei tutto a 42”. The title bar height,
left toolbar width and bottom toolbar height are 42 CSS pixels on desktop and
narrow layouts. Toolbar buttons are 36 pixels, with padding inside the region.
The first side button stays below the title bar. Placement preferences and
aspect-ratio switching remain unchanged.


<a id="ge-010-380"></a>
## 380 · Embedded-page scrolling

Block ID: **GE-010-380**.

Full-height introduction and category iframes are block elements: they occupy
the available panel without reserving an inline text baseline. The embedded
lesson scrolls when needed; its gallery panel and the outer document do not
add redundant scrollbars. Layout fixes preserve access to the entire lesson
and do not hide scrollbars globally.

<a id="ge-010-385"></a>
## 385 · Find examples by task

Block ID: **GE-010-385**.

The navigation starts with **HTML, SVG and page structure**, then **Fields and input
widgets**, **Data and bindings**, **Logic, actions and events**, **RPC and data
exchange**, **Containers and layout**, and **Document and code editors**. Titles name the
behavior to try, such as “Call the server when a value changes” or “Edit Markdown:
source, preview and rich text”. Every section provides an introduction before its
individual lessons. Example keys remain stable; reorganized filesystem paths and
page URLs change together. Old paths are not aliases.

The Python host additionally supplies **Tools and IDE**. The IDE opens a workspace
page without the lesson's source-code column. Its sample documents live in this
package's `documents/` directory, outside executable `pages/`. The host creates a
disposable copy and exposes only that directory through the existing filesystem
RPCs. Users can edit drafts and use Undo, Redo and Revert. Save is disabled unless
the host enables Remote Edit; direct RPC writes are rejected too. Restarting the
gallery restores the sample files. This host-backed IDE is not included in the
JavaScript or offline gallery; those still include the document-editor lessons.

The **Tools** category contains **Live Source playground** (`e13`,
`07-tools/01-live_source`). The Python host stages the same category with its
sample-document IDE. Common lesson keys and URLs remain available in that category.

The **Composition and reuse** branch introduces reusable Source blocks. Its Color
Maker calls one RGB helper under three datapaths, with equivalent Python and JS
pages and responsive CSS. The branch guide explains extracting the helper into an
ordinary importable module, without introducing a collection or a new widget.

The same branch includes the Sieve of Eratosthenes. It separates the fixed Source
grid from reactive algorithm state and explains `_timing` in seconds, the shared
manual/timed step, pause/resume and reset. Both pages use the same browser Logic.


<a id="ge-010-390"></a>
## 390 · Lesson presentation and review

Each catalogue lesson starts with a concrete task and the result to observe.
The companion explanation repeats that trial before deeper reference material.
Small examples teach one mechanism; complete examples demonstrate composition.
Python and JavaScript build equivalent Source, including bindings and controllers.
Repeated structures use loops, and larger pages separate named methods.

Secondary field/editor settings and the tab-style catalogue are collapsible.
Where comparison matters, controls and results sit side by side and stack on
narrow screens. Examples inherit the selected palette instead of forcing a light
surface around dark fields. Source-editor notices use the same theme.

The border laboratories deliberately preserve their multi-region workspace.
Below its useful width, only that canvas scrolls horizontally; the page stays
within the viewport. This is an explicit teaching presentation, not automatic
mobile conversion of arbitrary border containers. The nested laboratory keeps
its size controls in a collapsible section.

The dated review ledger records coverage and limitations in
[GE-015 · Gallery review](https://github.com/gramlot-org/gramlot-examples/blob/main/docs/internal/015-gallery-review.md). Visual review and
passing regressions do not imply owner acceptance or publication.


See [Native mobile modules](020-mobile-modules.md) for the separate Capacitor catalogue, frame broker, theme propagation and beta limits.


<a id="ge-010-395"></a>
## 395 · Code as a detachable third tab

Each lesson now has **Example · Explanation · Code**. Code loads on first use and
retains the selected Python/JavaScript/Logic file. Open **Code**, then drag the
small icon inside the panel to place it in a floating window, or click/activate
it from the keyboard. The outer tab has no detach icon; the handle is visible
only while Code is open.
The example becomes visible underneath. Move or resize the floating as needed;
closing it returns to Code in the same lesson. The editor and the running example
remain mounted, including drafts and Data. Remote Edit still controls saving on
the host and remains disabled on the public gallery.

This replaces the old right-hand Code drawer and its phone-only view. The same
three tabs work on desktop and phone. The native component owns detachment;
the gallery only declares `detachable=True` on the Code contentPane. Navigation,
settings, inspector and iframe theme synchronization retain their existing roles.


<a id="ge-010-400"></a>
## 400 · Search navigation and close pages

The navigation toolbar contains one rounded **Search examples** field with a leading magnifier and an internal **Clear search** button, visible only when the field contains text. Type part of a title: the shared tree searches closed and unresolved branches, shows the ancestors of matches, and highlights matching text. Clear restores the previous expansions. Search never opens an example by itself; select a result as usual. Core `searchText` owns filtering and resolver reads; the gallery only declares the bound field and toolbar.

The outer page tabs are visible on narrow screens too, with their close buttons. Closing a page disposes its Source and iframe, removes the opened-page record and selects another open page. Selecting the same example in the tree can then open a fresh page. The inner Example, Explanation and Code tabs remain persistent views of that page.


<a id="ge-010-405"></a>
## 405 · Menus and toolbars in the main gallery

The owner requested all menu/slotbar examples in the main gallery and dialog/floating windows with frame toolbars at left, top and bottom. The **Menus and toolbars** family now follows **Containers and layout**. Its fourteen lessons cover popup, horizontal/vertical and contextual presentations, grouped overflow and scrolling, label/icon modes, classic hierarchy, reactive checked/disabled/hidden states, frame recipients, nested resolvers, a complete workspace, windows and three appearance profiles.

The main catalogue is the only lesson list; the former trial catalogue is retired. Page keys remain menu-01 through menu-14. Python and JavaScript twins use the same companion Data Bags and explanations. The existing menu-trial collection supplies registered SVG commands; its verified artifact, descriptor and the shared theme-preview helper are served by both gallery asset maps. No command registry is duplicated in pages.

Complete dialog and floating editors show three real frame regions: a vertical icon bar at left, a command bar above, and Cancel/Save below. They share the center recipient and draft Data. The simple Containers lessons also demonstrate all three regions with a stage selector in the left toolbar. Save in these examples is local Data only. Dialog blocks its page; floating leaves it usable. Each lesson explains the actions and expected result before the interactive area and in Explanation.

This integration is a local development preview, not a publication or a declaration that all gallery examples are visually accepted.

Verification (2026-10-25): 117 JavaScript tests and 18 Python tests plus 18 subtests pass. All fourteen pages rendered in the browser; gallery navigation, nested resolver command delivery, Save/Cancel, side-toolbar state and nonmodal background interaction were checked. Local preview: port 8099.


<a id="ge-010-410"></a>
## 410 · Loading indicators and cancelled tabs

The gallery uses the core IndexPage load outcomes: `loading`, then exactly one of
`ready`, `error` or `cancelled`. Its indicator follows the active Source-owned
entry on both selection changes and load outcomes. A background completion or
failure cannot hide another tab's loading indicator. Closing a pending tab clears
its indicator or shows the remaining selected load; reopening starts a separate
attempt, unaffected by late replies from the closed one. An active failure with
no remaining page retains the retry hint. Cancellation does not show an error.
No state is added to Logic or a separate registry. Requires the corresponding
updated core runtime; this local correction does not publish either package.

<a id="ge-010-945"></a>
## 945 · PageStore WebSocket trial

The additional Python catalogue at src/gramlot_examples/trials/page_store/catalog.json
contains four lessons: bidirectional Bag binding, publication-driven customer lookup,
publication from a family of iframes and connected windows, and publication to
another same-owner page's PageStore.
They use separate Page and PageStore classes, ordinary Source bindings and subscribed
controllers. The customer example uses pkey/status node attributes, explicit error
Data and preservation of the last valid record. There is no dataSetter or database dependency.

Run the PageStore development branch of gramlot-py-server with:
```sh
gramlot uvicorn gallery --websocket --port 8766 --mount /py \
  --catalog /absolute/path/to/trials/page_store/catalog.json \
            /absolute/path/to/trials/page_store/pages
```

The installed common gallery supplies the shell. Expand **PageStore and WebSocket**;
the ordinary source and explanation panels show the Python and teaching notes.
The staging integration preserves PageStore and current route URLs. Every lesson
has its own page ID and store, sharing the primary gallery socket. This trial does
not claim released support in other adapters or the JavaScript gallery.

The family lesson reuses the customer page in a direct iframe and inside an
intermediate iframe. Every customer page can open another connected copy using
an ordinary anchor with target=_blank and rel=opener. Each child publishes to
its own PageStore without knowing the parent chain. The gallery remains the
primary and owns the sole physical WebSocket. The supporting nested-branch
page is available in the same section for source inspection.

In **Publish to another page**, copy the recipient iframe's visible page ID into
the connected sender window. The sender publishes with an explicit pageId and
shows acceptance or refusal. The recipient's subscribed controller changes its
own Bag, delivered through its binder; the sender's record stays unchanged.
An accepted publication may still produce a business error in the recipient.
Unknown or foreign-owner destinations are refused without closing the channel.

Chromium and WebKit verify tree navigation, both binder directions, lookup success,
missing-key preservation and recovery, source/explanation, and one shared socket.
The fixtures use keys 1 and 2; 99 demonstrates a business error. No publication
or deployment is authorized by this local gallery request.


Family lesson verification, 2026-10-27: Chromium and WebKit exercise publication
from direct/nested customer iframes, connected windows and a further popup
generation. Distinct page IDs, isolated stores, error recovery and one WebSocket
are verified, together with continued sibling operation after intermediate
closure and recursive popup closure when the primary gallery closes.
A false shutdown channel error was fixed in core with explicit owner approval;
the final browser checks report no console errors.


Cross-page verification, 2026-10-27: Chromium and WebKit confirm recipient-only
changes, sender acceptance, business errors in recipient Data, refusal of unknown
and foreign-owner destinations, recovery and one primary socket. The existing
binder, family and recursive closure scenarios pass in the same browser run.


Sender metadata, 2026-10-27: the cross-page lesson's recipient displays
**Published by page**, copied by its controller from
_subscription_metadata["pageId"] into customer?sender_page_id. It identifies
the publishing child; the server supplies it separately from the payload.
Chromium and WebKit verify the displayed ID on success, error and recovery.


The cross-page lesson also demonstrates a server-to-browser event. On successful
lookup the recipient PageStore publishes customer_loaded to the sender page_id.
A subscribed browser dataController writes a separate notification branch and
shows the returned key/name under **Server event**. The recipient retains its
bound customer record; the sender's own bound record remains unchanged. A failed
lookup updates recipient error Data and emits no customer_loaded event.


The sender's **Server event — PageStore ID** shows the reverse event's verified
origin: its subscribed dataController reads _subscription_metadata.pageId into
notification.sender. This is the recipient PageStore's ID, not the original
sending child or the primary gallery. The server supplies it outside payload.


Current-base release qualification, 2026-10-27: the complete example suites pass
62 Python tests and 178 subtests (one existing skip), and 316 JavaScript tests
against the integrated core artifact. The manual validates 111 shared lessons
and all local links. Chromium and WebKit pass the complete PageStore trial
catalogue from clean installed candidate wheels, including sender metadata,
reverse publications, owner refusal/recovery and one primary WebSocket.
The owner authorizes publication and both hosted-gallery updates. The required
core is consolidated on main; consumer source-based CI can now verify the
release candidate. These Python trials remain an explicit additional catalogue;
the standard hosted galleries keep their common cross-environment catalogue.


<a id="ge-010-950"></a>

## 950 · Kajenn and Asqueel SQLite trial

The optional catalogue `src/gramlot_examples/trials/kajenn_db/catalog.json` contains
customer read/save and page-family lessons. It uses a separate PageStore, ordinary
Data bindings and subscribed controllers. The model and Python pages live in this
package; `scripts/serve_kajenn_db_gallery.py` in gramlot-py-server configures Kajenn,
kajenn-db's Asqueel handler, a dedicated SQLite file and the gallery's WebSocket.
Use the matching releases with host database access.

From that adapter checkout, run `python scripts/serve_kajenn_db_gallery.py
--database /absolute/path/demo/customers.sqlite --port 8768` and open
`http://127.0.0.1:8768/py/`. Expand **Kajenn and Asqueel**. A new database receives
two customers; subsequent launches preserve all records. This is an explicit
optional catalogue, not a change to the standard hosted galleries.

Changing the requested key loads a record. Save publishes to a subscribed server
controller, which validates and explicitly commits or rolls back. Loaded ID,
record, status and error return as Data through binders. Missing IDs preserve the
previous record; failed saves preserve the draft and stored data. Each iframe or
connected window has an independent draft. Reload reads another window's committed
save; the last successful save wins. The gallery owns one physical WebSocket,
including nested frames and descendant windows. Synchronous controllers do not
exercise the separate async database cancellation issue tracked in Kajenn #89.

See the trial README for the full flow, test cases and verification commands.

Local qualification, 2026-10-28: Chromium and WebKit pass reads, saves, missing
keys, validation, duplicate-email rollback/recovery, nested frames and descendant
windows with one primary WebSocket and cascading closure. The adapter startup
test confirms existing records are preserved. Examples pass 62 Python tests and
178 subtests (one existing skip); the manual validates 111 lessons and local links.
The optional catalogue is implemented and locally verified, awaiting owner review;
no package publication or hosted-gallery deployment was performed.


<a id="ge-010-form-state"></a>
## Local form lifecycle trial — 2026-10-29

`form-state` (Fields → Forms and validation → Form state) is the first bounded
form lifecycle exercise. Python and JavaScript use the same TYTX record. A reusable
field method and an action method keep the page small. `form=True` owns the local
Source registers; the separate `ui` Data scope displays the derived status.

Try Mario → Luigi → Mario, an empty required name, a negative amount, incomplete
number/date text and the remote-reserved code `taken`. Save locally accepts a
snapshot; Restore restores it through the existing controls. This does not save
to a database and does not implement undo/redo or Invoice. Core contract: GC-380
§060. The feature index links this lesson under Validation / Form state.

Local verification: form-state Python/JS Source parity, feature-index/sample-data
checks and Python gallery route/endpoint checks pass. Uvicorn/browser interaction
covers clean/changed/error/pending, invalid typed Data, incomplete drafts and
restore. These checks initially exposed a separate Gallery tray authoring error.

Owner-requested follow-up, 2026-10-29: Gallery tray now passes `result_path` and
`formula` as named JavaScript attributes instead of Python positional arguments.
All 115 page-collection and Python/JavaScript Source-parity tests pass. Browser
verification of the JavaScript lesson added a Form state card, edited its name,
then added, removed and added a second card. The count updated and the first
card retained its edited Data and changed status, with no console errors.
This resolves the Gallery tray release follow-up; no runtime change was needed.

## 950 · Progressive Grid family — 2026-10-28

The gallery index now has a separate **Grid** family, under `pages/05-grid`.
Its six lessons progress from Bag values and row attributes through grouped
columns, multiline cells and row heights, multicolumn sorting and self row drag,
a shared collection store displayed by two grids, and the complete FrameGrid.
Each lesson has Python/JavaScript Source, explanatory Markdown and sample Data.
The existing FrameGrid moves from Menus and toolbars; its stable lesson key
`menu-15` is retained, with one implementation at `05-grid/06_frame_grid`.
The five new lesson keys are `grid-01` through `grid-05`. The common catalogue
now has 117 lessons. Themes remain selected in the gallery Settings.

The shared-store lesson demonstrates shared order with distinct per-grid heights;
it does not imply independently ordered child stores. Cells remain read-only.
No framework capability is added by this gallery organization increment.


<a id="ge-010-unified-consolidation-base"></a>
## Unified local consolidation base — 2026-10-29

Owner requested a combined worktree before further consolidation branches.
The common catalogue now includes seven Grid lessons alongside the first form
state example and the corrected Gallery tray. Optional Base/Asqueel, PageStore
and Kajenn database catalogues are served by the common local Python preview at
http://127.0.0.1:61505/. Invoice remains excluded; Remote Edit is disabled.

The common catalogue has 147 routes. Grid imports and demo commands were rebuilt
with the integrated core. Catalogue totals and naming checks were updated; the
JavaScript fixture now loads the same Grid collection as the example pages.
All 120 checks in the affected JavaScript files pass; the other 212 checks passed
in the initial complete run. An additional shared-view regression verifies that
an update affects both views, preserves the original Bag order and keeps both
widget instances. All nine Python catalogue checks pass after the one stale
count in the full run (65 passed, one skipped, 186 subtests).

The browser shared-view exercise also passed: the same row remains in the
category view and leaves/re-enters the quantity view as its value changes.
This is a local checkpoint, not package publication or final release acceptance.
Logs and the import manifest: /private/tmp/gramlot-grid-integration-20261029/.

<a id="ge-010-095"></a>
## 095 · Grouplet development lessons

The owner requested incremental grouplet delivery with runnable gallery cases and
the required Python @source methods (2026-10-28). The separate grouplets gallery
worktree includes g01 customer onboarding (person/company and shared contact),
g02 order billing/shipping addresses, and g03 a service-visit site dossier with
nested contact/address editors under pages/09-grouplets. Each includes Python/JS
twins, complete fields, live summaries, instructions and standard sample Data
companions. These scenarios supersede the initial sparse mechanism-only cases
after owner feedback requesting useful examples based on legacy tests. The gallery resource inventory includes the prepared
optional grouplets collection; each lesson declares its own dependency.

Use the matching core grouplets development build. These pages exercise the base
component and the first card increment, not a resource catalogue, persistence or
shared form/wizard/grid lifecycle. Source remains Python-first; @source methods are visible in the normal
Code tab. No new runtime mechanism or public deployment is part of this increment.

The revised lessons draw on legacy 01_grouplet_basics.py, 08_grouplet_edge_cases.py,
address_fields.py and recursive_grouplet.py. Seven targeted parity/behavior/naming
tests and six endpoint/navigation tests pass. Chromium checks the actual Python
gallery: customer drafts survive type changes; shipping remains independent of
billing; nested edits survive outer reload. Complete Code-tab sources and narrow
viewport overflow are checked. No page/HTTP errors. Implemented and locally
verified on 2026-10-28; owner acceptance pending.


<a id="ge-010-100"></a>
## 100 · Order review with grouplet cards

The owner confirms the first groupletCard increment on 2026-10-28. Lesson g04,
04-order_cards, is a complete order dossier with customer contacts, billing
address, delivery planning and a nested workshop-address card. The customer has
static authored fields; order_cards, order_delivery_fields and
order_address_fields provide the remote Source. Code includes all Python @source
methods and the JavaScript twin has equivalent Source.

Header titles use ordinary Data bindings. Each card declares its own collapsed
and checkbox ^ paths; there is no implicit local workspace. The example covers
top/left/right headers, native keyboard collapse, independent nested fold states,
external fold/review controls, a review counter and live dispatch briefing.
Reloading Source preserves the draft and states in the existing Data paths.
Review marks are a checklist; no validation or database save is implied.

Build, nine targeted gallery tests and six protocol/navigation tests pass. All
four grouplet lessons pass in Chromium against the real Python gallery, with
actual RPC counts, Code definitions, editing, keyboard and narrow-overflow checks.
Full desktop and 390px captures are inspected. Implemented and locally verified;
owner acceptance pending. No publication or deployment. Menu/Clear, inline docs
and shared form integration remain later increments. Core records three expected
failures in upstream Python Builder validation of invalid literal state strings;
the supported boolean/binding path works and invalid states fail in the browser.


Visual revision, 2026-10-28: following owner feedback that the CSS was unreadable,
the card side headers use content-height blocks, larger chevrons and clearer
field spacing. Lesson g04 uses existing col_min_width formlets and inline toolbar
labels; source CSS is reformatted. Keyboard/edit/reload behavior remains verified.
The previous visual presentation is superseded, pending owner review of this one.


Checkbox captions, 2026-10-28: owner requests checkboxLabel. Lesson g04 now
shows Reviewed beside each customer/invoice/delivery header checkbox. Clicking
the caption checks the section and updates the review counter. The caption is
the accessible name, with native label semantics. Python/JS parity and actual
Chromium label-click/reload checks pass, including narrow layout.


<a id="ge-010-105"></a>
## 105 · Shipping desk: card menus and scoped Clear

Owner confirms this incremental groupletCard contract on 2026-10-28. Lesson g05
provides complete shipping management for order SO-1042: custom Morning delivery
and Prepare contact note menu actions, editable contact/delivery fields, a nested
remote address, invoice lock, tracking reference, live briefing and remote reload.
Its two Python @source methods and matching JavaScript definitions are visible
in Code. Nothing is sent to a contact or persisted to a database.

Direct card.menu()/menuline authoring uses the shared menu in the card header.
The nullable boolean delitem hides (null), disables (false) or enables (true) the
built-in Clear entry. Clear asks for confirmation and nulls only writable value
fields within the card Data scope, including nested fields. It retains order and
invoice details, non-field Data and fold/review state. The nested address card
also demonstrates Clear without custom menu entries. A reactive formula derives
the gate from the invoice checkbox; cancellation/locking prevent writes.

Verified with Python/JavaScript Source and endpoint parity, the JavaScript lesson
workflow and Chromium against the Python gallery: custom actions, nested/full
Clear, Cancel, disabled entries, keyboard/focus, preserved state after reload,
Code definitions and narrow overflow. Desktop/narrow captures inspected.
Owner UI acceptance remains pending; this example adds no form/save engine.


<a id="ge-010-110"></a>
## 110 · Customer handover: inline card guides

Owner selects the first card-local guide increment on 2026-10-28. Lesson g06
contains complete customer/delivery/address forms, useful Markdown guides and a
live handover summary. The delivery guide uses ordinary Data/formulas to show the
current customer, contact and destination. Three Python @source methods and their
JavaScript twins are visible in Code.

Use the information button while the card is open or folded; Enter/Space activates
it and Escape/Close returns focus. Outside pointer/focus movement dismisses it.
Empty doc content hides the opener. Show delivery guide and Reload guided cards
demonstrate content visibility and preservation of edits/review/fold state.

Source/endpoint parity and the JS workflow pass. The actual Python gallery also
passes Chromium keyboard/focus, contextual values, folded/nested guide, hiding,
reload, no guide RPC, Code and narrow geometry checks; captures are inspected.
Owner UI acceptance remains pending. Shared documentation addresses, manual/notes
storage, editing, languages and permissions remain a separate resources/Kajenn
increment by explicit owner choice; this lesson simulates none of that machinery.


<a id="ge-010-115"></a>
## 115 · Grouplets in the common local gallery — 2026-10-29

The owner authorizes review and integration of the Grouplets worktree into the
common base while preserving the originals and excluding the Invoice application.
The six lessons g01–g06 now accompany Grid, chat, ordinary and mobile examples.
Their billing/invoice fields are synthetic local example Data, not an import of
the excluded Invoice application. The catalogue has 154 routes, including the
Grouplets section introduction. Collection activation remains page-specific.

All six pages are exercised in the real Python gallery: customer-type draft
retention, independent addresses, nested remote reload, card fold/review retention,
menu actions and cancel/confirm Clear, and contextual Markdown guides. A narrow
390px viewport retains usable fields without horizontal content overflow. Remote
Edit remains disabled. The complete preview is http://127.0.0.1:61509/.

Earlier sections record the original worktree checks. The common-base receipt
adds current qualification and keeps the shared resource/form follow-up explicit.
No deployment, package release, TestFlight upload or full documentation-site
rebuild is claimed by this local integration.
