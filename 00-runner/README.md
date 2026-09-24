# Local example runner

A compact title list sits on the left. Selecting a title opens or reactivates its
own tab on the right. The panel contains a description and explanation above the
example iframe. Previously opened examples remain mounted, preserving native input
state. Only the catalogue starts open; other iframes load on their first opening.

The serving integration determines the source language. `/py/index` hosts Python
examples; `/js/index` hosts JavaScript examples. Relative iframe URLs stay under
the same integration. There is no language picker. Each panel links its current
language source and the full README. The default is the [HTML catalogue](catalog/README.md).

## Run locally

Use Python 3.11 or newer and Node.js 22 or newer. From the Gramlot repository
root, with the current sibling `gramlot-standalone` (Minimal) and
`gramlot-nodejs` checkouts present:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -e . -e '../gramlot-standalone[uvicorn]'
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

The launcher creates a temporary registry of tiny modules named `index`,
`catalog`, and `e01`–`e12`. Each one imports the original `Page` from this
directory or `../html_svg/`; no example code is copied into the registry.
The folders retain descriptive names even though the standard Host file loaders
accept only identifier-like route segments. The temporary directory disappears
when the runner stops.

## Current limits

The source links provide access to the original Python and JavaScript modules.
An in-page Inspector launcher awaits a shared Gramlot component and is not
emulated by this runner. Python pages run only through the Python host; JavaScript
pages run through the Node host. The catalogue classifies elements that belong
only in a document head or would execute or embed external content.

## Tab behavior ownership

Pages declare ordinary HTML through Source. Gramlot's shared HTML tab behavior
owns activation, open tabs and keyboard interaction; no event wiring is embedded
in either runner page. Active/open state is held in a component-owned Bag, and
Source attribute updates control tab/panel visibility and first iframe loading.
The renderer releases listeners when the component is removed or disposed.
Arrow keys, Home and End move among opened tabs. Closing/reordering tabs and
restoring them after a whole-page reload are outside this increment.

`catalog.json` contains titles and teaching summaries shared by both runner pages;
it is content metadata, not a second UI representation. Full examples stay in
their own directories with their READMEs.
