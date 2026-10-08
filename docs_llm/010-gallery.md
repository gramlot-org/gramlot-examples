# The gallery package

<!-- Document ID: GE-010 -->
<a id="ge-010-005"></a>

## 005 · Contents

- PyPI `gramlot-examples` (module `gramlot_examples`), npm `@gramlot/gramlot-examples`.
  Depends only on `gramlot` / `@gramlot/gramlot` 0.2.12 or later. No server code.
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

- Common: `e01`–`e13`, `b01`–`b11`, `c01`–`c08`. Environment: `<environment>-NN`.
- Keys are stable within a release; 0.2.8 renumbered the controllers after removing
  the remote Source example.
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
  resizable preview, source; Python adds `Logic · NN_name.js`, JavaScript a pane only
  for an `NN_name_aux.js`.
- Explicit IDs (`open-e01`, `tab-e01`, `panel-e01`, `divider-e01`, `gallery-theme`);
  `gallery/browser/` connects events; page-local Bag for tabs, keyboard, theme, split.
  [Gramlot constitution](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md):
  exception recorded by 11.44 for the runner in the core; 11.56 supersedes it, the
  gallery left the core for this repository.
- Keyboard navigation, 65% split within 20–80%, light/dark theme passed to frames.

<a id="ge-010-035"></a>

## 035 · Checks

`npm run build`, `npm test`, `bun test ./tests`, `python -m unittest discover -s tests`.
Browser (CI `browser`): `serve_pages.py` / `serve_pages.mjs` (core `GramlotFileServer`) +
`verify_pages_browser.mjs` (every page, both languages, `Logic` of b08, c03, c08)
+ `verify_e10_e13_browser.mjs`. The gallery commands are checked in a browser in the
server repositories.
Fixture catalogue: `tests/fixtures/environment/`.

<a id="ge-010-040"></a>

## 040 · Release

Same version in `pyproject.toml` and `package.json`. `publish.yml` by hand on the tag
on `main`: validate, `tests.yml`, build, bundle check, GitHub release with
`SHA256SUMS`, PyPI and npm with trusted publishing (environment `release`).
