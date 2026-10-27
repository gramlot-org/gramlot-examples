# Call methods on a Source node

**Try this:** Try SET, PUT and FIRE and compare the value with the notification counter. GET reads the stored value, including a silent PUT.

Buttons read and change Data in different ways. You learn the difference between notifying writes, quiet writes, reads and fired events.

**Uses:** Source, Data and local node methods.

<details>
<summary>More detail</summary>

**Goal:** Distinguish notifying writes, quiet writes, reads and fired events.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/02-binding/01-paths_and_updates/01-pointers.md), [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/02-controller.md), [c04 · Inline expressions](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/01-logic/04-inline_expressions.md).

## Read the page

The actions call methods of their Source node: `SET` writes and notifies, `GET` reads, `PUT` writes quietly, `FIRE` notifies even for the same fired value and silently resets afterwards. `FIRE_AFTER` schedules a fire in milliseconds and belongs to the node’s lifetime.

The notification counter is an observer of `.value`; `.read` is only a displayed snapshot made by GET value.

Python builds Source on the server; its JavaScript counterpart builds it on Node/Bun or in a standalone Worker. Bindings, actions and any Logic execute in the browser; Python strings containing JavaScript are not executed by Python.

## Try it and predict the result

1. Start with value 0 and notification count 0. Click PUT: the displayed value stays 0.
2. Click GET value: its snapshot shows 10. Click SET: it reads 10, writes 11 and the displayed value becomes 11; notifications become 1.
3. Fire “now” twice: pings advance twice. FIRE_AFTER reports “later” after about one second.

## Change it and check yourself

Reload and click PUT twice, then GET value, then SET.

**Answer:** snapshot 20, then displayed value 21 and one notification. Quiet writes change Data even though subscribed displays have not been notified.

## Limits and next step

PUT is not a second state store and does not mean the write failed. Do not use it when other views must update immediately. A delayed fire is cancelled when its owning node is removed.

Continue with [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/03-controllers/02-actions/01-button_controller.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-065) explains the full contract.

**Sample data:** `05-node_methods_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
