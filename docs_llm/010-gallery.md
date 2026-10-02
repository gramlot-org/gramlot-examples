# Local example runner

<!-- Document ID: GE-010 -->
<a id="ge-010-005"></a>

One runner page lists the three families (`html_svg`, `binding`, `controllers`) and
opens each example in its own tab: README, resizable preview iframe, source code.
`/py/index` hosts the Python pages, `/js/index` the JavaScript pages.

<a id="ge-010-010"></a>

## 010 · Run locally

Python 3.11+, Node.js 22+, from the repository root:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[test]'
npm install --no-package-lock
.venv/bin/python runner/serve.py
```

- Python: `gramlot`, `gramlot-py-server[uvicorn]`. JavaScript: `@gramlot/gramlot`,
  `@gramlot/gramlot-js-server`, `@gramlot/gramlot-browser`.
- `PORT` selects the port (default 8080); `JS_RUNTIME=bun` runs the JavaScript host with Bun.
- One public Uvicorn address; an internal Node.js listener behind `/js/`.
- Theme `/themes/gramlot-base/theme.css` and logo `/assets/branding/` come from the
  installed `@gramlot/gramlot` (0.2.2 or later).
- The launcher builds `runner/dist/`, then stages wrappers `index`, `e01`–`e13`,
  `b01`–`b11`, `c01`–`c09` in a temporary directory. Same-name `.css` and `_aux.js`
  companions are copied beside the wrappers.

<a id="ge-010-015"></a>

## 015 · Current limits

- The code pane shows the original module and its logic companion.
- `runner/runner-page.js` has no filesystem API; `runner/page.js` and `runner/page.py` supply the texts.
- No in-page Inspector.

<a id="ge-010-020"></a>

## 020 · Provisional runner behavior

- Source-authored HTML with explicit IDs (`open-e01`, `tab-e01`, `panel-e01`,
  `divider-e01`, `runner-theme`); `runner/browser/` connects the events.
- A page-local Bag holds tabs, keyboard preference, theme and split positions.
- Recorded in amendment 11.44 of the
  [Gramlot constitution](https://github.com/gramlot-org/gramlot/blob/main/docs/00-constitution.md).
- `runner/catalog.json`: families, titles, summaries. A family key is its folder below `pages/`.

<a id="ge-010-025"></a>

## 025 · Checks

```sh
npm test
bun test runner/tests
.venv/bin/python -m pytest runner/tests
npm run build:runner
node scripts/verify_examples_browser.mjs URL PLAYWRIGHT_ENTRY CHROME [OUTPUT]
node scripts/verify_standalone_runner.mjs FILE_URL PLAYWRIGHT_ENTRY CHROME
```

`test_serve.py` is skipped while `gramlot-py-server` is not installed.

<a id="ge-010-030"></a>

## 030 · Standalone directory

`npm run build:standalone` writes `build/examples-standalone/` (or the directory given
as argument, which must be new): the runner with the HTML / SVG family only, opened
through direct file URLs. Binding and Controllers need a host with `remoteSource` and
logic companions. Startup and Workers belong to `@gramlot/gramlot-browser`.
