# 03 · Named logic

The code of this page lives in `class Logic`, which `03_named_logic.js` exports beside `Page`. The core GramlotFileServer serves that module as the page logic for the JavaScript page and for the Python page `03_named_logic.py` alike.

- `func='finalPrice'` names a method of `Logic`. A formula method receives one object with the resolved parameters and returns the result: 10% off from the `threshold`.
- A controller method receives its Source node and the parameters. `node.SET('.changes', …)` writes relative to the node's context.
- `this` is the logic group: `this.changes` keeps a count between calls, and `this.page` is the Gramlot page.
- The parameters also carry `_reason`, `_node` and `_triggerpars`.

Named logic compiles nothing at run time, so it also works under a Content Security Policy without `'unsafe-eval'`.

**Try it:** Raise the price above 100, then add a second formula that names `finalPrice` with another threshold.
