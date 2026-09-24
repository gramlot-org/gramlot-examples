# 12 · A complete page

A composed event page with sections, schedule, speakers, schematic map and FAQ.

## Run and files

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after the [runner prerequisites](../../00-runner/README.md). Open `http://127.0.0.1:8080/` and select **A complete page** and choose Python or JavaScript. Prerequisites: a local Python environment with Gramlot installed, the repository JavaScript dependencies and the runner adapter setup. `page.py` is the primary example; `page.js` builds the equivalent Source. Both load `/themes/gramlot-base/theme.css`, plus local `style.css` for layout. The direct routes are `/py/e12` and `/js/e12`. The runner provides source links beside the rendered page.

## How it works

Page methods divide the header, hero, highlights, schedule, speakers, SVG map and FAQ. Nested loops build rows and map labels. Python uses `root.tag(..., attr=value)` and JavaScript uses `root.tag(value, {attr: value})`; both build Gramlot Source with the same visible result. Helper methods, where used, are ordinary page methods and are not exposed as remote endpoints.

## Try it

Add a session, speaker and FAQ; update the map with another stop.

## Limits

The schedule and map are illustrative; there is no booking, routing or remote data. This example uses the native HTML/SVG Source increment only; Data bindings, controllers and resolvers are outside this teaching slice.
