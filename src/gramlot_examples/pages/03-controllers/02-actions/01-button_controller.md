# Run a controller from a button

**Try this:** Press the first button normally, then with Shift or Alt. Its nested controller receives the click count and modifiers; the other buttons fire Data paths.

A controller inside a button runs when you click it. You learn how the button supplies click parameters, including modifier keys, to the action.

**Uses:** Data binding and local button controllers.

<details>
<summary>More detail</summary>

**Goal:** Use one declared button mechanism and inspect its click parameters.

**Before this lesson:** [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c05 · Node methods](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/05-node_methods.md).

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

Continue with [c07 · Events](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/03-events/01-events.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-075) explains the full contract.

**Sample data:** `01-button_controller_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
