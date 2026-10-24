# Combine inputs, calculations and server calls

**Sample data:** `01-end_to_end_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

A small order form combines fields, a total and an SVG preview. Start with the **0.2.0 local part**, where bindings and controllers update the page.

After **Endpoint** and **Call on click**, return to the **0.2.14 quote section**. It sends the same inputs only when you request a quote; a failed request keeps the previous quote.

**Uses:** Local binding and controllers first; endpoint calls with `dataRpc` later. The module layout is from 0.2.5. No order persistence.

<details>
<summary>More detail</summary>


**Release stage:** first the local core 0.2.0 story, then a separately labelled core 0.2.14 endpoint extension. The maintained Page/Logic module arrangement is from 0.2.5; it does not move the original local behavior into that release.

**Goal:** Explain the local page first, then revisit the same inputs to request a server result and handle its failure.

**Before this lesson:** [b03 · Setters and defaults](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/03-setters_and_defaults.md), [b05 · Checkbox and radio](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/02-editing/02-checkbox_radio.md), [b07 · Bound SVG](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/03-presentation/02-bound_svg.md), [b08 · Freeze](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/04-freeze.md), [c01 · Formula](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/01-formula.md), [c03 · Named logic](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/03-named_logic.md), [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/02-actions/01-button_controller.md). These prerequisites support the local stage. Return for the 0.2.14 section only after [c09 · Endpoint](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/01-endpoint.md) and [c11 · Call on click](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/03-call_on_click.md).

**Open and edit:** select **c08 · End-to-end story** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

This is the **local 0.2.0 story**, with the maintained 0.2.5 Logic-module arrangement. The sample companion initializes caption, radio flags and gift choice; defaults initialize quantity and live editing. Formulas derive total/radius and the named `paint` controller selects color. Named button controllers handle press and freeze; the Logic finds the `later` and `notes` nodes by their `nodeId` with `gramlot.src.builder.nodeById`.

```python
pane.dataFormula(".total", "quantity * (large ? 3 : 1) + (gift ? 5 : 0)",
                 quantity="^.quantity", large="^.size.large", gift="^.gift", _init=True)
```

The caption comes from `01-end_to_end_data.tytx` before render. It does not arrive late over a network. The SVG and freeze sections are optional local depth: neither is required for the later server request. Leave the separately labelled quote section alone during this first pass; it sends no request at startup or when fields change.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python. Read the gallery’s **logic.js** tab (the Logic class from `08_end_to_end.js`) beside the Python source.

## Try it and predict the result

First pass: core 0.2.0, using only the local sections.

1. Initially expect “The story of a page”, quantity 2, Small, no gift, total 2 and radius 28.
2. Choose Large, then Gift wrap: total becomes 11, radius 64, and paint makes the circle red because total is greater than 10.
3. Press with Shift: “Pressed 1 times” and “with Shift”. Freeze, remove a note, then thaw: the list goes from two visible notes to one at thaw.

## Change it and check yourself

Reload and change quantity to 3, leaving the field, while Small and no gift remain selected.

**Answer:** total 3 and radius 32. Then select Large: total 9 and radius 56. Explain the chain input → Data → formula → SVG pointer; there is no explicit circle-update routine.

## Return after c09/c11: the 0.2.14 server step

Reload before this trial. The first stage remains above: the same form owns
quantity, size and gift, and the local formula still drives total/radius/color.
The new section declares a button and a separate result/error display:

```python
quotes.button("Request quote", type="button", id="request-quote").dataRpc(
    "quote", result_path=".quote", quantity="=.quantity",
    large="=.size.large", gift="=.gift",
    _onResult="this.SET('.quote_error', null)",
    _onError="this.SET('.quote_error', error.code + ': ' + error.message)")
```

`quote` is an endpoint method on Page, not on browser Logic. Python uses
`@endpoint`; JS uses `Page.registerEndpoint('quote')`. It rejects null or a
quantity below one, then returns a number. The host executes this method (in the
standalone JS environment, the Worker is that host). It does not save an order.

The `=` arguments are read when the button requests a quote. They do not trigger
requests on edits and are not frozen copies of the initial values. `result_path`
writes `.quote`; the display follows `^.quote`. A successful response clears the
previous error through `_onResult`. A failure writes `.quote_error` through
`_onError` and leaves the last successful quote unchanged. **Server quote is a
snapshot, not a live promise for the currently edited fields.**

### Predict, request, fail and recover

1. After reload, local total is 2 and Server quote/Request error are blank.
   No `quote` endpoint call has run.
2. Request quote: expect 2. Choose Large and Gift wrap: local total becomes 11,
   but Server quote stays 2. Request again: it becomes 11.
3. Set Quantity to 0, leave the field and request: local total is 5, the server
   displays `application_error: Choose at least one item`, and its last quote
   remains 11. Clearing Quantity also sends null and is refused by this endpoint.
4. Set Quantity to 3, leave the field and request: expect quote 14 and an empty
   error. The existing SVG and local controls continue working throughout.

If inspecting network traffic, count only `contentType: data`, `name: quote`:
initial Source loading is a different call. In a Worker environment the request
uses its transport, not necessarily HTTP.

### Independent source-change exercise

Add a fixed delivery charge of 4 to the **endpoint's returned number only**:

```python
return quantity * (3 if large else 1) + (5 if gift else 0) + 4
```

In the JS equivalent, add `+ 4` to `quote`'s return expression. Keep the local
formula, the request declaration and the bound display unchanged. Reload, choose
Large and Gift wrap at quantity 2, then request.

**Answer:** local total stays 11; Server quote becomes 15. No new event listener,
request serialization or result-copying controller is needed. Quantity 0 is still
refused and preserves 15. Restore the original endpoint after the exercise.
The two calculations are deliberately retained to compare client preview and
host result, not offered as a shared production pricing implementation.

## The same example across stages

| Stage | What runs | What the learner authors |
| --- | --- | --- |
| 0.2.0 local story | Browser bindings, formula, named paint/button Logic | One local calculation; pointers reuse it for text and SVG. No server quote exists at this stage. |
| 0.2.5 maintained module layout | Named browser Logic beside the Python Page | A shared Logic module for both language pages; this changes organization, not the earlier local result. |
| 0.2.14 extension | A Page endpoint when the new button runs | Endpoint rule, `dataRpc`, result pointer and small error/success callbacks. Gramlot owns transport and result assignment. |

Preserving the earlier stage makes the added responsibility visible. The later
page has more total code because it does more; the simplification is that calling
the host does not require application request plumbing or manual synchronization
of the result display. The endpoint does not replace a perfectly adequate local
formula just to make the example shorter.

At **0.2.16**, compare [c12 · Remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/02-remote_data/01-remote.md)
when the host must construct a Source fragment, or [c14 · Data remote](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/02-remote_data/03-data_remote.md)
when a Data value should load lazily when read. This explicit quote action needs
a value now, so it uses `dataRpc`; the page does not combine all three mechanisms.

## Limits and next step

This is an arithmetic teaching example, not persistence, stock reservation or a
production order flow. A server Page is fresh per request; the request parameters
carry the values and the browser Data holds the returned snapshot. There is no
remote Source or lazy resolver in c08. Inline formulas/callbacks require the stated
CSP profile. Closing/disposal releases providers/listeners; the lesson does not
qualify every timing, transport or lifecycle edge case.

On the **first local pass**, continue with [c15 · Lifecycle](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/03-events/02-lifecycle.md), then projection and Data exchange before c09–c11.
After returning for the **0.2.14 extension**, continue with c11's separately
labelled 0.2.15 Source-auth section, then c12–c14 at 0.2.16. The
[data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-080)
provides the full contract. Do not install old packages to perform these stages.

</details>
