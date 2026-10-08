# The gallery package

<!-- Document ID: GE-010 -->
<a id="ge-010-005"></a>

## 005 · Contents

`gramlot-examples` is published on PyPI as `gramlot-examples` (module
`gramlot_examples`) and on npm as `@gramlot/gramlot-examples`. It depends only on the
Gramlot core: `gramlot` 0.2.12 or later, `@gramlot/gramlot` 0.2.12 or later. It
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

- The common families use the keys `e01`–`e13`, `b01`–`b11` and `c01`–`c08`.
  Keys are stable within a release. 0.2.8 renumbered the controllers after
  removing the remote Source example.
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
preview and the source code. The Python panel follows the source with the logic module
(`Logic · NN_name.js`); the JavaScript page module already shows its `Logic`, and an
environment companion `NN_name_aux.js` gets a pane of its own.
Previously opened examples remain mounted, preserving native input state. Example
iframes load on their first opening.

The gallery uses ordinary Source-authored HTML and explicit element IDs, such as
`open-e01`, `tab-e01`, `panel-e01`, `divider-e01` and `gallery-theme`. The bundled
`gallery/browser/` JavaScript connects events to those IDs. A page-local Bag holds
active and open tabs, keyboard preference, theme and split positions. There are no
tab, split, Markdown or theme markers interpreted by the Gramlot core. Amendment 11.44
of the
[Gramlot constitution](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md)
recorded this page-local exception for the runner in the core. Amendment 11.56
supersedes it: the gallery left the core for this repository.

The **Keyboard navigation** checkbox adds example links and the active tab to the tab
order; arrows, Home and End move among opened tabs. Splitters start at 65% preview
width and remain within 20–80%. The theme selector updates the gallery and its example
frames; frame scripts accept only the parent window's light/dark messages. Each family
is a native `details`: its `summary` holds the family link, and the first family starts
open.

`gallery/page.js` reads README, source and logic texts and passes them to
`gallery/gallery-page.js`, which has no filesystem API, so a static export without a
server can use the same module. `gallery/page.py` reads the same texts in `main`.

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
  Controllers page, mounted in jsdom with the core and the module's `Logic`.
- `tests/gallery.test.js`: the gallery UI in jsdom; with `tests/test_gallery_page.py`, the
  default and subclass values of `logoUrl` and `galleryScript` in both languages.
- `tests/build-gallery.test.js` and `tests/test_build_gallery.py`: the same cases in
  both languages, with the environment catalogue in `tests/fixtures/environment/`.
- `tests/test_pages.py`: every Python route opens through the core `GramlotFileServer`, links its
  page module as the logic and returns Source.
- `scripts/verify_pages_browser.mjs` (CI job `browser`): `scripts/serve_pages.py` and
  `scripts/serve_pages.mjs` serve the pages folder with the core `GramlotFileServer`; Chromium
  opens every page in both languages and calls the `Logic` of b08, c03 and c08.
  `scripts/verify_e10_e13_browser.mjs` runs on the same servers. The gallery commands of
  `gramlot-py-server`, `@gramlot/gramlot-js-server` and `@gramlot/gramlot-serverless`
  are checked in a browser in their own repositories.

<a id="ge-010-040"></a>

## 040 · Release

The version is the same in `pyproject.toml` and `package.json`; the core version it
requires is the dependency floor of section 005. `.github/workflows/publish.yml` runs by hand on the version tag on
`main`: it checks versions and release notes (`.github/release-notes/vX.Y.Z.md`), runs
`tests.yml`, builds the bundle, the wheel, the sdist and the npm tarball, checks that
the packaged bundle is the fresh build, creates the GitHub release with `SHA256SUMS`,
and publishes to PyPI and npm with trusted publishing from the environment `release`.
