# Local example runner

A short introduction opens first, with no example frame. A compact title list sits
on the left. Selecting a title opens or reactivates its own tab on the right. Each
panel renders the example's README above a resizable preview and the actual source code.
Previously opened examples remain mounted, preserving native input state. All
example iframes load on their first opening.

The serving integration determines the source language. `/py/index` hosts Python
examples; `/js/index` hosts JavaScript examples. Relative iframe URLs stay under
the same integration. There is no language picker. The HTML / SVG category
opens its own README; its thirteen examples are nested below it in the sidebar.

## Run locally

Use Python 3.11 or newer and Node.js 22 or newer. From the Gramlot repository
root, with the current sibling `gramlot-minimal` (Minimal) and
`gramlot-js-server` checkouts present:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -e . -e '../gramlot-minimal[uvicorn]'
npm --prefix js install --no-package-lock
npm --prefix js run build
npm --prefix examples install --install-links --no-package-lock
.venv/bin/python examples/00-runner/serve.py
```

Open <http://127.0.0.1:8080/>. Set `PORT` to use another local port. The
launcher starts one public Uvicorn address and an internal Node.js listener.
The local Node adapter and Python Minimal adapter keep their own normal Page,
main and Source contracts; the launcher supplies only static files and local
request forwarding. The theme is served from `/themes/gramlot-base/theme.css`.

The launcher first builds the runner browser scripts, then creates a temporary
registry of tiny modules named `index` and `e01`–`e13`. They import the original
Page. Example wrappers append the runner-owned frame-theme script through an
ordinary Source `script` element; the teaching pages themselves are unchanged.
The folders retain descriptive names even though the standard Host file loaders
accept only identifier-like route segments. The temporary directory disappears
when the runner stops.

## Current limits

The code pane shows the original Python or JavaScript module, read by the host and
delivered as Gramlot Source text. The README is read from the example directory
and rendered by the runner-local sanitized Markdown helper.
The JavaScript UI lives in `runner-page.js` and accepts the category README and
each example's title, README and source text from its Page subclass. The local
Node host supplies those texts in `page.js` along with explicit frame and logo URLs;
the UI module has no filesystem API.
An in-page Inspector launcher awaits a shared Gramlot component and is not
emulated by this runner. Python pages run only through the Python host; JavaScript
pages run through the Node host.

## Provisional runner behavior

The runner uses ordinary Source-authored HTML and explicit element IDs, such as
`open-e01`, `tab-e01`, `panel-e01`, `divider-e01` and `runner-theme`. Its own
`browser/` JavaScript connects events to those IDs. There are no special tab,
split, Markdown or theme markers interpreted by Gramlot core.

A page-local Bag holds active/open tabs, keyboard preference, theme and split
positions. Existing Source attribute updates control visibility, iframe loading,
ARIA and sizing; the existing renderer disposal hook releases the page's listeners
and pointer capture. A rebuilt runner shell reloads its ordinary script. README
and code views are static text decorations owned by the runner, not general live
Markdown/highlight framework capabilities.

The **Keyboard navigation** checkbox adds example links and the active tab to the
tab order; arrows, Home and End move among opened tabs. Splitters start at 65%
preview width and remain within 20–80%. The theme selector updates the runner and
its owned example frames. Frame scripts accept only the parent window's light/dark
messages, including direct-file exports. No theme listener is installed by core.

`build-browser.mjs` bundles these helpers and their dependencies into `dist/`,
alongside license notices. Both the launcher and standalone builder run it.
The JSR core package excludes this provisional runner implementation. Future web
components may replace it after their API is explicitly approved; no such API is
introduced here. This bounded page-local exception is recorded in constitution
11.44 and does not change the application authoring rules elsewhere.

Run the runner checks separately from core:

```sh
npm --prefix examples test
npm --prefix examples run build:runner
```

`catalog.json` contains titles and teaching summaries shared by both runner pages;
it is content metadata, not a second UI representation. Full examples stay in
their own directories with their READMEs.

The approved Gramlot logo heads the sidebar. The Light/Dark selector at its bottom
applies to the runner and to all loaded or subsequently opened example iframes.

Examples are nested under their HTML / SVG category. Selecting the category
opens its folder README without an iframe. Example panels start with a 65/35
preview/source split and preserve the adjusted proportion when switching tabs.

To run the JavaScript host with Bun installed locally:

```sh
JS_RUNTIME=bun PORT=8092 .venv/bin/python examples/00-runner/serve.py
```

Open `http://127.0.0.1:8092/js/index`. Bun executes the JavaScript integration;
the development launcher still serves shared assets and forwards requests through
its public Uvicorn address. `JS_RUNTIME=node` is the default.

## Standalone directory

Build the core runtime and refresh the example dependencies, then export:

```sh
npm --prefix js run build
npm --prefix examples install --install-links --no-package-lock
node examples/00-runner/build-standalone.mjs
```

Open `build/examples-standalone/index.html` directly in the browser. Keep the
whole exported directory together. It contains the runner, thirteen example
HTML documents, bundled Worker text and all local styles and assets. Classic
scripts start Blob Workers without fetching source: each JavaScript Page runs
through Gramlot's ordinary Page/main path. No server or external CDN is required.
Relative asset paths and an explicit export root preserve the Page.css declarations.
The directory may also be served by an ordinary static HTTP server.

An optional argument to `build-standalone.mjs` selects the destination directory.
The exporter requires a new destination; choose another output path for a second
build or remove only a previously generated export before rebuilding.
The standalone runner shares `runner-page.js` with the Node/Bun integration;
README and original source text are supplied when packaging, without executing
the Page at build time. Python examples remain hosted Python pages.

Standalone startup and Worker communication belong to gramlot-minimal. The export
requires matching development core and Minimal packages; published 0.1.0 archives
are unchanged. The runner owns only its provisional UI behavior.
