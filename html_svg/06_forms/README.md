# 06 · Native forms

Native inputs, labels, selects, states and buttons.

## Run and files

From the repository root, run `.venv/bin/python examples/00-runner/serve.py` after the [runner prerequisites](../../00-runner/README.md). Open `http://127.0.0.1:8080/` and select **Native forms** and choose Python or JavaScript. Prerequisites: a local Python environment with Gramlot installed, the repository JavaScript dependencies and the runner adapter setup. `page.py` is the primary example; `page.js` builds the equivalent Source. Both load `/themes/gramlot-base/theme.css`, plus local `style.css` for layout. The direct routes are `/py/e06` and `/js/e06`. The runner provides source links beside the rendered page.

## How it works

Fieldsets group text, search, URL, telephone, password, numeric, date/time, color, range, select, textarea, checkbox, radio and file controls. Reset is a native form action. The Python and JavaScript node APIs expose the `label` tag through `gramlot_label(...)` because `label` is also a node property. Python uses `root.tag(..., attr=value)` and JavaScript uses `root.tag(value, {attr: value})`; both build Gramlot Source with the same visible result. Helper methods, where used, are ordinary page methods and are not exposed as remote endpoints.

## Try it

Change an initial value and check Reset; add a select option.

## Limits

Submit is disabled: no request endpoint or declared form handling exists. Values are local browser control state only. This example uses the native HTML/SVG Source increment only; Data bindings, controllers and resolvers are outside this teaching slice.
