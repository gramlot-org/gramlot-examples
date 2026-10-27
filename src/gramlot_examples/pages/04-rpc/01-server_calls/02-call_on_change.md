# Call the server when a value changes

**Try this:** Change the quantity several times quickly. A request starts after you pause typing; compare the status and returned quote.

A field requests a result when its value changes. You learn how a delay groups nearby edits and how the page distinguishes a pending request from the last received result.

**Uses:** Data binding and delayed reactive `dataRpc` calls.

<details>
<summary>More detail</summary>

**Goal:** Debounce an endpoint call and distinguish pending from received values.

**Before this lesson:** [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/01-endpoint.md).

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

Continue with [c11 · Call on click](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/03-call_on_click.md). The [server calls guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/098-server-calls.md#gc-095-100) explains the full contract.

**Sample data:** `02-call_on_change_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
