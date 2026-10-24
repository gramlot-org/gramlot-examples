# Define and call a server endpoint

**Sample data:** `01-endpoint_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

An endpoint receives parameters and returns a value that appears in the page. You learn how `dataRpc` puts the result in Data without writing request and response handling yourself.

**Uses:** Data binding and `dataRpc` — core 0.2.14. The host runs the endpoint: Python, Node/Bun or the standalone Worker.

<details>
<summary>More detail</summary>


**Release stage:** Endpoint calls (core 0.2.14), after the local 0.2.0 lessons.

**Goal:** Follow a declarative endpoint call from parameters to Data.

**Before this lesson:** [c01 · Formula](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md), [c08 · End-to-end story](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/04-complete_examples/01-end_to_end.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c09 · Endpoint** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands.

## Read the page

An endpoint computes a **value**, not Source. Python marks `with_vat` with `@endpoint`; JavaScript calls `Page.registerEndpoint('with_vat')`. `dataRpc` supplies the call and result placement.

```python
pane.dataRpc("with_vat", result_path=".gross", price="=.price", rate="=.rate", _init=True)
```

`=` reads values for the initial call without making them triggers. `_init` runs after initial Data and defaults are installed. Python receives keyword arguments and declares `**kwargs` for additional authored arguments; JS receives one object. Each server call creates a fresh Page, so its fields are not session storage.

Both twins round the total half up to the cent with `floor(x + 0.5) / 100`. Python's `round` rounds half to even and `Math.round` rounds half up, so for price 0.5 and rate 1 Python `round` gives 0.5 and `Math.round` gives 0.51.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Endpoint/fragment methods execute there too; bindings and any Logic execute in the browser. A Worker is not a private server.

## Try it and predict the result

1. Expect Price 12.5, VAT rate 22 and, after the response, Total 15.25.
2. On an HTTP environment, filter Network requests for RPC envelopes with `name: "with_vat"`; bootstrap/main is a separate call. In standalone this uses Worker messages, not HTTP.

## Change it and check yourself

Change `invoice.price` to 20 in `01-endpoint_data.tytx` and reload.

**Answer:** total 24.4, from `floor(20 * 122 + 0.5) / 100`. `result_path` directs the value into Data; the existing `^.gross` display then follows without a separate response-to-DOM handler.

## The same example across stages

Revisit c01’s computed gross. There the browser owns the formula; here the Page endpoint owns it and `dataRpc` declares transport/result handling. This adds a server boundary, so it is not a claim of fewer total lines than a local formula. The simplification is removing request-envelope and result-routing code from the application.

## Limits and next step

This lesson sends one initial call; it has no live price control or persistence. VAT is a percentage, unlike c01’s fractional rate. Do not infer login or database integration from an endpoint.

Continue with [c10 · Call on change](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/10_call_on_change.md). The [server calls guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/098-server-calls.md#gc-095-100) explains the full contract.

</details>
