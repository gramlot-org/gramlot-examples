# 02 · Text and links

Text hierarchy, mixed inline content, quotation, code and two kinds of link.

## Run and files

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after the [runner prerequisites](../../00-runner/README.md). Open `http://127.0.0.1:8080/` and select **Text and links** and choose Python or JavaScript. Prerequisites: a local Python environment with Gramlot installed, the repository JavaScript dependencies and the runner adapter setup. `page.py` is the primary example; `page.js` builds the equivalent Source. Both load `/themes/gramlot-base/theme.css`. The direct routes are `/py/e02` and `/js/e02`. The runner provides source links beside the rendered page.

## How it works

A paragraph retains literal text while child strong, em, span and anchor nodes are appended. A pre/code pair shows source as escaped text. Python uses `root.tag(..., attr=value)` and JavaScript uses `root.tag(value, {attr: value})`; both build Gramlot Source with the same visible result. Helper methods, where used, are ordinary page methods and are not exposed as remote endpoints.

## Try it

Add an abbreviation and a second local destination.

## Limits

The external standards link requires network access; no content is fetched by the page. This example uses the native HTML/SVG Source increment only; Data bindings, controllers and resolvers are outside this teaching slice.
