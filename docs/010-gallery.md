# The gallery package

<!-- Document ID: GE-010 -->
<a id="ge-010-005"></a>

## 005 · Contents

`gramlot-examples` is published on PyPI as `gramlot-examples` (module
`gramlot_examples`) and on npm as `@gramlot/gramlot-examples`. It depends only on the
Gramlot core: `gramlot` 0.2.17 or later, `@gramlot/gramlot` 0.2.17 or later. It
contains no server code.

| Content | Source | PyPI | npm |
| --- | --- | --- | --- |
| Example pages | `src/gramlot_examples/pages/<family>/NN_name.{py,js}` | `.py` | `.js` |
| Page modules (`Page` and `Logic`) | `NN_name.js` | yes | yes |
| README, stylesheet | `NN_name.md`, `NN_name.css` | yes | yes |
| Family README | `pages/<family>/README.md` | yes | yes |
| Common catalogue | `src/gramlot_examples/catalog.json` | yes | yes |
| Gallery page | `gallery/page.py`, `gallery/page.js` with `gallery/gallery-page.js` | `page.py` | `page.js`, `gallery-page.js` |
| Gallery stylesheet and bundle | `gallery/gallery.css`, `gallery/dist/` (built by `npm run build`) | yes | yes |
| `build_gallery` / `buildGallery` | `__init__.py`, `index.js` | `__init__.py` | `index.js` |

The gallery browser sources (`gallery/browser/`) are bundled into `gallery/dist/` and
are not published. The theme (`/themes/gramlot-base/theme.css`) and the logo
(`/assets/branding/gramlot-logo-dark.svg`) come from the installed core package:
`gramlot/resources/themes/…` and `gramlot/resources/assets/branding/…` in the wheel,
the exports `@gramlot/gramlot/themes/*` and `@gramlot/gramlot/assets/branding/*` on npm.

<a id="ge-010-010"></a>

## 010 · `catalog.json`

A catalogue is an object with `families`. Each family has `key`, `title` and
`examples`; each example has `key`, `title`, `folder`, `description` and
`explanation`. The pages of a family live in the folder named by the family `key`;
`folder` is the file stem of an example (`06_forms` for `06_forms.py`, `06_forms.js`,
`06_forms.md`).

```json
{
  "environment": "django",
  "families": [
    {"key": "django_pages", "title": "Django", "examples": [
      {"key": "django-01", "title": "Quick start", "folder": "01_quick_start",
       "description": "…", "explanation": "…"}
    ]}
  ]
}
```

The common catalogue of this package has no `environment`. The catalogue of an
environment (an adapter or a runtime) declares it.

<a id="ge-010-015"></a>

## 015 · Keys

- The common families use the keys `e01`–`e13`, `b01`–`b11` and `c01`–`c19`.
  Keys are stable within a release. 0.2.8 renumbered the controllers after
  removing the remote Source example; 0.2.10 added `c09`–`c11` (`dataRpc`), 0.2.11 added `c12`–`c14`
  (`remote` and `dataRemote`).
- An environment names its examples `<environment>-NN`: `django-01`, `flask-01`,
  `bun-01`, `serverless-01`.
- Family keys and example keys are one namespace with `index`, the gallery route.

`build_gallery` raises an error when the common catalogue declares an environment,
when an environment catalogue has none, when an example key does not match
`<environment>-NN`, when a key is duplicated, and when a page file is missing.

<a id="ge-010-020"></a>

## 020 · `build_gallery` and `buildGallery`

```python
from gramlot_examples import build_gallery

gallery = build_gallery([("django/catalog.json", "django/pages")])
```

```js
import {buildGallery} from '@gramlot/gramlot-examples';

const gallery = buildGallery({catalogs: [['bun/catalog.json', 'bun/pages']]});
```

Each item of `catalogs` is a pair: the path of an environment `catalog.json` and the
folder that holds its family folders. The common catalogue always comes first. The
result has three parts:

- `families`: the families of all catalogues, each with `path`, its pages folder;
- `routes`: key → `page`, `stylesheet`, `logic`. `page` is the `.py` file in Python
  and the `.js` file in JavaScript; `stylesheet` is the same-name `.css` file, or
  `None`/`null`. `logic` is the module whose `Logic` export the server takes:
  `NN_name_aux.js` when it exists, else `NN_name.js` (in JavaScript the page module
  itself), else `None`. Every common example has `NN_name.js` and no `_aux.js`; an
  environment page can still use `NN_name_aux.js`. The server reports a page with both.
  The `index` route is the gallery page;
- `assets`: URL → `file`, `type`. The theme, the logo, `/gallery/gallery.css`,
  `/gallery/dist/*` and the source files of every example under
  `/pages/<family>/<file>`. Only the built scripts in `gallery/dist/` are
  `application/javascript`; example sources are `text/plain`.

The functions read the catalogues and check files. They write and serve nothing.

<a id="ge-010-025"></a>

## 025 · Serving a gallery from an environment

An environment serves the gallery with its own server and static-file mechanism:

1. For each example route it stages one page module named after the key. The module
   extends the original Page and appends `script(src="/gallery/dist/frame.js")` to the
   root, so the example frame follows the gallery theme. The teaching pages are not
   changed.
2. It copies `stylesheet` beside the staged module, named after the key (`e06.css`):
   the core `GramlotFileServer` links it as the same-name stylesheet. It serves `logic` as
   JavaScript at a URL of its own and stages a one-line `<key>_aux.js` that re-exports
   `Logic` from that URL (`export {Logic} from "/…/03_named_logic.js";`). The page
   module imports `@gramlot/gramlot/page`, which the import map of the bootstrap
   resolves to the runtime (core 0.2.5).
3. For `index` it stages a subclass of the gallery page that sets `catalogs` to the
   environment catalogues, so the gallery lists the common families and its own. The
   same subclass sets `logoUrl` and `galleryScript` when it serves the logo and the
   gallery script at other URLs, for example under its mount
   (`/py/assets/branding/gramlot-logo-dark.svg`, `/py/gallery/dist/gallery.js`). The
   attributes have the same names and defaults (`/assets/branding/gramlot-logo-dark.svg`,
   `/gallery/dist/gallery.js`) in `gallery/page.py` and `gallery/page.js`.
4. It serves every URL of `assets` with its media type. A server mounted under a prefix
   that links `Page.css` under that prefix (`/py/themes/gramlot-base/theme.css`) serves
   the stylesheet assets under the prefix too.

The gallery page links each example by its key relative to the page URL, so the
examples stay under the same mount (`/py/e01`, `/js/e01`).

These gallery commands follow the steps above:

- `gramlot <environment> gallery` of `gramlot-py-server` (extra `gallery`), for
  example `gramlot django gallery`;
- `gramlot node gallery` and `gramlot bun gallery` of `@gramlot/gramlot-js-server`;
- `gramlot-serverless gallery <folder>` of `@gramlot/gramlot-serverless`: a static
  folder that opens from disk (`<folder>/index.html`), with no server.

The development runner that served the examples before this package
(`runner/serve.py`, `runner/server.mjs`, `runner/build-standalone.mjs`) remains only in
the history of this repository.

<a id="ge-010-030"></a>

## 030 · Gallery page behavior

A short introduction opens first, with no example frame. A compact title list sits on
the left, with the examples nested below their family. Selecting a title opens or
reactivates its own tab; each panel renders the example's README above a resizable
preview and the source code. The Python panel offers the nonempty Logic class in a separate `logic.js` tab; the JavaScript page module already shows its `Logic`, and an
environment companion `NN_name_aux.js` gets a tab of its own.
Previously opened examples remain mounted, preserving native input state. Example
iframes load on their first opening.

The gallery extends the core `IndexPage`, with ordinary Source-authored HTML
and explicit IDs such as `open-e01`, `tab-e01`, `panel-e01` and `index-theme`.
Core index behavior owns navigation, tabs, preferences and the sidebar splitter;
`gallery/browser/` adds README/source rendering, preview splitters and the inspector.
State remains in Bags and changes update Source. Constitution 11.63 approves
this bounded reusable extraction; gallery catalogues and teaching content remain
in this repository, following 11.56. No generic widget markers are introduced.

The **Keyboard navigation** checkbox adds example links and the active tab to the tab
order; arrows, Home and End move among opened tabs. Splitters start at 65% preview
width and remain within 20–80%. The theme selector updates the gallery and its example
frames; frame scripts accept only the parent window's light/dark messages. Each family
is a native `details`: its `summary` holds the family link, and the first family starts
open.

`gallery/page.js` reads README, source and logic texts and passes them to
`gallery/gallery-page.js`, which has no filesystem API, so a static export without a
server can use the same module. `gallery/page.py` reads the same texts in `main`.

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
lists 43 common pages, but older installed packages can have fewer. A startup
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

The full-width gallery footer contains Theme (Base/Compact), Color mode
(Light/Dark), Keyboard navigation and Inspector. Controls wrap on narrow screens; the footer
stays visible below the scrolling sidebar and example workspace. Compact and Light are the defaults when no valid preferences have been saved. Appearance and
color are independent and reach every open example without reloading its frame.
Base uses 14px UI text; Compact uses 13px; code stays 12px. The browser build embeds
the canonical `gramlot-compact/theme.css` exported by the installed core, with no
second authored copy of its rules and no additional runtime request. Gallery and
frame styles belong to Source; their media attribute enables Compact or disables
it for Base. Direct example pages retain their declared `Page.css`.

The sidebar starts at 240px (180px below 800px; 140px below 640px). Its vertical
separator supports pointer dragging and Left/Right (10px), Home and End keys,
independently of the navigation keyboard checkbox. It is bounded between 120px
and the smaller of 460px or 60% of the viewport. Resizing the viewport clamps the
visible width; switching lessons or themes preserves it. Theme, color mode and
preferred sidebar width are saved in browser localStorage and restored on reload.
Preferences are separate per origin and gallery path (so Python and Node on different
ports keep independent choices). A narrow viewport limits the visible width without
overwriting the preferred width. Invalid saved values are ignored. If the browser
denies storage or its quota is exhausted, controls still work for the current page;
reload persistence is unavailable, including file exports where the browser disallows
localStorage. Source owns the controls and ARIA values; the local Bag owns current
interaction state. Only these three display preferences are stored, not example data.
Pointer capture and listeners are released during cleanup.
The preview/code divider keeps its 20–80% bounds. Long navigation labels may wrap;
the explanation occupies at most 28% of viewport height, leaving room for the
preview and source.

Server setup quick starts belong to the integration documentation, not gallery
sections. Default Python and Node/Bun galleries contain the common examples;
standalone additionally retains Registration form. Explicit environment catalogues
remain supported for application examples.

<a id="ge-010-035"></a>

## 035 · Checks

```sh
npm install --no-package-lock
npm run build
npm test
bun test ./tests
python -m pip install -e .
python -m unittest discover -s tests
```

- `tests/examples.test.js`: every family folder and file pair; every page module exports
  `Page` and `Logic`, and no common page has `_aux.js`; one behaviour of each Binding and
  Controllers page, mounted in jsdom with the core and the module's `Logic`. The core
  `GramlotFileServer` of the family folder answers the request envelopes in the same
  process: `main`, the endpoints of c08–c11 and c14 and the fragments of c12 and c13.
- `tests/gallery.test.js`: the gallery UI in jsdom; with `tests/test_gallery_page.py`, the
  default and subclass values of `logoUrl` and `galleryScript` in both languages.
- `tests/build-gallery.test.js` and `tests/test_build_gallery.py`: the same cases in
  both languages, with the environment catalogue in `tests/fixtures/environment/`.
- `tests/test_pages.py`: every Python route opens through the core `GramlotFileServer`, links its
  page module as the logic and returns Source; the Python endpoints of c08–c11 and c14 and
  the Python fragments of c12 and c13 answer their values and outcomes.
- `scripts/verify_pages_browser.mjs` (CI job `browser`): `scripts/serve_pages.py` and
  `scripts/serve_pages.mjs` serve the pages folder with the core `GramlotFileServer`; Chromium
  opens every catalogue entry in both languages and requires an observable behavior
  check for each entry. Checks include static structure, bindings, named Logic,
  lifecycle, local file exchange, endpoints of c08–c11/c14 and fragments of c12/c13.
  The exported `verifyExample(page, key, calls)` shares these assertions with
  integration checks; `calls` contains the observed request envelopes. Transport
  counts come from requests, not fragment mount counts.
  `scripts/verify_e10_e13_browser.mjs` runs on the same servers. The gallery commands of
  `gramlot-py-server`, `@gramlot/gramlot-js-server` and `@gramlot/gramlot-serverless`
  are checked in a browser in their own repositories.

`node scripts/verify_gallery_browser.mjs <gallery-URL> [...]` checks every common
lesson in delivered galleries: primary source visible height/width, a single
selected source, switching/keyboard, scroll preservation and retained previews.
Run it against Python, JS and Worker galleries after changing their presentation.

<a id="ge-010-040"></a>

## 040 · Release

The version is the same in `pyproject.toml` and `package.json`; the core version it
requires is the dependency floor of section 005. `.github/workflows/publish.yml` runs by hand on the version tag on
`main`: it checks versions and release notes (`.github/release-notes/vX.Y.Z.md`), runs
`tests.yml`, builds the bundle, the wheel, the sdist and the npm tarball, checks that
the packaged bundle is the fresh build, creates the GitHub release with `SHA256SUMS`,
and publishes to PyPI and npm with trusted publishing from the environment `release`.


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
