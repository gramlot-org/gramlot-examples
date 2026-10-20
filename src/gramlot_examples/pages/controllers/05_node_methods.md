# 05 · Node methods

Buttons read and change Data in different ways. You learn the difference between notifying writes, quiet writes, reads and fired events.

**Uses:** Source, Data and local node methods — core 0.2.0.

<details>
<summary>More detail</summary>


**Release stage:** Data binding and browser behavior (core 0.2.0).

**Goal:** Distinguish notifying writes, quiet writes, reads and fired events.

**Before this lesson:** [b01 · Pointers](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/binding/01_pointers.md), [c02 · Controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/02_controller.md), [c04 · Inline expressions](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/04_inline_expressions.md). These prerequisites support the release sequence; later comparisons are explicitly labelled below.

**Open and edit:** select **c05 · Node methods** in your environment’s gallery. For source changes, copy/edit the matching page in your own project using the [setup guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/025-try.md); the gallery is a source viewer. Save, then reload/reopen as that guide explains. The snippets below are excerpts/edits within that Page, not standalone launch commands. This lesson executes authored inline JavaScript and needs the gallery’s permissive CSP profile; a strict named-Logic starter needs the corresponding named form.

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

Continue with [c06 · Button controller](https://github.com/gramlot-org/gramlot-examples/blob/main/src/gramlot_examples/pages/controllers/06_button_controller.md). The [data binding guide](https://github.com/gramlot-org/gramlot/blob/main/docs/public/097-data-binding.md#gc-095-065) explains the full contract.

</details>
