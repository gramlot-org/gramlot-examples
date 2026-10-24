# Run a controller from a button

**Sample data:** `01-button_controller_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

A controller inside a button runs when you click it. You learn how the button supplies click parameters, including modifier keys, to the action.

**Uses:** Data binding and local button controllers — core 0.2.0.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Use one declared button mechanism and inspect its click parameters.

**Before this lesson:** [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c05 · Node methods](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/05-node_methods.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c06 · Button controller** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

## Read the page

The first button has a nested controller; the others use `fire` or `fire_<name>`. Mechanism precedence is not a choice: combining mechanisms on one button is an error. A mechanism makes it a non-submit button.

```python
button = nested.button("Press me, also with Shift or Alt", id="press")
button.dataController("this.SET('.clicks', button_counter)")
```

This reduced excerpt focuses on the counter; the provided page also writes modifier keys. `button_counter`, modifier booleans and `_evt` are supplied by Gramlot.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Click the first button with Shift: counter 1 and keys Shift.
2. Click Save with Alt: the result says “fired with Alt”.
3. Click Save and close without modifiers: the log receives “save, close” in declaration order.

## Change it and check yourself

Add another click to the first button without modifiers.

**Answer:** the counter is 2 and keys becomes none. You did not write a counter-increment routine or extract modifiers from the browser event yourself.

## The same example across stages

In the later **0.2.14** [c11 · Call on click](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/04-rpc/01-server_calls/03-call_on_click.md), the same nested-button pattern uses `dataRpc` for a server call. The framework supplies dispatch, response/error handling and result placement, so a click controller does not have to coordinate the request itself. Both stages remain explicit; local actions do not suddenly imply server persistence.

## Limits and next step

The counter belongs to the button and survives a rebuild of that node; a newly created button is not the same identity. Do not add an `action` to the existing nested-controller button.

Continue with [c07 · Events](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/07_events.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-075) explains the full contract.

</details>
