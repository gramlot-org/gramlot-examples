# 09 · SVG composition

A scene composed from repeated SVG groups, paths and helper methods.

## Run and files

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after the [runner prerequisites](../../00-runner/README.md). Open `http://127.0.0.1:8080/` and select **SVG composition** and choose Python or JavaScript. Prerequisites: a local Python environment with Gramlot installed, the repository JavaScript dependencies and the runner adapter setup. `page.py` is the primary example; `page.js` builds the equivalent Source. Both load `/themes/gramlot-base/theme.css`. The direct routes are `/py/e09` and `/js/e09`. The runner provides source links beside the rendered page.

## How it works

House, tree and flower methods add grouped shapes; loops repeat objects. Shared theme tokens color the scene. Python uses `root.tag(..., attr=value)` and JavaScript uses `root.tag(value, {attr: value})`; both build Gramlot Source with the same visible result. Helper methods, where used, are ordinary page methods and are not exposed as remote endpoints.

## Try it

Add a third house or vary flower positions.

## Limits

The scene is decorative and static. This example uses the native HTML/SVG Source increment only; Data bindings, controllers and resolvers are outside this teaching slice.
