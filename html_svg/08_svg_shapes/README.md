# 08 · SVG shapes

Six SVG primitives in one accessible viewport.

## Run and files

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after the [runner prerequisites](../../00-runner/README.md). Open `http://127.0.0.1:8080/` and select **SVG shapes** and choose Python or JavaScript. Prerequisites: a local Python environment with Gramlot installed, the repository JavaScript dependencies and the runner adapter setup. `page.py` is the primary example; `page.js` builds the equivalent Source. Both load `/themes/gramlot-base/theme.css`. The direct routes are `/py/e08` and `/js/e08`. The runner provides source links beside the rendered page.

## How it works

The SVG dialect nests below an HTML figure. Coordinates, fill and stroke are native SVG attributes. Python uses `root.tag(..., attr=value)` and JavaScript uses `root.tag(value, {attr: value})`; both build Gramlot Source with the same visible result. Helper methods, where used, are ordinary page methods and are not exposed as remote endpoints.

## Try it

Move one shape and compare its coordinate attributes in both languages.

## Limits

This is a static illustration; no SVG animation or pointer behavior is declared. This example uses the native HTML/SVG Source increment only; Data bindings, controllers and resolvers are outside this teaching slice.
