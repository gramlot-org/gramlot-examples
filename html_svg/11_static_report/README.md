# 11 · Static report

A summary, SVG bar chart, visible legend and table from one local dataset.

## Run and files

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after the [runner prerequisites](../../00-runner/README.md). Open `http://127.0.0.1:8080/` and select **Static report** and choose Python or JavaScript. Prerequisites: a local Python environment with Gramlot installed, the repository JavaScript dependencies and the runner adapter setup. `page.py` is the primary example; `page.js` builds the equivalent Source. Both load `/themes/gramlot-base/theme.css`, plus local `style.css` for layout. The direct routes are `/py/e11` and `/js/e11`. The runner provides source links beside the rendered page.

## How it works

Dedicated methods build the summary, chart and table. Chart lengths and exact figures share the same values. Python uses `root.tag(..., attr=value)` and JavaScript uses `root.tag(value, {attr: value})`; both build Gramlot Source with the same visible result. Helper methods, where used, are ordinary page methods and are not exposed as remote endpoints.

## Try it

Add a region, then check summary, legend, chart and table.

## Limits

This is a fixed report; no data service or live refresh is used. This example uses the native HTML/SVG Source increment only; Data bindings, controllers and resolvers are outside this teaching slice.
