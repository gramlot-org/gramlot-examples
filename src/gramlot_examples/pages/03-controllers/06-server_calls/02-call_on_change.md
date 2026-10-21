# 10 · Call on change

A field requests a result when its value changes. You learn how a delay groups nearby edits and how the page distinguishes a pending request from the last received result.

**Uses:** Data binding and delayed reactive `dataRpc` calls — core 0.2.14.

<details>
<summary>More detail</summary>


**Release stage:** Endpoint calls (core 0.2.14), after the local 0.2.0 lessons.

**Goal:** Debounce an endpoint call and distinguish pending from received values.

**Before this lesson:** [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/06-server_calls/01-endpoint.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c10 · Call on change** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

The `quote` endpoint charges 10 each below quantity 10 and 8 each from 10 onward. `quantity="^.quantity"` triggers calls; `_delay=500` waits for a pause. `_onCalling` writes status before sending, `_onResult` after writing `.total`.

```python
pane.dataRpc("quote", result_path=".total", quantity="^.quantity", _delay=500, _init=True,
             _onCalling="this.SET('.status', 'Asking the server for ' + quantity)",
             _onResult="this.SET('.status', 'Answered ' + result + ' for ' + quantity)")
```

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Endpoint/fragment methods execute there too; bindings and any Logic execute in the browser. A Worker is not a private server.

## Try it and predict the result

1. Wait for “Answered 10 for 1”.
2. Replace Quantity with 12, then stop typing. After the pause and response expect total 96 and “Answered 96 for 12”.
3. On HTTP inspect `quote` calls; multiple edits inside a single 500 ms quiet window are combined, but edits spaced farther apart can each call.

## Change it and check yourself

Try quantities 9 and 10 separately, waiting for each answer.

**Answer:** totals 90 and 80. The endpoint’s threshold, not a client display trick, changes the unit price. A slow network can make the Asking status easier to see.

## The same example across stages

c02 used `_delay` for a local search-status effect. c10 reuses that declaration for a server computation; no additional application timer, fetch call or separate result-to-Data write is needed. The endpoint calculation remains server code.

## Limits and next step

Debounce is not a guarantee of one request for all typing patterns. `_delay` replaces the call that is scheduled, never the call in flight: one call is in flight at a time, its answer is always written, the first trigger during the flight waits with its arguments and is sent when the answer arrives, and later triggers do nothing while one waits. A result `false` from `_onCalling` makes no call. Callbacks here are inline and need the permitted CSP profile.

Continue with [c11 · Call on click](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/11_call_on_click.md). The [server calls guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/098-server-calls.md#gc-095-100) explains the full contract.

</details>
